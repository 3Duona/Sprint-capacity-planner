import React, { ChangeEvent, useState } from 'react';
import './TeamTable.css';
import { Chip, Grid, makeStyles, TableCell, TableRow, Typography } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import _ from 'lodash';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import TwoButtonDialog from '../Dialog/Dialog';
import { Team, Member, Sprint } from '../../state/reducers/teamsReducer';
import ValidatedTextField from '../ValidatedTextField/ValidatedTextField';
import AddMemberTable from './AddMemberTable';
import { User } from '../../state/reducers/usersReducer';
import { AddSprint, EditSprint } from '../../state/actions/sprintThunk';

export type TeamSprintObjType = {
  previousSprint: Sprint | null;
  currentSprint: Sprint | null;
  nextSprint: Sprint | null;
};

type TeamDataProps = {
  team: Team;
  teamKey: number;
  edit: boolean;
  allUsers: User[];
  teamsSprints: TeamSprintObjType;
  handleMembersChange(modifiedTeam: Team): void;
  handleEditButton(teamKey: number): void;
  handleTeamDelete(teamKey: number): void;
  handleTeamRename(teamKey: number, newTitle: string): void;
  resetSelect(): void;
  showNotification(message: string, type: string): void;
  checkIfTitleExists(newTitle: string): boolean;
};

function generateColor(memberId: number): string {
  if (memberId % 3 === 0) {
    return 'RoyalBlue';
  }
  if (memberId % 2 === 0) {
    return 'LightSeaGreen';
  }
  return 'YellowGreen';
}

function chipStyle(memberId: number): Record<string, string> {
  const style = {
    margin: '0 0 5px 5px',
    backgroundColor: generateColor(memberId),
  };
  return style;
}

type SprintConfig = {
  length: number;
  startDate: Date;
};

const formatDate = (date: Date) => {
  return moment(date).format('YYYY-MM-DD').toString();
};

const formatSprintLengthString = (sprintObj: Sprint | null): string => {
  if (!sprintObj || sprintObj === undefined) {
    return 'Does not exist.';
  }
  return `Start date: ${formatDate(sprintObj.startDate)} End date: ${formatDate(sprintObj.endDate)}`;
};

const initialSprintConfigData = (props: TeamSprintObjType): SprintConfig => {
  const { currentSprint, nextSprint } = props;
  let nextSprintDate = new Date();
  if (currentSprint) {
    nextSprintDate = moment(currentSprint.endDate).add(1, 'day').toDate();
  }
  return {
    length: nextSprint ? nextSprint.defaultLength : currentSprint ? currentSprint.defaultLength : 5,
    startDate: nextSprint ? nextSprint.startDate : nextSprintDate,
  };
};

const useStyles = makeStyles({
  pointer: {
    cursor: 'pointer',
  },
});

