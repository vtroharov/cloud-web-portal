import axios from 'axios';
import { setAlert } from './alert';
import { createLog } from './logs';

import {
  GET_APP,
  GET_APPS,
  APP_ERROR,
  UPDATE_APP,
  DELETE_APP,
  GET_NUMBER
} from './types';

// Get All Apps
export const getApps = () => async dispatch => {
  try {
    const res = await axios.get('api/application');

    dispatch({
      type: GET_APPS,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: APP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get Next Number
export const getNumber = () => async dispatch => {
  try {
    const res = await axios.get('api/application/number');

    dispatch({
      type: GET_NUMBER,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: APP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get Apps by User ID
export const getAppUser = (userId) => async dispatch => {
  try {
    const res = await axios.get(`api/application/user/${userId}`);

    dispatch({
      type: GET_APPS,
      payload: res.data
    });

  } catch (err) {
    if(userId) {
      dispatch({
        type: APP_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Get App by ID
export const getAppId = (appId) => async dispatch => {
  try {
    const res = await axios.get(`api/application/app/${appId}`);

    dispatch({
      type: GET_APP,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: APP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create and Update an App
export const createApp = (formData, edit=false) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.post('/api/application', formData, config);

    dispatch({
      type: GET_APP,
      payload: res.data
    });

    dispatch(setAlert(edit ? 'Application Updated' : 'Application Created', 'success'));
    dispatch(createLog(edit ? {desc: `Application "${formData.number}" status Updated to ${formData.status}.`} : {desc: `Application "${formData.number}" Created.`}));

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  
    dispatch({
      type: APP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(createLog(edit ? {desc: `Application "${formData.number}" failed to Update.`} : {desc: `Application "${formData.number}" failed to Create.`}));
  }
};

// Add a VM
export const addVM = (formData, appId) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    } 

    const res = await axios.put(`api/application/vms/${appId}`, formData, config);


    dispatch({
      type: UPDATE_APP,
      payload: res.data
    });
    dispatch(createLog({desc: `VM "${formData.name}" Created.`}));

    dispatch(setAlert('Virtual Machine Added', 'success'));

  } catch (err) {
    const errors = err.response.data.errors;

    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    } else if (err.response.data.msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
    dispatch({
      type: APP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(createLog({desc: `VM "${formData.name}" failed top Create.`}));
  }
};

// Delete a VM
export const deleteVM = (appId, vmId, vmName) => async dispatch => {
  try {
    const res = await axios.delete(`api/application/vms/${appId}/${vmId}`);

    dispatch({
      type: UPDATE_APP,
      payload: res.data
    });
    dispatch(createLog({desc: `VM "${vmName}" Deleted.`}));

    dispatch(setAlert('Virtual Machine Deleted', 'success'));

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: APP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(createLog({desc: `VM "${vmName}" failed to Delete.`}));
  }
};

// Delete App
export const deleteApp = (id, number) => async dispatch => {
  try {
    const res = await axios.delete(`api/application/${id}`);

    dispatch({
      type: DELETE_APP,
      payload: res.data
    });
    dispatch(createLog({desc: `Application "${number}" Deleted.`}));

    dispatch(setAlert('Application Deleted', 'success'));

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: APP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(createLog({desc: `Application "${number}" failed to Delete.`}));
  }
};




