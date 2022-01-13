import _ from 'lodash';

import {
  AddTeamAction,
  RemoveTeamAction,
  ChangeMembersAction,
  EditTeamAction,
  LoadTeamsAction,
  AddTeamActionPayload,
  EditTeamActionPayload,
  RemoveTeamActionPayload,
  ChangeMembersActionPayload,
} from '../actions/teamActions';
import API from '../../domain/Api';
import { Member } from '../reducers/teamsReducer';

export const LoadTeams = () => (dispatch) => {
  API.get('api/teams', { withCredentials: true }).then(
    (res) => {
      dispatch(LoadTeamsAction(res.data));
    },
    (error) => {
      console.log(error);
    }
  );
};

export const AddTeam = (props: AddTeamActionPayload) => (dispatch) => {
  API.post('api/teams', props, { withCredentials: true }).then(
    (res) => {
      dispatch(AddTeamAction({ ...res.data, teamUsers: [], sprints: [] }));
    },
    (error) => {
      console.log(error);
    }
  );
};

export const EditTeam = (props: EditTeamActionPayload) => (dispatch) => {
  API.put(`api/teams/${props.id}`, props, { withCredentials: true }).then(
    (res) => {
      dispatch(EditTeamAction(res.data));
    },
    (error) => {
      console.log(error);
    }
  );
};

export const RemoveTeam = (props: RemoveTeamActionPayload) => (dispatch) => {
  API.delete(`api/teams/${props.id}`, { withCredentials: true }).then(
    (res) => {
      dispatch(RemoveTeamAction({ id: res.data }));
    },
    (error) => {
      console.log(error);
    }
  );
};

export const ChangeMembers = (props: ChangeMembersActionPayload) => (dispatch) => {
  API.put(
    `api/teams/change-members/${props.id}`,
    {
      memberIds: _.map(props.members, (member: Member) => {
        return member.userId;
      }),
    },
    { withCredentials: true }
  ).then(
    (res) => {
      dispatch(ChangeMembersAction(res.data));
    },
    (error) => {
      console.log(error);
    }
  );
};
