import { TeamsState } from '../reducers/teamsReducer';
import { RootState } from '../reducers/reducers';

export const getTeamsState = (state: RootState): TeamsState => state.team;
