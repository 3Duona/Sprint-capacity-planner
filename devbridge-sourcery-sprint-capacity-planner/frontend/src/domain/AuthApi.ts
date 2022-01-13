import { history } from '../components/Routes/PageRouter';
import API from './Api';
import { RegisterFormData } from '../components/RegisterForm/RegisterForm';
import { setLoginState, loginDetailsType, logoutAction } from '../state/actions/loginActions';
import { SetNotificationAction } from '../state/actions/notificationsActions';

export const register = (data: RegisterFormData) => {
  return (dispatch) => {
    API.post('auth/register', data)
      .then((response) => {
        history.push('/login');
        dispatch(SetNotificationAction({ isOpen: true, message: response.data, type: 'success' }));
      })
      .catch((error) => {
        dispatch(SetNotificationAction({ isOpen: true, message: error.response.data, type: 'error' }));
      });
  };
};

export const login = (details: loginDetailsType) => {
  return (dispatch) => {
    return API.post('auth/login', details, { withCredentials: true })
      .then((response) => {
        dispatch(setLoginState({ ...response.data, username: details.username }));
        history.push('/');
      })
      .catch((error) => {
        dispatch(SetNotificationAction({ isOpen: true, message: error.response.data, type: 'error' }));
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    return API.post('auth/logout', {}, { withCredentials: true }).then(() => {
      dispatch(logoutAction);
      history.push('login');
      history.go(0);
    });
  };
};

export const onStart = () => {
  return (dispatch) => {
    cookieRequest().then((data) => {
      if (data !== 'noCookie') {
        dispatch(setLoginState({ ...data }));
      } else {
        dispatch(logoutAction);
      }
    });
  };
};

export const cookieRequest = () => {
  return API.post('auth/newcookie', {}, { withCredentials: true }).then((response) => response.data);
};

export const refreshCookie = () => {
  setInterval(cookieRequest, 840000);
};
