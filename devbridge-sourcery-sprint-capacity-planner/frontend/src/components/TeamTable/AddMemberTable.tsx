import React from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';

import { Roles, User } from '../../state/reducers/usersReducer';
import { BaseTable, ColumnDefinitionType } from '../BaseTable/BaseTable';
import { Member, Team } from '../../state/reducers/teamsReducer';
import { getTeamsState } from '../../state/selectors/teamsSelectors';

interface TableRow {
  Id: number;
  name: string;
  surname: string;
  role: Roles;
  teams: string;
}

export const columns: ColumnDefinitionType<TableRow, keyof TableRow>[] = [
  { key: 'name', header: 'Name' },
  { key: 'surname', header: 'Surname' },
  { key: 'role', header: 'Team role' },
  { key: 'teams', header: `User's teams` },
];

const createDataRow = (user: User, teams: Team[]): TableRow => {
  const usersTeams = _.filter(teams, (team: Team) => _.find(team.members, { userId: user.id }));
  let usersTeamsString = '';
  usersTeams &&
    _.map(
      usersTeams,
      (team: Team, index) => (usersTeamsString += team.title + (usersTeams.length - 1 !== index ? ', ' : ''))
    );
  return {
    Id: user.id,
    name: user.firstName,
    surname: user.lastName,
    role: user.teamRole,
    teams: usersTeamsString,
  };
};

const formatTableData = (users: User[], teams: Team[]): TableRow[] => {
  return _.map(users, (user: User) => createDataRow(user, teams));
};

interface AddMemberTableProps {
  existingMembers: Member[];
  selectedMembers: number[];
  allUsers: User[];
  setSelectedMembers: (selected: number[]) => void;
}

const AddMemberTable: React.FC<AddMemberTableProps> = ({
  existingMembers,
  selectedMembers,
  allUsers,
  setSelectedMembers,
}) => {
  const allTeams = useSelector(getTeamsState).Teams;
  const members = _.filter(
    allUsers,
    (user: User) => !_.find(existingMembers, (member: Member) => member.userId === user.id)
  );
  return (
    <BaseTable
      columns={columns}
      data={formatTableData(members, allTeams)}
      idProperty="Id"
      initialOrder="role"
      selectable
      selected={selectedMembers}
      setSelected={setSelectedMembers}
    />
  );
};

export default AddMemberTable;
