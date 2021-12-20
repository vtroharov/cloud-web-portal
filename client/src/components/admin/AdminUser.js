import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUsers, updateUser, deleteUser } from '../../actions/admin';
import Spinner from '../layout/Spinner';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import styles from "../layout/classes";
const useStyles = makeStyles(styles);

const AdminUser = ({ getUsers, updateUser, deleteUser, auth: { user, loading }, admin: { users } }) => {
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const classes = useStyles();

  const [chosenUser, setChosenUser] = useState('');
  let { name, email, team, role, permissions } = chosenUser;
  const onChange = e => setChosenUser({...chosenUser, [e.target.name]: e.target.value});

  const [selectedUser, setSelectedUser] = useState('');
  const handleChange = (e) => {
    setSelectedUser(e.target.value);
  };

	const onSubmit = async e => {
    e.preventDefault();
    if (!name) name = users[selectedUser-1].name;
    if (!email) email = users[selectedUser-1].email;
    if (!team) team = users[selectedUser-1].team;
    if (!role) role = users[selectedUser-1].role;
    if (!permissions) permissions = users[selectedUser-1].permissions;
    await updateUser({name, email, team, role, permissions});
    setSelectedUser('');
    setChosenUser('');
    await getUsers();
  }
  
  const deleteUserId = async () => {
    if (!email) email = users[selectedUser-1].email;
    await deleteUser(users[selectedUser-1]._id, email);
    setSelectedUser('');
    setChosenUser('');
    await getUsers();
  }

  return ( loading && users === null ? <Spinner /> :
    <Box component='div' className={classes.container}>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-helper-label">User</InputLabel>
        <Select
          labelId="select-helper-label"
          id="select-helper"
          value={selectedUser}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {users.map((user, index) => (
            <MenuItem key={user._id} value={index+1}>
              {user.email}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Please Select a User to modify</FormHelperText>
      </FormControl>
      {selectedUser ? (
      <Box component='div' className={classes.smallContainer}>
        <form className={classes.form} onSubmit={e => onSubmit(e)}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                fullWidth
                id="name"
                label="Name"
                required
                value={name ? name : users[selectedUser-1].name}
                onChange={e => onChange(e)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField disabled={true}
                variant="outlined"
                fullWidth
                id="email"
                label="Email"
                required
                name="email"
                autoComplete="email"
                value={email ? email : users[selectedUser-1].email}
                onChange={e => onChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="team"
                name="team"
                variant="outlined"
                fullWidth
                id="team"
                label="Team"
                required
                value={team ? team : users[selectedUser-1].team}
                onChange={e => onChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="role"
                name="role"
                variant="outlined"
                fullWidth
                id="role"
                label="Role"
                required
                value={role ? role : users[selectedUser-1].role}
                onChange={e => onChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="permissions"
                name="permissions"
                variant="outlined"
                required
                fullWidth
                id="permissions"
                label="Permissions"
                value={permissions ? permissions : users[selectedUser-1].permissions}
                onChange={e => onChange(e)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            // fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Update
          </Button>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            className={classes.submut}
            onClick={() => deleteUserId()}
          >
            Delete
          </Button>
        </form>
      </Box>
      ): null}
    </Box>
  );
}

AdminUser.propTypes = {
  getUsers: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  admin: state.admin
});

export default connect(mapStateToProps, { getUsers, updateUser, deleteUser })(AdminUser);
