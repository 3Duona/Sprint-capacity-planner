import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes';

export type DayOff = {
  id: number;
  startDate: Date;
  endDate: Date;
  daysCount: number;
  reason: string;
};

export type Roles = 'QA' | 'FE' | 'BE';

export const roleArray: string[] = ['QA', 'FE', 'BE'];

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  Capacity: number;
  teamRole: Roles;
  daysOff: DayOff[];
};

export type UsersState = {
  Users: User[];
};

const initialState: UsersState = {
  Users: [],
};

export const reducer = (state: UsersState = initialState, action): UsersState => {
  switch (action.type) {
    case actionTypes.ADD_USERS: {
      return { ...state, Users: action.payload };
    }
    case actionTypes.ADD_DAYS_OFF: {
      const newUsers: User[] = _.cloneDeep(state.Users);
      const userIndex: number = _.findIndex(newUsers, (user: User) => user.userName === action.payload.name);

      newUsers[userIndex].daysOff.push({
        id: action.payload.id,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        daysCount: action.payload.count,
        reason: action.payload.reason,
      });

      return { ...state, Users: newUsers };
    }
    case actionTypes.EDIT_DAYS_OFF: {
      const newUsers: User[] = _.cloneDeep(state.Users);
      const userIndex: number = _.findIndex(newUsers, (user: User) => user.userName === action.payload.name);
      const dayOff: DayOff = _.find(newUsers[userIndex].daysOff, { id: action.payload.id });

      dayOff.daysCount = action.payload.count;
      dayOff.startDate = action.payload.startDate;
      dayOff.endDate = action.payload.endDate;
      dayOff.reason = action.payload.reason;

      return { ...state, Users: newUsers };
    }
    case actionTypes.REMOVE_DAYS_OFF: {
      const userIndex: number = _.findIndex(state.Users, (user: User) => user.userName === action.payload.name);
      const newUsers: User[] = _.cloneDeep(state.Users);
      const dayOff: DayOff = _.find(state.Users[userIndex].daysOff, { id: action.payload.id });

      newUsers[userIndex].daysOff = _.without(state.Users[userIndex].daysOff, dayOff);
      return { ...state, Users: newUsers };
    }
    default:
      return state;
  }
};
