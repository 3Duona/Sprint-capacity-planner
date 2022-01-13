import React from 'react';
import { FormControl, Select, MenuItem, ListItemText } from '@material-ui/core';
import _ from 'lodash';

import { Team } from '../../state/reducers/teamsReducer';

interface TeamSelectProps {
  usersTeams: Team[];
  selectedTeam: number;
  allowAllTeamSelect?: boolean;
  setSelectedTeam: (id: number) => void;
}

const TeamSelect: React.FC<TeamSelectProps> = (
  { usersTeams, selectedTeam, allowAllTeamSelect, setSelectedTeam }: TeamSelectProps,
  props
) => {
  return (
    <FormControl fullWidth>
      <Select
        disabled={usersTeams.length === 0}
        onChange={(e) => setSelectedTeam(e.target.value as number)}
        value={selectedTeam}
        {...props}
      >
        {allowAllTeamSelect && (
          <MenuItem key={-1} value={-1}>
            <ListItemText>All teams</ListItemText>
          </MenuItem>
        )}
        {_.map(usersTeams, (team: Team, index: number) => (
          <MenuItem key={team.id} value={index}>
            <ListItemText>{team.title}</ListItemText>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TeamSelect;
