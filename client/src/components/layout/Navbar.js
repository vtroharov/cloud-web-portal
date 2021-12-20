import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

import styles from "../layout/classes";
const useStyles = makeStyles(styles);
  
const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const classes = useStyles();

  const logMeOut = () => {
    logout(user.email);
  }

	const authLinks = (
    <ul>
      { user.role === 'admin' ?
      <li>
        <Link className="link" to="/admin">
          <i className="fas fa-user-cog"></i>{' '}
          <span className="hide-sm">Admin</span>
        </Link>
      </li> : null }
      <li>
        <Link className="link" to="/request">
          <i className="fas fa-plus-circle"></i>{' '}
          <span className="hide-sm">Requests</span>
        </Link>
      </li>
      <li>
        <Link className="link" to="/">
          <i className="fas fa-tachometer-alt"></i>{' '}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <Link className="link" onClick={logMeOut} to='/'>
					<i className="fas fa-sign-out-alt"></i>{' '}
					<span className="hide-sm">Logout</span>
				</Link>
      </li>
		</ul>
  );

  const guestLinks = (
    <ul>
      <li className={classes.navBar}><Link className="link" to="/register">Register</Link></li>
    </ul>
	);

  return (
    <nav className="navbar bg-light">
      <h1 className={classes.navBar}>
        <Link className="link" to="/"><i className="fab fa-mixcloud"></i> Cloud Web Portal</Link>
      </h1>
      { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>)}
    </nav>
  )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
