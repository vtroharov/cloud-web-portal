import { 
  REGISTER_SUCCESS, 
  REGISTER_FAIL,
  LOGIN_SUCCESS, 
  LOGIN_FAIL,
  LOGOUT,
  USER_LOADED,
  AUTH_ERROR,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: {
    name: "",
    email: "",
    password: "",
    team: "",
    role: ""
  }
}

export default function(state = initialState, { type, payload }) {
  switch(type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      }
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state, 
        ...payload, 
        isAuthenticated: true,
        loading: false
      }
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: {
          name: "",
          email: "",
          password: "",
          team: "",
          role: "",
          permissions: []
        }
      }
    default:
      return state;
  }
}