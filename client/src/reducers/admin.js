import { 
  ADMIN_GET_USERS,
  ADMIN_GET_USER,
  ADMIN_ERRORS,
  UPDATE_SUCCESS,
  UPDATE_ERROR
} from '../actions/types';

const initialState = {
  user: null,
  users: [],
  loading: true,
  error: {}
}

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case ADMIN_GET_USERS:
      return {
        ...state,
        users: payload,
        loading: false
      }
    case ADMIN_GET_USER:
      return {
        ...state,
        user: payload,
        loading: false
      }
    case ADMIN_ERRORS:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case UPDATE_SUCCESS:
      return {
        ...state, 
        ...payload, 
        loading: false
      }
    case UPDATE_ERROR:
      return {
        ...state,
        loading: false
      }
    default:
      return state;
  }
}