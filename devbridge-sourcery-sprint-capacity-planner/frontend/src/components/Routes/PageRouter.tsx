import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import AllRoutes from './AllRoutes';
import { TopNav } from '../NavBar/TopNav';
import Notification from '../Notifications/Notifications';

export const history = createBrowserHistory();

export const PageRouter: React.FC = () => {
  return (
    <Router history={history}>
      <TopNav />
      <Notification />
      <AllRoutes />
    </Router>
  );
};
