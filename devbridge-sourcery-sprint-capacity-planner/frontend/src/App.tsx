import React from 'react';
import { useDispatch } from 'react-redux';

import { PageRouter } from './components/Routes/PageRouter';
import { onStart, refreshCookie } from './domain/AuthApi';

const App: React.FC = () => {
  const dispatch = useDispatch();
  dispatch(onStart());
  refreshCookie();
  return <PageRouter />;
};

export default App;
