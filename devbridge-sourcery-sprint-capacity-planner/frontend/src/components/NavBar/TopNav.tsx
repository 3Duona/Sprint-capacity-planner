import React from 'react';
import { useSelector } from 'react-redux';

import NavBar from './NavBar';
import NavBarButtons from './NavBarButtons';
import { getAllowedRoutes } from '../Routes/RouteUtils';
import { getLoginState } from '../../state/selectors/loginSelectors';
import RoutesConfig from '../Routes/RoutesConfig';

export const TopNav: React.FC = () => {
  const { isLogged, user } = useSelector(getLoginState);
  const allowedRoutes = getAllowedRoutes(RoutesConfig, user.role);
  return <NavBar>{NavBarButtons(allowedRoutes, '', isLogged)}</NavBar>;
};
