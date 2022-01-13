import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch, Switch, Route } from 'react-router-dom';

import MapRoutes, { getAllowedRoutes } from './RouteUtils';
import { getLoginState } from '../../state/selectors/loginSelectors';
import RoutesConfig from './RoutesConfig';
import { CalendarPage } from '../../views/CalendarPage';
import LoginPage from '../../views/LoginPage';

const AllRoutes: React.FC = () => {
  const match = useRouteMatch('/');
  const { isLogged, user } = useSelector(getLoginState);
  const allowedRoutes = getAllowedRoutes(RoutesConfig, user.role);
  return (
    <>
      <Switch>
        {MapRoutes(allowedRoutes, match.path)}
        <Route component={isLogged ? CalendarPage : LoginPage} path="*" />
      </Switch>
    </>
  );
};

export default AllRoutes;
