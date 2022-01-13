import * as actionTypes from './actionTypes';

export type SaveDaysOffActionProps = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  count: number;
  reason: string;
};

export type RemoveDaysOffActionsProps = {
  id: number;
  name: string;
};

export const AddDaysOffAction = (props: SaveDaysOffActionProps) => ({
  type: actionTypes.ADD_DAYS_OFF,
  payload: props,
});

export const EditDaysOffAction = (props: SaveDaysOffActionProps) => ({
  type: actionTypes.EDIT_DAYS_OFF,
  payload: props,
});

export const RemoveDaysOffAction = (props: RemoveDaysOffActionsProps) => ({
  type: actionTypes.REMOVE_DAYS_OFF,
  payload: props,
});
