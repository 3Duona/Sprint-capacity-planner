import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  TableHead,
  Typography,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  Select,
  MenuItem,
  ListItemText,
  InputLabel,
  SvgIcon,
  IconButton,
} from '@material-ui/core';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import AddIcon from '@material-ui/icons/Add';

import { RootState } from '../../state/reducers/reducers';
import { SelectedDayState } from '../../state/reducers/calendarReducer';
import { CalendarEvent } from '../Calendar/Calendar';
import RoleSelect from '../RoleSelect/RoleSelect';
import { Team } from '../../state/reducers/teamsReducer';
import TeamSelect from '../TeamSelect/TeamSelect';
import TwoButtonDialog from '../Dialog/Dialog';
import AvailabilityForm from '../AvailabilityForm/AvailabilityForm';

const useStyles = makeStyles({
  header: {
    textAlign: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  cellHeight: {
    height: '25px',
  },
  conditionalText: {
    fontSize: '14px',
  },
  reasonCol: {
    textAlign: 'left',
    height: '25px',
    width: '33%',
  },
  nameCol: {
    textAlign: 'right',
    height: '25px',
    width: '33%',
  },
  roleCol: {
    width: '27%',
    textAlign: 'right',
    height: '25px',
  },
  dimmedText: {
    color: 'lightgray',
  },
  roleSelectCell: {
    height: '25px',
    width: '33%',
    textAlign: 'right',
  },
  selectionType: {
    width: '20%',
  },
});

const formatHeaderString = (selectStart: Date, selectEnd: Date) => {
  const selectionRange = moment(selectEnd).diff(selectStart, 'day');
  const isTheSameMonth = selectStart.getMonth() === selectEnd.getMonth();
  const startMonth = selectStart.toLocaleString('default', { month: 'long' });
  const startDay = selectStart.getDate();
  if (selectionRange === 0) {
    return `${startMonth} ${startDay}`;
  } else if (isTheSameMonth) {
    return `${startMonth} ${startDay} - ${selectEnd.getDate()}`;
  } else {
    return `${startMonth} ${startDay} - ${selectEnd.toLocaleString('default', {
      month: 'long',
    })} ${selectEnd.getDate()}`;
  }
};

const convertHeaderString = (name: string) => {
  return name.charAt(0) + name.substring(1).toLowerCase();
};

export type SelectionType = 'DAY' | 'WEEK' | 'MONTH' | 'SPRINT';

const selectionTypeArr = ['DAY', 'WEEK', 'MONTH', 'SPRINT'];

type CalendarDetailProps = {
  mainColor: string;
  selectedTeam: number;
  usersTeams: Team[];
  events: CalendarEvent[];
  selectedRoles: string[];
  selectionType: SelectionType;
  allTeamsSelected: boolean;
  setSelectedTeam(selectedTeamIndex: number): void;
  setSelectedRoles(roles: string[]): void;
  setSelectionType(type: SelectionType): void;
};

const CalendarDetails: React.FC<CalendarDetailProps> = ({
  mainColor,
  events,
  selectedRoles,
  setSelectedRoles,
  selectionType,
  setSelectionType,
  selectedTeam,
  setSelectedTeam,
  usersTeams,
  allTeamsSelected,
}: CalendarDetailProps) => {
  const classes = useStyles();
  const { selectedRange } = useSelector((state: RootState): SelectedDayState => state.calendar);
  const { selectionStart, selectionEnd } = selectedRange;
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const selectedRangeEvents: CalendarEvent[] = _.filter(events, (event) => {
    return (
      moment(event.start).isBetween(selectionStart, selectionEnd, 'day', '[]') ||
      moment(event.end).isBetween(selectionStart, selectionEnd, 'day', '[]') ||
      (moment(selectionStart).isBetween(event.start, event.end, 'day', '[]') &&
        moment(selectionEnd).isBetween(event.start, event.end, 'day', '[]'))
    );
  });

  const handleAddButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const sortedRangeEvents: CalendarEvent[] = _.sortBy(
    selectedRangeEvents,
    (event: CalendarEvent) => event.color !== undefined
  );
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.header} colSpan={3}>
              <FormControl className={classes.selectionType}>
                <InputLabel>Selection type</InputLabel>
                <Select onChange={(e) => setSelectionType(e.target.value as SelectionType)} value={selectionType}>
                  {_.map(selectionTypeArr, (selectionType: SelectionType) => {
                    if (selectionType === 'SPRINT') {
                      return (
                        <MenuItem disabled={allTeamsSelected} key={selectionType} value={selectionType}>
                          <ListItemText>{convertHeaderString(selectionType)}</ListItemText>
                        </MenuItem>
                      );
                    }
                    return (
                      <MenuItem key={selectionType} value={selectionType}>
                        <ListItemText>{convertHeaderString(selectionType)}</ListItemText>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.reasonCol}>
              <TeamSelect
                allowAllTeamSelect
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                usersTeams={usersTeams}
              />
            </TableCell>
            <TableCell className={classes.roleSelectCell}>
              <RoleSelect selectedRoles={selectedRoles} setSelectedRoles={setSelectedRoles} />
            </TableCell>
            <TableCell className={classes.roleCol}>
              <IconButton onClick={handleAddButtonClick}>
                <SvgIcon component={AddIcon}></SvgIcon>
              </IconButton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.header} colSpan={3}>
              <Typography className={classes.headerText} style={{ color: mainColor }}>
                {formatHeaderString(selectionStart, selectionEnd)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.reasonCol}>
              <Typography>Reason</Typography>
            </TableCell>
            <TableCell className={classes.nameCol}>
              <Typography>User</Typography>
            </TableCell>
            <TableCell className={classes.roleCol}>
              <Typography>Role</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRangeEvents.length ? (
            _.map(sortedRangeEvents, (event: CalendarEvent, id: number) => (
              <TableRow key={`${id}-cal-details`}>
                <TableCell align="left" className={`${classes.reasonCol} ${event.color && classes.dimmedText}`}>
                  {event.reason}
                </TableCell>
                <TableCell align="right" className={`${classes.nameCol} ${event.color && classes.dimmedText}`}>
                  {event.member}
                </TableCell>
                <TableCell align="right" className={`${classes.roleCol} ${event.color && classes.dimmedText}`}>
                  {event.role}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className={classes.cellHeight} colSpan={3}>
                <Typography className={classes.conditionalText}>No events to show.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TwoButtonDialog
        dialogContent={
          <AvailabilityForm
            editId={0}
            endDate={selectionEnd}
            onSubmit={handleDialogClose}
            setEditId={() => 0}
            startDate={selectionStart}
          />
        }
        dialogTitle="Add days off"
        isDialogOpen={isDialogOpen}
        maxWidthXl
        onDialogClose={handleDialogClose}
      />
    </>
  );
};
export default CalendarDetails;
