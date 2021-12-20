import axios from 'axios';
import { 
  REGISTER_SUCCESS, 
  REGISTER_FAIL,
  LOGIN_SUCCESS, 
  LOGIN_FAIL, 
  LOGOUT,
  USER_LOADED, 
  AUTH_ERROR
} from './types';

import { setAlert } from './alert';
import { createLog } from './logs';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async (dispatch) => {
  if(localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
}


// Register User
export const register = ({ name, email, team, password }) => async dispatch => {
  const config = {
    headers: { 'Content-Type': 'application/json' }
  }
  const body = JSON.stringify({ name, email, team, role: 'user', password });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch ({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(createLog({desc: `User "${email}" has successfully Registered.`}));

    dispatch(loadUser());

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: REGISTER_FAIL
    });
    dispatch(createLog({desc: `User "${email}" has failed to Register.`}));
  }
};


// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: { 'Content-Type': 'application/json' }
  }
  const body = JSON.stringify({ email, password});

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch ({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(createLog({desc: `User "${email}" has successfully loged in.`}));
    
    dispatch(loadUser());

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAIL
    });
    dispatch(createLog({desc: `User "${email}" has failed to log in.`}));
  }
};

// Logout / Clear Profile
export const logout = (email) => dispatch => {
  dispatch({ type: LOGOUT });
  dispatch(createLog({desc: `User "${email}" has logged out.`}));
};