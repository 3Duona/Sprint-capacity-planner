import { Input, MenuItem, Select, Checkbox, ListItemText, FormControl, makeStyles } from '@material-ui/core';
import React from 'react';
import _ from 'lodash';

import { roleArray } from '../../state/reducers/usersReducer';

const useStyles = makeStyles({
  select: {
    height: '45px',
  },
});
interface RoleSelectProps {
  selectedRoles: string[];
  customRoles?: string[];
  setSelectedRoles(roles: string[]): void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ selectedRoles, setSelectedRoles, customRoles }: RoleSelectProps) => {
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedRoles(event.target.value as string[]);
  };
  const roleArr = customRoles !== undefined ? customRoles : roleArray;
  return (
    <FormControl fullWidth>
      <Select
        className={classes.select}
        displayEmpty
        id="role-select"
        input={<Input />}
        MenuProps={{ variant: 'menu', getContentAnchorEl: null }}
        multiple
        onChange={handleChange}
        renderValue={(selected) => {
          if ((selected as string[]).length === 0) {
            return <i>No roles sel.</i>;
          }
          return (selected as string[]).join(', ');
        }}
        value={selectedRoles}
      >
        {_.map(roleArr, (role: string) => (
          <MenuItem key={role} value={role}>
            <Checkbox checked={_.indexOf(selectedRoles, role) > -1} color="primary" />
            <ListItemText primary={role} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default RoleSelect;
