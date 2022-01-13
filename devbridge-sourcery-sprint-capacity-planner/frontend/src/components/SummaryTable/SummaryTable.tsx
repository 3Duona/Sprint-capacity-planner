import React, { useState, ChangeEvent, useEffect } from 'react';
import { Grid, FormControl, makeStyles, Button, Box } from '@material-ui/core';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { differenceInDays, getOverlappingDaysInIntervals } from 'date-fns';

import { BaseTable, ColumnDefinitionType } from '../BaseTable/BaseTable';
import { Team, Member, Sprint } from '../../state/reducers/teamsReducer';
import { getTeamsState } from '../../state/selectors/teamsSelectors';
import { getUsersState } from '../../state/selectors/usersSelectors';
import TwoButtonDialog from '../Dialog/Dialog';
import { DayOff, User, roleArray } from '../../state/reducers/usersReducer';
import TeamSelect from '../TeamSelect/TeamSelect';
import RoleSelect from '../RoleSelect/RoleSelect';
import SprintSelect from '../SprintSelect/SprintSelect';
import { getDate, sameDayOrAfter, sameDayOrBefore } from '../AvailabilityForm/AvailabilityFormHelpers';
import { EditSprint } from '../../state/actions/sprintThunk';
import ValidatedTextField from '../ValidatedTextField/ValidatedTextField';

interface TSummaryData {
  Id: number;
  Name: string;
  Role: string;
  Allocation: number;
  Capacity: number;
  Daysoff: number;
  Velocity?: number;
  SprintCapacity?: number;
}

const columns: ColumnDefinitionType<TSummaryData, keyof TSummaryData>[] = [
  { key: 'Name', header: 'Name' },
  { key: 'Role', header: 'Role' },
  { key: 'Allocation', header: 'Allocation' },
  { key: 'Capacity', header: 'Dev Capacity' },
  { key: 'Daysoff', header: 'Days off', calculateTotal: true, round: true },
  { key: 'SprintCapacity', header: 'Sprint Dev Capacity', calculateTotal: true, round: true },
  { key: 'Velocity', header: 'Target Velocity', calculateTotal: true, round: true },
];

const sprintColumns: ColumnDefinitionType<Sprint, keyof Sprint>[] = [
  { key: 'title', header: 'Sprint name' },
  { key: 'startDate', header: 'Sprint start' },
  { key: 'endDate', header: 'Sprint end' },
  { key: 'plannedAverageVelocity', header: 'Planned velocity' },
  { key: 'actualAverageVelocity', header: 'Actual velocity' },
];

const countUserDaysOff = (daysOff: DayOff[], sprint: Sprint) => {
  return _.sumBy(daysOff, (dayOff: DayOff) => {
    if (!sprint) {
      return 0;
    }
    const overlap = getOverlappingDaysInIntervals(
      { start: getDate(dayOff.startDate), end: getDate(dayOff.endDate) },
      { start: getDate(sprint.startDate), end: getDate(sprint.endDate) }
    );
    if (overlap > 0) {
      const totalDays = differenceInDays(getDate(dayOff.endDate), getDate(dayOff.startDate));
      return (dayOff.daysCount / totalDays) * overlap;
    }
    return 0;
  });
};

const calculateSprintDevCapacity = (allocation: number, capacity: number, sprintLength: number, daysOff: number) => {
  return allocation * capacity * (sprintLength - daysOff) * 0.1;
};

const calculateVelocity = (devCapacity: number, team: Team, previousSprint: Sprint, users: User[]) => {
  if (!previousSprint.actualAverageVelocity) {
    return undefined;
  }
  const sprintDevCapacityTotal = _.sumBy(team.members, (member: Member) => {
    return calculateSprintDevCapacity(
      member.allocation,
      member.capacity,
      previousSprint.actualLength === 0 ? previousSprint.defaultLength : previousSprint.actualLength,
      countUserDaysOff(
        _.find<User>(users, { id: member.userId }).daysOff,
        previousSprint
      )
    );
  });
  const averageVelocityPerSprintDevCapacityPoint = previousSprint.actualAverageVelocity / sprintDevCapacityTotal;
  return devCapacity * averageVelocityPerSprintDevCapacityPoint;
};

const createDataRow = (member: Member, daysOff: DayOff[], users: User[], sprint: Sprint, team: Team): TSummaryData => {
  const dayOffCount = countUserDaysOff(daysOff, sprint);
  const devCapacity =
    member.allocation && member.capacity && sprint
      ? calculateSprintDevCapacity(
          member.allocation,
          member.capacity,
          sprint.actualLength === 0 ? sprint.defaultLength : sprint.actualLength,
          dayOffCount
        )
      : undefined;
  const givenSprintIndex = _.findIndex(team.sprints, sprint);
  const previousSprintIndex = givenSprintIndex > 0 ? givenSprintIndex - 1 : 0;
  const velocity =
    devCapacity && team ? calculateVelocity(devCapacity, team, team.sprints[previousSprintIndex], users) : undefined;
  return {
    Id: member.userId,
    Name: `${member.firstName} ${member.lastName}`,
    Role: member.teamRole,
    Allocation: member.allocation,
    Capacity: member.capacity,
    Daysoff: dayOffCount,
    SprintCapacity: devCapacity,
    Velocity: velocity,
  };
};

