import React, { useEffect, useState } from 'react';
import '../styles/CalendarPage.css';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useTheme } from '@material-ui/core';

import { getUsersState } from '../state/selectors/usersSelectors';
import { Calendar, CalendarEvent, convertToCalendarChips, FilteredUserType } from '../components/Calendar/Calendar';
import CalendarDetails, { SelectionType } from '../components/CalendarDetails/CalendarDetails';
import { User, roleArray } from '../state/reducers/usersReducer';
import { getTeamsState } from '../state/selectors/teamsSelectors';
import { Member, Team } from '../state/reducers/teamsReducer';
import { LoadTeams } from '../state/actions/teamThunk';
import { LoadUsers } from '../state/actions/usersThunk';

const createFilteredUser = (user: User, filter: boolean): FilteredUserType => {
  return { ...user, filtered: filter };
};

export const CalendarPage: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(LoadUsers());
    dispatch(LoadTeams());
  }, [dispatch]);

  const { main, light } = useTheme().palette.primary;
  const teams: Team[] = useSelector(getTeamsState).Teams;
  const { Users } = useSelector(getUsersState);

  const [selectedTeamIndex, setSelectedTeamIndex] = useState<number>(-1);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(roleArray);
  const [selectionType, setSelectionType] = useState<SelectionType>('DAY');

  const filterTeamUsers = () => {
    return _.map(
      teams[selectedTeamIndex].members,
      (member: Member) => Users[_.findIndex(Users, (user: User) => user.id === member.userId)]
    );
  };

  const filterAllTeamsUsers = () => {
    return _.uniq(
      _.map(teams, (team: Team) =>
        _.map(team.members, (member: Member) => _.find(Users, (user: User) => user.id === member.userId))
      ).flat()
    );
  };

  let teamUsers: User[] = [];

  if (teams.length && Users.length) {
    teamUsers = selectedTeamIndex === -1 ? filterAllTeamsUsers() : filterTeamUsers();
  }

  let calendarEvents: CalendarEvent[] = [];

  if (teamUsers.length) {
    const filteredUserArray = _.map(teamUsers, (user: User) =>
      createFilteredUser(user, !_.some(selectedRoles, (role: string) => role === user.teamRole))
    );
    calendarEvents = convertToCalendarChips(filteredUserArray, light);
  }
  return (
    <div className="page">
      <div className="calendar">
        <Calendar
          color={main}
          events={calendarEvents}
          selectionType={selectionType}
          usersTeam={teams[selectedTeamIndex]}
        />
      </div>
      <div className="calendar-details">
        <CalendarDetails
          allTeamsSelected={selectedTeamIndex === -1}
          events={calendarEvents}
          mainColor={main}
          selectedRoles={selectedRoles}
          selectedTeam={selectedTeamIndex}
          selectionType={selectionType}
          setSelectedRoles={setSelectedRoles}
          setSelectedTeam={setSelectedTeamIndex}
          setSelectionType={setSelectionType}
          usersTeams={teams}
        />
      </div>
    </div>
  );
};
