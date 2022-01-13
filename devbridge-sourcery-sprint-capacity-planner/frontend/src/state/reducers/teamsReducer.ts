import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes';

export type Sprint = {
  id: number;
  teamId: number;
  team?: Team;
  title: string;
  defaultLength: number; // in days
  actualLength: number; // in days
  startDate: Date;
  endDate: Date;
  plannedAverageVelocity?: number | null;
  actualAverageVelocity?: number | null;
};

export type Member = {
  userId: number;
  teamId?: number;
  firstName: string;
  lastName: string;
  teamRole: string;
  userName: string;
  allocation: number;
  capacity: number;
};

export type Team = {
  id: number;
  title: string;
  members: Member[];
  sprints: Sprint[];
};

export type TeamsState = {
  Teams: Team[];
};

const initialState: TeamsState = {
  Teams: [],
};

export const teamsReducer = (state: TeamsState = initialState, action): TeamsState => {
  switch (action.type) {
    case actionTypes.LOAD_TEAMS: {
      return { ...state, Teams: action.payload ?? [] };
    }
    case actionTypes.ADD_TEAM: {
      return { ...state, Teams: _.concat(state.Teams, [{ ...action.payload }]) };
    }
    case actionTypes.REMOVE_TEAM: {
      return { ...state, Teams: _.without(state.Teams, _.find(state.Teams, { id: action.payload.id })) };
    }
    case actionTypes.CHANGE_MEMBERS: {
      const team: Team = _.find(state.Teams, { id: action.payload.id });
      team.members = action.payload.members;
      return { ...state };
    }
    case actionTypes.EDIT_TEAM: {
      const team: Team = _.find(state.Teams, { id: action.payload.id });
      team.title = action.payload.title;
      return { ...state };
    }
    case actionTypes.ADD_SPRINT: {
      const team: Team = _.find<Team>(state.Teams, { id: action.payload.teamId });
      team.sprints = _.concat(team.sprints, action.payload);
      return { ...state };
    }
    case actionTypes.EDIT_SPRINT: {
      const team: Team = _.find(state.Teams, { id: action.payload.teamId });
      const sprintToEdit: Sprint = _.find(team.sprints, { id: action.payload.id });
      sprintToEdit.title = action.payload.title;
      sprintToEdit.defaultLength = action.payload.defaultLength;
      sprintToEdit.startDate = action.payload.startDate;
      sprintToEdit.endDate = action.payload.endDate;
      sprintToEdit.plannedAverageVelocity = action.payload.plannedAverageVelocity;
      sprintToEdit.actualAverageVelocity = action.payload.actualAverageVelocity;
      return { ...state };
    }
    case actionTypes.REMOVE_SPRINT: {
      const sprintToRemove: Sprint = _.chain(state.Teams)
        .map((team: Team) => {
          return team.sprints;
        })
        .flatten()
        .find({ id: action.payload.id })
        .value();
      const team: Team = _.find(state.Teams, { id: sprintToRemove.teamId });
      team.sprints = _.reject(team.sprints, { id: action.payload.id });
      return { ...state };
    }
  }
  return state;
};