const formTableData = (users: User[], team: Team, sprint: Sprint): TSummaryData[] => {
  return _.map(team.members, (member: Member) => {
    const user: User = _.find(users, (user: User) => user.id === member.userId);
    return createDataRow(member, user.daysOff, users, sprint, team);
  });
};

const filterData = (data: TSummaryData[], selectedRoleArr: string[]): TSummaryData[] => {
  return _.filter(
    data,
    (dataRow: TSummaryData) => _.find(selectedRoleArr, (role: string) => role === dataRow.Role) !== undefined
  );
};

const findCurrentSprintIndex = (sprints: Sprint[]) => {
  const index = _.findIndex(
    sprints,
    (sprint: Sprint) =>
      sameDayOrBefore(getDate(sprint.startDate), new Date()) && sameDayOrAfter(getDate(sprint.endDate), new Date())
  );
  return index !== -1 ? index : _.findLastIndex(sprints);
};

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
  selectField: {
    width: '60%',
  },
  sprint: {
    marginBottom: theme.spacing(4),
  },
}));

const SumTable: React.FC = () => {
  const classes = useStyles();
  const teams = useSelector(getTeamsState).Teams;
  const { Users } = useSelector(getUsersState);

  const [isVelocityDialogOpen, setIsVelocityDialogOpen] = useState<boolean>(false);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState<number>(0);
  const [selectedSprintIndex, setSelectedSprintIndex] = useState<number>(0);
  const [currentSprintIndex, setCurrentSprintIndex] = useState<number>(0);
  const [inputData, setInputData] = useState<string>('');

  const dispatch = useDispatch();

  const [selectedRoles, setSelectedRoles] = useState<string[]>(roleArray);

  let summaryData: TSummaryData[] = [];
  if (Users.length && teams.length) {
    summaryData = formTableData(Users, teams[selectedTeamIndex], teams[selectedTeamIndex].sprints[selectedSprintIndex]);
  }

  const filteredData = filterData(summaryData, selectedRoles);

  let sprintData: Sprint[] = [];
  if (Users.length && teams.length) {
    const sprint = teams[selectedTeamIndex].sprints[selectedSprintIndex];
    const sum = _.sumBy(filteredData, (row: TSummaryData) => {
      return row.Velocity ? row.Velocity : 0;
    });
    sprintData = sprint !== undefined ? [{ ...sprint, plannedAverageVelocity: _.round(sum, 2) }] : [];
  }

  const handleVelocityButtonClick = () => {
    setIsVelocityDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsVelocityDialogOpen(false);
    setInputData('');
  };

  const handleDialogSave = () => {
    const velocity = parseFloat(inputData);
    dispatch(
      EditSprint({
        ...teams[selectedTeamIndex].sprints[selectedSprintIndex],
        actualAverageVelocity: isNaN(velocity) ? null : velocity,
      })
    );
    handleDialogClose();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputData(e.target.value);
  };

  useEffect(() => {
    if (teams && teams[selectedTeamIndex] !== undefined) {
      const currentSprint = findCurrentSprintIndex(teams[selectedTeamIndex].sprints);
      setCurrentSprintIndex(currentSprint);
      setSelectedSprintIndex(currentSprint);
    }
  }, [selectedTeamIndex, teams]);

  return (
    <>
      <Grid container>
        <Grid className={classes.header} container>
          <Grid className={classes.center} item md={3} xs={6}>
            <Box className={classes.selectField}>
              <TeamSelect selectedTeam={selectedTeamIndex} setSelectedTeam={setSelectedTeamIndex} usersTeams={teams} />
            </Box>
          </Grid>
          <Grid className={classes.center} item md={3} xs={6}>
            <Box className={classes.selectField}>
              <RoleSelect selectedRoles={selectedRoles} setSelectedRoles={setSelectedRoles} />
            </Box>
          </Grid>
          <Grid className={classes.center} item md={3} xs={6}>
            <Box className={classes.selectField}>
              <SprintSelect
                currentSprint={currentSprintIndex}
                selectedSprint={selectedSprintIndex}
                setSelectedSprint={setSelectedSprintIndex}
                sprints={teams[selectedTeamIndex]?.sprints}
              />
            </Box>
          </Grid>
          <Grid className={classes.center} item md={3} xs={6}>
            <Box className={classes.selectField}>
              <FormControl>
                <Button color="primary" onClick={handleVelocityButtonClick} variant="contained">
                  Velocity
                </Button>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
        <Grid className={classes.sprint} item xs={12}>
          <BaseTable columns={sprintColumns} data={sprintData} idProperty="id" initialOrder="id" sortable={false} />
        </Grid>
        <Grid item xs={12}>
          <BaseTable calculateTotals columns={columns} data={filteredData} idProperty="Id" initialOrder="Role" />
        </Grid>
      </Grid>
      <TwoButtonDialog
        dialogContent={
          <ValidatedTextField
            label="Sprint velocity value"
            onChange={handleInputChange}
            validationProps={{
              isValid: true,
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              setIsValid: () => {},
              regexString: '^\\d+(\\.)?(\\d+)?$',
              strictRegex: true,
            }}
            value={inputData}
          ></ValidatedTextField>
        }
        dialogTitle="Current sprint actual velocity"
        isDialogOpen={isVelocityDialogOpen}
        leftButtonText="Cancel"
        onDialogClose={handleDialogClose}
        onLeftButtonClick={handleDialogClose}
        onRightButtonClick={handleDialogSave}
        rightButtonText="Save"
      />
    </>
  );
};

export default SumTable;
