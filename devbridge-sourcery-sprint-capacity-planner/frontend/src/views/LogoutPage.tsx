import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logout } from '../domain/AuthApi';

const LogoutPage: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logout());
  }, [dispatch, history]);
  return null;
};

export default LogoutPage;
