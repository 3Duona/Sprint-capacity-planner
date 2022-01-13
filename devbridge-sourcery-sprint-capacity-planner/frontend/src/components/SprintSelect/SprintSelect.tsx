import React from 'react';
import { FormControl, Select, MenuItem, ListItemText } from '@material-ui/core';
import _ from 'lodash';

import { Sprint } from '../../state/reducers/teamsReducer';

interface SprintSelectProps {
  sprints: Sprint[];
  selectedSprint: number;
  currentSprint?: number;
  setSelectedSprint: (id: number) => void;
}

const SprintSelect: React.FC<SprintSelectProps> = (
  { sprints, selectedSprint, currentSprint, setSelectedSprint }: SprintSelectProps,
  props
) => {
  return (
    <FormControl fullWidth>
      <Select
        disabled={!sprints || sprints.length === 0}
        onChange={(e) => setSelectedSprint(e.target.value as number)}
        value={!sprints || selectedSprint < 0 || selectedSprint >= sprints?.length ? '' : selectedSprint}
        {...props}
      >
        {_.map(sprints, (sprint: Sprint, index: number) => (
          <MenuItem key={sprint.id} value={index}>
            <ListItemText>
              {sprint.title} {index === currentSprint && ' (current)'}
            </ListItemText>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SprintSelect;
