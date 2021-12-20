import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';


import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import styles from "../layout/classes";
const useStyles = makeStyles(styles);

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
		name: '',
		email: '',
		team: '',
		password: '',
		password2: ''
	});

	const classes = useStyles();

	const { name, email, team, password, password2 } = formData;

	const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});

	const onSubmit = async e => {
		e.preventDefault();
		if (password !== password2) {
			setAlert('Passwords do not match', 'danger');
		} else {
			register({ name, email, team, password });
		}
	}

	if(isAuthenticated) {
		return <Redirect to='/dashboard' />;
	}

  return (
    <div className="landing">
			<Container component="main" maxWidth="sm">
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Register
					</Typography>
					<form className={classes.form} onSubmit={e => onSubmit(e)}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="name"
									name="name"
									variant="outlined"
									required
									fullWidth
									id="name"
									label="Name"
									value={name}
									onChange={e => onChange(e)}
									autoFocus
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="team"
									name="team"
									variant="outlined"
									required
									fullWidth
									id="team"
									label="Team"
									value={team}
									onChange={e => onChange(e)}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									value={email}
									onChange={e => onChange(e)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
									value={password}
									onChange={e => onChange(e)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="password2"
									label="Confirm Password"
									type="password"
									id="password2"
									autoComplete="current-password"
									value={password2}
									onChange={e => onChange(e)}
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Sign Up
						</Button>
						<Grid container justify="flex-end">
							<Grid item>
								<Link className="link" to='/' color='rgb(105, 105, 105)'>
										Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
		</div>
  );
}

Register.propTypes = {
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
