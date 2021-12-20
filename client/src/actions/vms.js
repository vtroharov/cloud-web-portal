import axios from 'axios';
import { setAlert } from './alert';
import { createLog } from './logs';

import {
  GET_VM,
  GET_VMS,
  DELETE_VMS,
  VMS_ERROR,
  GET_VMS_RES
} from './types';

// Get All VMs
export const getVMs = () => async dispatch => {
  try {
    const res = await axios.get('api/vms');

    dispatch({
      type: GET_VMS,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: VMS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

// Get All VMs combined per Tenant
export const getVMsTenant = () => async dispatch => {
  try {
    const res = await axios.get('api/vms/tenant');

    dispatch({
      type: GET_VMS,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: VMS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

// Get All VMs per Tenant
export const getVMsPerTenant = (tenants) => async dispatch => {
  try {

    const res = await axios.get(`api/vms/tenant/${tenants}`);

    dispatch({
      type: GET_VMS,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: VMS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

// Get VM by name
export const getVM = (vmName) => async dispatch => {
  try {
    const res = await axios.get(`api/vms/vm/${vmName}`);

    dispatch({
      type: GET_VM,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: VMS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

// Store VMs
export const pushVMs = () => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = {};

    const res = await axios.post('/api/vms', body, config);
    
    dispatch({
      type: GET_VMS_RES,
      payload: res.data
    });
    dispatch(createLog({desc: `Virtual Machines Data Loaded.`}));
    
    if(res.data !== 0) {
      dispatch(setAlert(res.data[0] + " new VMs added, " + res.data[1] + " VMs updated.", 'success'));
    }

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  
    dispatch({
      type: VMS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(createLog({desc: `Virtual Machines Data failed to Load.`}));
  }
};

// Delete VMs
export const deleteVMs = () => async dispatch => {
  try {
    const res = await axios.delete('/api/vms');
    
    dispatch({
      type: DELETE_VMS,
      payload: res.data
    });
    dispatch(createLog({desc: `Virtual Machines Data Off Loaded.`}));

    dispatch(setAlert('Virtual Machines Deleted', 'success'));

  } catch (err) {
    const errors = err.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: VMS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    dispatch(createLog({desc: `Virtual Machines Data faile to Offload.`}));
  }
};