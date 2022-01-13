import React, { Fragment } from 'react';
import _ from 'lodash';

import NavBarButton from './NavBarButton';
import { Route } from '../Routes/RoutesConfig';

const NavBarButtons = (routes: Route[], basePath: string, isLogged: boolean) => {
  return _.map(routes, (route, index) => {
    if (route.logged !== isLogged) {
      return <Fragment key={index} />;
    }
    return <NavBarButton key={index} name={route.name} position={route.pos} url={`${basePath}${route.path}`} />;
  });
};

export default NavBarButtons;
