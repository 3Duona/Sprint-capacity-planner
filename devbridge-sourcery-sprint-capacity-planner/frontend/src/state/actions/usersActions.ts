import * as actionTypes from './actionTypes';

export const AddUsersAction = (props) => ({
  type: actionTypes.ADD_USERS,
  payload: props,
});
