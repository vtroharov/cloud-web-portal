import { 
  GET_APP,
  GET_APPS,
  APP_ERROR,
  UPDATE_APP,
  DELETE_APP,
  GET_NUMBER
} from '../actions/types';

const initialState = {
  app: null,
  apps: [],
  number: null,
  loading: true,
  error: {}
}

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case GET_APP:
    case UPDATE_APP:
      return {
        ...state,
        app: payload,
        loading: false
      }
    case GET_APPS:
      return {
        ...state,
        apps: payload,
        loading: false
      }
    case DELETE_APP:
      return {
        ...state,
        app: null,
        loading: false
      }
    case GET_NUMBER:
      return {
        ...state,
        number: payload,
        loading: false
      }
    case APP_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      }
    default:
      return state;
  }
}