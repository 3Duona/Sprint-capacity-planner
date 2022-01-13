import * as actionTypes from '../actions/actionTypes';

export interface LoginState {
  isLogged: boolean;
  user: {
    username: string;
    id: number;
    teamRole: string;
    role: string;
  };
}

type LoginAction = {
  type: string;
  payload: {
    username: string;
    id: number;
    teamRole: string;
    role: string;
    remember: boolean;
  };
};

const initialState: LoginState = {
  isLogged: false,
  user: {
    username: '',
    id: -1,
    teamRole: '',
    role: 'USER',
  },
};

const reducer = (state: LoginState = initialState, action: LoginAction): LoginState => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        user: {
          username: action.payload.username,
          id: action.payload.id,
          teamRole: action.payload.teamRole,
          role: action.payload.role,
        },
        isLogged: true,
      };
    case actionTypes.LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
