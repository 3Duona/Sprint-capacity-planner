import { LoginState } from '../reducers/loginReducer';
import { RootState } from '../reducers/reducers';

export const getLoginState = (state: RootState): LoginState => state.login;
