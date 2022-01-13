import { SELECT_CALENDAR_DAYS } from './actionTypes';

export const selectDayAction = (details: { selectionStart: Date; selectionEnd: Date }) => ({
  type: SELECT_CALENDAR_DAYS,
  payload: details,
});
