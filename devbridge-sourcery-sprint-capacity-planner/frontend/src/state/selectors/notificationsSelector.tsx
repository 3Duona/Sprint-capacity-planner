import { NotificationsState } from '../reducers/notificationsReducer';
import { RootState } from '../reducers/reducers';

export const getNotificationsState = (state: RootState): NotificationsState => state.notifications;
