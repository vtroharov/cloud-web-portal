import React, { useState }  from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


import styles from "../layout/classes";
const useStyles = makeStyles(styles);

const Landing = ({ login, auth: { isAuthenticated, user } }) => {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	const classes = useStyles();
	
	const { email, password } = formData;

	const onChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

	const onSubmit = async e => {
		e.preventDefault();
		await login(email, password);
	}

	// Redirect if Logged in
	if(isAuthenticated && user.role !== "") {
		if(user.role === 'admin'){
			return <Redirect to='/dashboard-admin' />;
		} else {
			return <Redirect to='/dashboard' />;
		}
	}

  return (
    <div className="landing">
			<Container component="main" maxWidth="xs">
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<form className={classes.form} onSubmit={e => onSubmit(e)}>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							value={email}
							onChange={e => onChange(e)}
						/>
						<TextField
							variant="outlined"
							margin="normal"
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
						{/* <FormControlLabel
							control={<Checkbox value="remember" color="primary" />}
							label="Remember me"
						/> */}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Sign In
						</Button>
					</form>
				</div>
			</Container>
		</div>
  );
}

Landing.propTypes = {
	login: PropTypes.func.isRequired,
	auth: PropTypes.object,
}

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps, { login })(Landing);
