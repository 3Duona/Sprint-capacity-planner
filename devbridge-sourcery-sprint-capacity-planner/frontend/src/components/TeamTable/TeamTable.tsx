import React, { useState, useEffect } from 'react';
import './TeamTable.css';
import SvgIcon from '@material-ui/core/SvgIcon';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { getTeamsState } from '../../state/selectors/teamsSelectors';
import { TeamData, TeamSprintObjType } from './TeamTableDataRow';
import { Sprint, Team } from '../../state/reducers/teamsReducer';
import { AddTeam, ChangeMembers, RemoveTeam, EditTeam, LoadTeams } from '../../state/actions/teamThunk';
import { LoadUsers } from '../../state/actions/usersThunk';
import ValidatedTextField from '../ValidatedTextField/ValidatedTextField';
import { getUsersState } from '../../state/selectors/usersSelectors';
import { SetNotificationAction } from '../../state/actions/notificationsActions';

const formatTeamSprints = (teamsSprints: Sprint[]): TeamSprintObjType => {
  const sortedSprints = _.sortBy(teamsSprints, (sprint: Sprint) => sprint.startDate);

  const currentSprintIndex = _.findIndex(sortedSprints, (sprint: Sprint) =>
    moment(new Date()).isBetween(moment(sprint.startDate), moment(sprint.endDate), 'day', '[]')
  );

  const returnObj: TeamSprintObjType = {
    previousSprint: sortedSprints[currentSprintIndex - 1],
    currentSprint: sortedSprints[currentSprintIndex],
    nextSprint: sortedSprints[currentSprintIndex + 1],
  };
  return returnObj;
};

const useStyles = makeStyles({
  pointer: {
    cursor: 'pointer',
  },
});

export const TeamTable: React.FC = () => {
  const classes = useStyles();
  const [editKey, setEditKey] = useState<number>(-1);
  const [addTeamPressed, setAddTeamPressed] = useState<boolean>(false);
  const [newTeamTitle, setNewTeamTitle] = useState<string>('');
  const [isNewTeamTitleValid, setisNewTeamTitleValid] = useState<boolean>(false);
  const users = useSelector(getUsersState).Users;
  const teams = useSelector(getTeamsState).Teams;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(LoadUsers());
    dispatch(LoadTeams());
  }, [dispatch]);

  const teamNameExists = (newTitle: string): boolean => {
    return _.findKey(teams, { title: newTitle });
  };

  const showNotification = (message: string, type: 'warning' | 'success' | 'error' | 'info') => {
    dispatch(SetNotificationAction({ isOpen: true, message: message, type: type }));
  };

  const handleTeamRename = (teamKey: number, newTitle: string) => {
    const newTeam = teams[teamKey];
    newTeam.title = newTitle;
    dispatch(EditTeam(newTeam));
  };

  const handleMembersChange = (modifiedTeam: Team) => {
    dispatch(ChangeMembers(modifiedTeam));
  };

  const handleTeamDelete = (id: number) => {
    dispatch(RemoveTeam({ id: id }));
  };

  const resetSelect = () => {
    setEditKey(-1);
  };

  const handleEditButton = (teamKey: number) => {
    setEditKey(teamKey === editKey ? -1 : teamKey);
  };

  const onButtonClick = (setEditPressed: boolean, resetTeamName?: boolean) => {
    resetTeamName && setNewTeamTitle('');
    setAddTeamPressed(setEditPressed);
  };

  const onSaveButtonClick = () => {
    if (!isNewTeamTitleValid) {
      showNotification(`Invalid team's title.`, 'warning');
    } else if (teamNameExists(newTeamTitle)) {
      showNotification(`Team with that title already exists.`, 'warning');
    } else {
      dispatch(AddTeam({ title: newTeamTitle, members: [], sprints: [] }));
      setAddTeamPressed(false);
      showNotification(`Team created successfully.`, 'success');
    }
  };

  return (
    <>
      <Table className="teamTable">
        <TableHead className="teamTable">
          <TableRow className="">
            <TableCell>
              <Typography variant="h6">Team name</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Members</Typography>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="teamTable">
          {_.map(teams, (team: Team, teamKey) => (
            <TeamData
              allUsers={users}
              checkIfTitleExists={teamNameExists}
              edit={teamKey === editKey}
              handleEditButton={handleEditButton}
              handleMembersChange={handleMembersChange}
              handleTeamDelete={handleTeamDelete}
              handleTeamRename={handleTeamRename}
              key={`${team.title}-${teamKey}`}
              resetSelect={() => resetSelect()}
              showNotification={showNotification}
              team={team}
              teamKey={teamKey}
              teamsSprints={formatTeamSprints(team.sprints)}
            />
          ))}
          <TableRow>
            <TableCell>
              {addTeamPressed && (
                <ValidatedTextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setNewTeamTitle(e.target.value)}
                  placeholder="Team's title"
                  type="text"
                  validationProps={{
                    isValid: isNewTeamTitleValid,
                    setIsValid: setisNewTeamTitleValid,
                    maxLength: 30,
                  }}
                  value={newTeamTitle}
                  variant="standard"
                />
              )}
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              {!addTeamPressed ? (
                <SvgIcon className={classes.pointer} component={AddIcon} onClick={() => onButtonClick(true, true)} />
              ) : (
                <>
                  <SvgIcon className={classes.pointer} component={SaveIcon} onClick={onSaveButtonClick} />
                  <SvgIcon className={classes.pointer} component={ClearIcon} onClick={() => onButtonClick(false)} />
                </>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};
