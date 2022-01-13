import * as actionTypes from './actionTypes';

export interface loginDetailsType {
  username: string;
  password: string;
  role: string;
  remember: boolean;
}

interface stateDetailsType {
  username: string;
  id: number;
  teamRole: string;
  role: string;
}

export const setLoginState = (details: stateDetailsType) => ({
  type: actionTypes.LOGIN,
  payload: details,
});

export const logoutAction = () => ({
  type: actionTypes.LOGOUT,
});
