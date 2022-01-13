import React from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';

const MapRoutes = (routes: Route[], path: string) =>
  _.map(routes, (route, index) => (
    <Route {...route.rest} key={index} path={`${path}${route.path}`}>
      <route.component>{route.children}</route.component>
    </Route>
  ));

export default MapRoutes;

export const getAllowedRoutes = (routes: Route[], role: string) =>
  routes.filter((route) => route.permission.includes(role));
