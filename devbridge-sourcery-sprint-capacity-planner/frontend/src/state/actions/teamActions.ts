import * as actionTypes from './actionTypes';
import { Team } from '../reducers/teamsReducer';

export type LoadTeamActionPayload = Team[];

export type AddTeamActionPayload = Omit<Team, 'id'>;

export type EditTeamActionPayload = Team;

export type RemoveTeamActionPayload = {
  id: number;
};

export type ChangeMembersActionPayload = Team;

export const LoadTeamsAction = (props: LoadTeamActionPayload) => ({
  type: actionTypes.LOAD_TEAMS,
  payload: props,
});

export const AddTeamAction = (props: AddTeamActionPayload) => ({
  type: actionTypes.ADD_TEAM,
  payload: props,
});

export const RemoveTeamAction = (props: RemoveTeamActionPayload) => ({
  type: actionTypes.REMOVE_TEAM,
  payload: props,
});

export const EditTeamAction = (props: EditTeamActionPayload) => ({
  type: actionTypes.EDIT_TEAM,
  payload: props,
});

export const ChangeMembersAction = (props: ChangeMembersActionPayload) => ({
  type: actionTypes.CHANGE_MEMBERS,
  payload: props,
});
