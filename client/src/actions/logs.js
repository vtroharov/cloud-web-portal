import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_LOG,
  GET_LOGS,
  LOG_ERROR,
  DELETE_LOG,
  DELETE_LOGS
} from './types';

// Get All Logs
export const getLogs = () => async dispatch => {
  try {
    const res = await axios.get('api/logs');

    dispatch({
      type: GET_LOGS,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: LOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get Logs by User ID
export const getLogsUser = (userId) => async dispatch => {
  try {
    const res = await axios.get(`api/logs/user/${userId}`);

    dispatch({
      type: GET_LOGS,
      payload: res.data
    });

  } catch (err) {
    if(userId) {
      dispatch({
        type: LOG_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Get Log by ID
export const getLogId = (logId) => async dispatch => {
  try {
    const res = await axios.get(`api/logs/${logId}`);

    dispatch({
      type: GET_LOG,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: LOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create a Log
export const createLog = (data) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.post('/api/logs', data, config);

    dispatch({
      type: GET_LOG,
      payload: res.data
    });

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  
    dispatch({
      type: LOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete Log
export const deleteLog = (id) => async dispatch => {
  try {
    const res = await axios.delete(`api/logs/${id}`);

    dispatch({
      type: DELETE_LOG,
      payload: res.data
    });

    dispatch(setAlert('Log Deleted', 'success'));

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete All Logs
export const deleteLogs = () => async dispatch => {
  try {
    const res = await axios.delete(`api/logs`);

    dispatch({
      type: DELETE_LOGS,
      payload: res.data
    });

    dispatch(setAlert('All Logs Deleted', 'success'));

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};



