import { combineReducers } from 'redux';
import type { StateType } from 'typesafe-actions';

import login from './loginReducer';
import { teamsReducer as team } from './teamsReducer';
import calendar from './calendarReducer';
import { reducer as user } from './usersReducer';
import { NotificationsReducer as notifications } from './notificationsReducer';

const reducers = combineReducers({ login, team, user, calendar, notifications });
export type RootState = StateType<typeof reducers>;

export default reducers;