export const TeamData: React.FC<TeamDataProps> = (props) => {
  const classes = useStyles();
  const { title, members } = props.team;
  const { previousSprint, currentSprint, nextSprint } = props.teamsSprints;

  const initialSprintData = initialSprintConfigData(props.teamsSprints);
  const [newTeamTitle, setTeamTitle] = useState<string>(title);
  const [sprintConfig, setSprintConfig] = useState<SprintConfig>(initialSprintData);

  const [isNewTeamTitleValid, setIsNewTeamTitleValid] = useState<boolean>(true);
  const [isSprintLenghtValid, setIsSprintLengthValid] = useState<boolean>(true);
  const [isStartDateValid, setIsStartDateValid] = useState<boolean>(true);

  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState<boolean>(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<boolean>(false);
  const [isRowExpanded, setIsRowExpanded] = useState<boolean>(false);

  const [modifiedTeamMembers, setModifiedTeamMembers] = useState<Member[]>(members);
  const [removingMemberId, setRemovingMemberId] = useState<number>(-1);
  const [addedMembersIds, setAddedMembersIds] = useState<number[]>([]);
  const [deleteType, setDeleteType] = useState<'team' | 'member'>('member');

  const dispatch = useDispatch();

  const setInitialState = () => {
    setTeamTitle(title);
    setModifiedTeamMembers(members);
    setIsNewTeamTitleValid(true);
    setSprintConfig(initialSprintData);
  };

  const onSaveButtonClick = () => {
    const haveMembersChanged = !_.isEqual(modifiedTeamMembers, members);
    const areTitlesEqual = title === newTeamTitle;
    const areSprintsEqual = _.isEqual(initialSprintData, sprintConfig);

    if (!isNewTeamTitleValid || (!areTitlesEqual && props.checkIfTitleExists(newTeamTitle))) {
      props.showNotification(`Invalid team's title.`, 'warning');
    } else if (!haveMembersChanged && areTitlesEqual && areSprintsEqual && nextSprint) {
      props.showNotification('No changes have been made.', 'success');
      setInitialState();
      props.resetSelect();
    } else {
      !areTitlesEqual && props.handleTeamRename(props.teamKey, newTeamTitle);
      haveMembersChanged && props.handleMembersChange({ ...props.team, members: modifiedTeamMembers });
      saveSprints(areSprintsEqual);
      props.showNotification('Changes have been saved.', 'success');
      props.resetSelect();
    }
  };

  const saveSprints = (areSprintsEqual: boolean) => {
    const { length, startDate } = sprintConfig;
    const endDate = moment(startDate).add(length, 'days').toDate();
    if (!nextSprint) {
      dispatch(
        AddSprint({
          title: '',
          teamId: props.team.id,
          team: props.team,
          defaultLength: length,
          actualLength: 0,
          startDate: startDate,
          endDate: endDate,
        })
      );
    } else if (!areSprintsEqual && nextSprint) {
      dispatch(EditSprint({ ...nextSprint, defaultLength: length, startDate: startDate, endDate: endDate }));
    }
  };

  const deleteMember = (memberId: number) => {
    setModifiedTeamMembers(_.filter(modifiedTeamMembers, (member: Member) => member.userId !== memberId));
    props.showNotification('Member has been deleted.', 'warning');
  };

  const onCancelButtonClick = () => {
    setInitialState();
    props.resetSelect();
  };

  const handleDialogClose = () => {
    setIsConfirmationDialogOpen(false);
  };

  const handleDialogConfirmation = () => {
    handleDialogClose();
    switch (deleteType) {
      case 'team': {
        props.handleTeamDelete(props.team.id as number);
        break;
      }
      case 'member': {
        deleteMember(removingMemberId);
      }
    }
  };

  const chooseMember = (memberId: number) => {
    setDeleteType('member');
    setRemovingMemberId(memberId);
    setIsConfirmationDialogOpen(true);
  };

  const handleAddMemberDialogClose = () => {
    setIsAddMemberDialogOpen(false);
    setAddedMembersIds([]);
  };

  const createMember = (user: User): Member => {
    return {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      teamRole: user.teamRole as string,
      userName: user.userName,
      allocation: 1,
      capacity: 1,
    };
  };

  const addMembersToTeam = () => {
    const members: Member[] = _.map(addedMembersIds, (id: number) =>
      createMember(_.find(props.allUsers, (user: User) => user.id === id))
    );
    setModifiedTeamMembers(_.concat(members, modifiedTeamMembers));
  };

  const handleAddMemberDialogSave = () => {
    setIsAddMemberDialogOpen(false);
    addMembersToTeam();
    setAddedMembersIds([]);
  };

  const onExpandClick = (expanded: boolean) => {
    setIsRowExpanded(expanded);
  };

  const handleSprintLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    if (isNaN(value)) {
      setSprintConfig({ ...sprintConfig, length: 0 });
      setIsSprintLengthValid(false);
    } else {
      setSprintConfig({ ...sprintConfig, length: value });
    }
  };

  const handleSprintStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsDate;

    if (!value) {
      setSprintConfig({ ...sprintConfig, startDate: new Date() });
      setIsStartDateValid(false);
    } else {
      setSprintConfig({ ...sprintConfig, startDate: value });
    }
  };

  const checkSprintStartDate = (input: string) => {
    return moment(input).isSameOrAfter(new Date(), 'day');
  };

  const handleTeamDelete = () => {
    setDeleteType('team');
    setIsConfirmationDialogOpen(true);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          {!props.edit ? (
            title
          ) : (
            <ValidatedTextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setTeamTitle(e.target.value)}
              placeholder="Team's title"
              type="text"
              validationProps={{
                isValid: isNewTeamTitleValid,
                setIsValid: setIsNewTeamTitleValid,
                maxLength: 30,
              }}
              value={newTeamTitle}
              variant="standard"
            />
          )}
        </TableCell>
        <TableCell>
          {_.map(modifiedTeamMembers, (member: Member, memberId) => (
            <Chip
              key={member.userId}
              label={`${member.firstName} ${member.lastName ? member.lastName.charAt(0) + '.' : ''}`}
              onDelete={props.edit ? () => chooseMember(member.userId) : undefined}
              style={chipStyle(memberId + props.teamKey)}
            />
          ))}
          {props.edit && (
            <SvgIcon className={classes.pointer} component={AddIcon} onClick={() => setIsAddMemberDialogOpen(true)} />
          )}
        </TableCell>
        <TableCell>
          <div className="rowButtons">
            <div className="leftMostButtons">
              {!props.edit ? (
                <SvgIcon
                  className={classes.pointer}
                  component={EditIcon}
                  key={title + 'e'}
                  onClick={() => props.handleEditButton(props.teamKey)}
                />
              ) : (
                <>
                  <SvgIcon className={classes.pointer} component={SaveIcon} onClick={onSaveButtonClick} />
                  <SvgIcon className={classes.pointer} component={ClearIcon} onClick={onCancelButtonClick} />
                </>
              )}
              {props.edit && (
                <SvgIcon
                  className={classes.pointer}
                  color="error"
                  component={DeleteIcon}
                  key={title + 'd'}
                  onClick={props.edit ? handleTeamDelete : undefined}
                />
              )}
            </div>
            <div className="rightMostButtons">
              {!isRowExpanded ? (
                <SvgIcon className={classes.pointer} component={ExpandMoreIcon} onClick={() => onExpandClick(true)} />
              ) : (
                <SvgIcon className={classes.pointer} component={ExpandLessIcon} onClick={() => onExpandClick(false)} />
              )}
            </div>
          </div>
        </TableCell>
      </TableRow>
      {isRowExpanded && (
        <TableRow className="expandableRow">
          <TableCell colSpan={3}>
            <div className="expandableRow-content">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">Sprint configuration</Typography>
                </Grid>
                <Grid item sm={3} xs={3}>
                  <ValidatedTextField
                    disabled={!props.edit}
                    fullWidth
                    label="Sprint length (days)"
                    onChange={handleSprintLengthChange}
                    validationProps={{
                      isValid: isSprintLenghtValid,
                      setIsValid: setIsSprintLengthValid,
                      maxLength: 2,
                      regexString: '^[0-9]*$',
                      strictRegex: true,
                    }}
                    value={sprintConfig.length.toString()}
                    variant="outlined"
                  />
                </Grid>
                <Grid item sm={3} xs={3}>
                  <ValidatedTextField
                    disabled={!props.edit}
                    fullWidth
                    helperText={props.edit && 'Date must be today or after'}
                    label="Sprint start date"
                    onChange={handleSprintStartDateChange}
                    type="date"
                    validationProps={{
                      isValid: isStartDateValid,
                      setIsValid: setIsStartDateValid,
                      additionalCheck: checkSprintStartDate,
                    }}
                    value={sprintConfig.startDate !== undefined ? formatDate(sprintConfig.startDate) : ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Previous sprint</Typography>
                  <Typography>{formatSprintLengthString(previousSprint)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography style={{ fontWeight: 'bold' }}>Current sprint</Typography>
                  <Typography>{formatSprintLengthString(currentSprint)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Next sprint</Typography>
                  <Typography>{formatSprintLengthString(nextSprint)}</Typography>
                </Grid>
              </Grid>
            </div>
          </TableCell>
        </TableRow>
      )}
      <TwoButtonDialog
        dialogContent={<DialogContentText>Are you sure?</DialogContentText>}
        dialogTitle={deleteType === 'member' ? 'Delete team member' : 'Delete selected team'}
        isDialogOpen={isConfirmationDialogOpen}
        leftButtonText="No"
        onDialogClose={handleDialogClose}
        onLeftButtonClick={handleDialogClose}
        onRightButtonClick={handleDialogConfirmation}
        rightButtonText="Yes"
      />
      <TwoButtonDialog
        dialogContent={
          <AddMemberTable
            allUsers={props.allUsers}
            existingMembers={modifiedTeamMembers}
            selectedMembers={addedMembersIds}
            setSelectedMembers={setAddedMembersIds}
          />
        }
        dialogTitle="Add member(-s)"
        isDialogOpen={isAddMemberDialogOpen}
        leftButtonText="Cancel"
        onDialogClose={handleAddMemberDialogClose}
        onLeftButtonClick={handleAddMemberDialogClose}
        onRightButtonClick={handleAddMemberDialogSave}
        rightButtonText="Add"
      />
    </>
  );
};
