import React from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';

import { getLoginState } from '../../state/selectors/loginSelectors';
import { getUsersState } from '../../state/selectors/usersSelectors';
import { UsersState, DayOff, User } from '../../state/reducers/usersReducer';
import { BaseTable, ColumnDefinitionType } from '../BaseTable/BaseTable';

const columns: ColumnDefinitionType<DayOff, keyof DayOff>[] = [
  { key: 'startDate', header: 'Start Date' },
  { key: 'endDate', header: 'End Date' },
  { key: 'daysCount', header: 'Day Count' },
  { key: 'reason', header: 'Reason' },
];

interface AvailabilityTableProps {
  onEdit: (id: number) => any;
  onRemove: (id: number) => any;
}

const AvailabilityTable: React.FC<AvailabilityTableProps> = ({ onEdit, onRemove }) => {
  const username: string = useSelector(getLoginState)?.user?.username;
  const allUsers: UsersState = useSelector(getUsersState);

  const daysOff = () => {
    const user: User | undefined = _.find(allUsers.Users, { userName: username });
    return user?.daysOff ?? [];
  };

  return (
    <BaseTable
      columns={columns}
      data={daysOff()}
      editable
      idProperty="id"
      initialOrder="startDate"
      onEdit={onEdit}
      onRemove={onRemove}
      removable
    />
  );
};

export default AvailabilityTable;
