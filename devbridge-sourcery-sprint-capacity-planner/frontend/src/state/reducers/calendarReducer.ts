import { SELECT_CALENDAR_DAYS } from '../actions/actionTypes';

type dayRange = {
  selectionStart: Date;
  selectionEnd: Date;
};

type SelectedDayStateAction = {
  type: string;
  payload: dayRange;
};

export interface SelectedDayState {
  selectedRange: dayRange;
}

const today = new Date();

const initialState: SelectedDayState = {
  selectedRange: { selectionStart: today, selectionEnd: today },
};

const reducer = (state: SelectedDayState = initialState, action: SelectedDayStateAction): SelectedDayState => {
  switch (action.type) {
    case SELECT_CALENDAR_DAYS:
      return {
        ...state,
        selectedRange: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
