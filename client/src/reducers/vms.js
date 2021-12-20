import { GET_VM, GET_VMS, VMS_ERROR, GET_VMS_RES, DELETE_VMS } from '../actions/types';

const initialState = {
  vm: null,
  vms: [],
  loading: true,
  error: {}
}

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch(type){
    case GET_VM:
      return {
        ...state,
        vm: payload,
        loading: false
      }
    case GET_VMS:
      return {
        ...state,
        vms: payload,
        loading: false
      }
    case DELETE_VMS:
      return {
        ...state,
        vms: null,
        loading: false
      }
    case VMS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case GET_VMS_RES:
      return {
        ...state,
        error: payload,
        loading: false
      }
    default:
      return state;
  }
}