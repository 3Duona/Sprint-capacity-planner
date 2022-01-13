import _ from 'lodash';

import SummaryTablePage from '../../views/SummaryTablePage';
import { TeamTable } from '../TeamTable/TeamTable';
import { Permissions } from '../Roles/UserRoles';
import AvailabilityFormPage from '../../views/AvailabilityPage';
import { CalendarPage } from '../../views/CalendarPage';
import LoginPage from '../../views/LoginPage';
import RegisterPage from '../../views/RegisterPage';
import LogoutPage from '../../views/LogoutPage';
import PreferencesPage from '../../views/PreferencesPage';

export interface Route {
  component: React.FC<{}>;
  name: string;
  path: string;
  permission: string[];
  pos: string;
  logged: boolean;
}

export default [
  {
    component: AvailabilityFormPage,
    name: 'Availability',
    path: 'formpage',
    permission: Permissions.ALL,
    pos: 'left',
    logged: true,
  },
  {
    component: CalendarPage,
    name: 'Calendar',
    path: 'calendar',
    permission: Permissions.ALL,
    pos: 'left',
    logged: true,
  },
  {
    component: LoginPage,
    name: 'Login',
    path: 'login',
    permission: Permissions.ALL,
    pos: 'right',
    logged: false,
  },
  {
    component: LogoutPage,
    name: 'Logout',
    path: 'logout',
    permission: Permissions.ALL,
    pos: 'right',
    logged: true,
  },
  {
    component: PreferencesPage,
    name: 'Preferences',
    path: 'preferences',
    permission: Permissions.ALL,
    pos: 'right',
    logged: true,
  },
  {
    component: RegisterPage,
    name: 'Register',
    path: 'register',
    permission: Permissions.ALL,
    pos: 'right',
    logged: false,
  },
  {
    component: SummaryTablePage,
    name: 'Summary table',
    path: 'tablepage',
    permission: _.union(Permissions.ADMIN, Permissions.TEAM_LEAD),
    pos: 'left',
    logged: true,
  },
  {
    component: TeamTable,
    name: 'Team table',
    path: 'teams',
    permission: _.union(Permissions.ADMIN, Permissions.TEAM_LEAD),
    pos: 'left',
    logged: true,
  },
] as Route[];
