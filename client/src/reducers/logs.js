import { 
  GET_LOG,
  GET_LOGS,
  LOG_ERROR,
  DELETE_LOG,
  DELETE_LOGS
} from '../actions/types';

const initialState = {
  log: null,
  logs: [],
  loading: true,
  error: {}
}

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case GET_LOG:
      return {
        ...state,
        log: payload,
        loading: false
      }
    case GET_LOGS:
      return {
        ...state,
        logs: payload,
        loading: false
      }
    case DELETE_LOG:
      return {
        ...state,
        log: null,
        loading: false
      }
    case DELETE_LOGS:
      return {
        ...state,
        logs: [],
        loading: false
      }
    case LOG_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      }
    default:
      return state;
  }
}