import { UsersState } from '../reducers/usersReducer';
import { RootState } from '../reducers/reducers';

export const getUsersState = (state: RootState): UsersState => state.user;
