import moment from 'moment';

import API from '../../domain/Api';
import { AddDaysOffAction, EditDaysOffAction, RemoveDaysOffAction } from '../actions/daysOffActions';
import { AddUsersAction } from '../actions/usersActions';

export const AddDayOff = (props) => (dispatch, getState) => {
  const startDate = moment(new Date(props.startDate)).format('YYYY-MM-DD');
  const endDate = moment(new Date(props.endDate)).format('YYYY-MM-DD');
  API.post(
    `api/users/${getState().login.user.id}/availability`,
    {
      StartDate: startDate,
      EndDate: endDate,
      DaysCount: props.count,
      Reason: props.reason,
    },
    { withCredentials: true }
  )
    .then((response) => {
      dispatch(AddDaysOffAction({ ...props, id: response.data.id, startDate: startDate, endDate: endDate }));
    })
    .catch((err) => console.log(err));
};

export const EditDayOff = (props) => (dispatch) => {
  API.patch(
    `api/availability/${props.id}`,
    {
      StartDate: moment(new Date(props.startDate)).format('YYYY-MM-DD'),
      EndDate: moment(new Date(props.endDate)).format('YYYY-MM-DD'),
      DaysCount: props.count,
      Reason: props.reason,
    },
    { withCredentials: true }
  )
    .then(() => dispatch(EditDaysOffAction(props)))
    .catch((err) => console.log(err));
};

export const RemoveDayOff = (props) => (dispatch) => {
  API.delete(`api/availability/${props.id}`, { withCredentials: true })
    .then(() => dispatch(RemoveDaysOffAction(props)))
    .catch((err) => console.log(err));
};

export const LoadUsers = () => (dispatch) => {
  API.get('api/users/all', { withCredentials: true }).then((response) => {
    dispatch(AddUsersAction(response.data));
  });
};
