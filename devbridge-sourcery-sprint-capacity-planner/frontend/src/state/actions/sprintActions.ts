import * as actionTypes from './actionTypes';
import { Sprint } from '../reducers/teamsReducer';

export type LoadSprintsActionPayload = Sprint[];

export type AddSprintActionPayload = Omit<Sprint, 'id'>;

export type EditSprintActionPayload = Sprint;

export type RemoveSprintActionPayload = {
  id: number;
};

export const LoadSprintAction = (props: LoadSprintsActionPayload) => ({
  type: actionTypes.LOAD_SPRINTS,
  payload: props,
});

export const AddSprintAction = (props: AddSprintActionPayload) => ({
  type: actionTypes.ADD_SPRINT,
  payload: props,
});

export const EditSprintAction = (props: EditSprintActionPayload) => ({
  type: actionTypes.EDIT_SPRINT,
  payload: props,
});

export const RemoveSprintAction = (props: RemoveSprintActionPayload) => ({
  type: actionTypes.REMOVE_SPRINT,
  payload: props,
});
