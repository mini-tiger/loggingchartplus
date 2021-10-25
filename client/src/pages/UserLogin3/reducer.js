import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
} from './constants';

// The initial state of the login
const initialState = {};

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case USER_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        loginResult: action.payload,
      });
    case USER_LOGIN_FAILURE:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    default:
      return state;
  }
}

export default loginReducer;
