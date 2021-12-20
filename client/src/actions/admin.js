import axios from 'axios';
import { setAlert } from './alert';
import { createLog } from './logs';

import { 
  ADMIN_GET_USERS,
  ADMIN_GET_USER,
  ADMIN_ERRORS,
  UPDATE_SUCCESS,
  UPDATE_ERROR
} from './types';

// Get Users
export const getUsers = () => async dispatch => {
  try {
    const res = await axios.get('/api/auth/email');

    dispatch ({
      type: ADMIN_GET_USERS,
      payload: res.data,
    });

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: ADMIN_ERRORS,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get User by Email
export const getUser = (email) => async dispatch => {
  try {
    const res = await axios.get(`/api/auth/email/${email}`);

    dispatch ({
      type: ADMIN_GET_USER,
      payload: res.data,
    });

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: ADMIN_ERRORS,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update User
export const updateUser = ({ name, email, team, role, permissions }) => async dispatch => {
  const config = {
    headers: { 'Content-Type': 'application/json' }
  }
  const body = JSON.stringify({ name, email, team, role, permissions });

  try {
    const res = await axios.put('/api/users', body, config);

    dispatch ({
      type: UPDATE_SUCCESS,
      payload: res.data
    });

    dispatch(setAlert('User Updated', 'success'));
    dispatch(createLog({desc: `User "${email}" has been Updated.`}));

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: UPDATE_ERROR
    });
    dispatch(createLog({desc: `User "${email}" failed to Update.`}));
  }
};

// Delete User
export const deleteUser = (userId, email) => async dispatch => {
  try {
    
    const res = await axios.delete(`/api/users/${userId}`);

    dispatch ({
      type: UPDATE_SUCCESS,
      payload: res.data
    });

    dispatch(setAlert('User Deleted', 'success'));
    dispatch(createLog({desc: `User "${email}" has been Deleted.`}));

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: UPDATE_ERROR
    });
    dispatch(createLog({desc: `User "${email}" failed to Delete.`}));
  }
};