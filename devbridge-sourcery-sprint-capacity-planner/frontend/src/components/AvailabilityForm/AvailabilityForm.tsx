import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { Button } from '@material-ui/core';
import { addDays } from 'date-fns';
import _ from 'lodash';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import { getLoginState } from '../../state/selectors/loginSelectors';
import { getUsersState } from '../../state/selectors/usersSelectors';
import { UsersState, User, DayOff } from '../../state/reducers/usersReducer';
import { AddDayOff, EditDayOff } from '../../state/actions/usersThunk';
import ValidatedTextField from '../ValidatedTextField/ValidatedTextField';
import validationMessages from '../../locales/en.json';
import { getDate, checkIsDaysValid, checkIsStartDateValid, checkIsEndDateValid } from './AvailabilityFormHelpers';
import { SetNotificationAction } from '../../state/actions/notificationsActions';

export const formatDateToString = (date: Date | string) => {
  return typeof date === 'string' ? date : _.split(date.toISOString(), 'T')[0];
};

interface AvailabilityFormProps {
  editId: number; // when editId equals 0, add new entry, otherwise editing existing entry
  startDate?: Date;
  endDate?: Date;
  setEditId: (id: number) => void;
  onSubmit?: Function;
}

interface TTempFormData {
  startDate: Date;
  endDate: Date;
  days: number | string;
  reason: string;
}

const initialTempFormData: TTempFormData = {
  startDate: new Date(),
  endDate: addDays(new Date(), 1),
  days: '',
  reason: '',
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mainForm: {
    marginBottom: theme.spacing(4),
  },
}));

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ editId, setEditId, startDate, endDate, onSubmit }) => {
  const classes = useStyles();
  const username: string = useSelector(getLoginState)?.user?.username;
  const allUsers: UsersState = useSelector(getUsersState);
  const dispatch = useDispatch();

  const isInEditMode = editId !== 0;

  const [isReasonValid, setIsReasonValid] = useState(isInEditMode);
  const [isDaysValid, setIsDaysValid] = useState(isInEditMode);
  const [isStartDateValid, setIsStartDateValid] = useState(true);
  const [isEndDateValid, setIsEndDateValid] = useState(true);
  const [isDirty, setIsDirty] = useState(isInEditMode);
  //set text field data based on if editing or adding
  const getInitialData = useCallback((): TTempFormData => {
    if (!isInEditMode) {
      return startDate && endDate
        ? { ...initialTempFormData, startDate: startDate, endDate: endDate }
        : initialTempFormData;
    }
    const user: User = _.find(allUsers.Users, { userName: username });
    if (user === null) {
      return startDate && endDate
        ? { ...initialTempFormData, startDate: startDate, endDate: endDate }
        : initialTempFormData;
    }
    const dayOffToEdit: DayOff = _.find(user.daysOff, { id: editId });
    if (dayOffToEdit === null) {
      return startDate && endDate
        ? { ...initialTempFormData, startDate: startDate, endDate: endDate }
        : initialTempFormData;
    }
    return {
      startDate: dayOffToEdit.startDate,
      endDate: dayOffToEdit.endDate,
      days: dayOffToEdit.daysCount,
      reason: dayOffToEdit.reason,
    };
  }, [allUsers.Users, editId, endDate, isInEditMode, startDate, username]);

  const [formData, setFormData] = useState<TTempFormData>(getInitialData());

  //When edit id changes, we set validity depending on if we're editing or adding
  useEffect(() => {
    setIsDirty(isInEditMode);
    setIsDaysValid(isInEditMode);
    setIsReasonValid(isInEditMode);
    setIsStartDateValid(true);
    setIsEndDateValid(true);
    setFormData(getInitialData());
  }, [editId, getInitialData, isInEditMode]);

  const maxDays = Infinity;
  const isValid = isReasonValid && isDaysValid && isStartDateValid && isEndDateValid;

  const onReasonChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, reason: e.target.value });
  };

  const onDaysChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormData({ ...formData, days: isNaN(value) ? '' : value });
  };

  const onStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsDate;
    setFormData({ ...formData, startDate: value === null ? new Date() : value });
  };

  const onEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsDate;
    setFormData({ ...formData, endDate: value === null ? new Date() : value });
  };

  const checkDays = (input: string) => {
    return checkIsDaysValid(input, maxDays, getDate(formData.startDate), getDate(formData.endDate));
  };

  const checkStartDate = (input: string) => {
    return checkIsStartDateValid(input, formData.endDate, formData.days, maxDays, setIsDaysValid, setIsEndDateValid);
  };

  const checkEndDate = (input: string) => {
    return checkIsEndDateValid(input, formData.startDate, formData.days, maxDays, setIsDaysValid, setIsStartDateValid);
  };

  const AddDaysOffActionHandler = (name: string, startDate: Date, endDate: Date, count: number, reason: string) => {
    dispatch(
      AddDayOff({
        name,
        startDate,
        endDate,
        count,
        reason,
      })
    );
  };

  const EditDaysOffActionHandler = (name: string, startDate: Date, endDate: Date, count: number, reason: string) => {
    dispatch(EditDayOff({ id: editId, name, startDate, endDate, count, reason }));
  };

  const onSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isInEditMode) {
      AddDaysOffActionHandler(
        username,
        startDate ? startDate : formData.startDate,
        endDate ? endDate : formData.endDate,
        typeof formData.days !== 'number' ? Number.parseInt(formData.days) : formData.days,
        formData.reason
      );
      dispatch(
        SetNotificationAction({
          isOpen: true,
          message: 'Entry Submitted',
          type: 'success',
        })
      );
    } else {
      EditDaysOffActionHandler(
        username,
        formData.startDate,
        formData.endDate,
        typeof formData.days !== 'number' ? Number.parseInt(formData.days) : formData.days,
        formData.reason
      );
      dispatch(
        SetNotificationAction({
          isOpen: true,
          message: 'Entry changed',
          type: 'success',
        })
      );
    }
    setEditId(0);
    if (onSubmit) {
      onSubmit();
    }
  };

  const onCancel = () => {
    dispatch(
      SetNotificationAction({
        isOpen: true,
        message: 'Edit cancelled',
        type: 'warning',
      })
    );
    setEditId(0);
  };

  return (
    <div>
      <Container className={classes.paper} component="main" maxWidth="md">
        <form className="availability-form">
          <Grid className={classes.mainForm} container spacing={2}>
            <Grid item md={4} xs={6}>
              <ValidatedTextField
                disabled={startDate !== undefined}
                fullWidth
                helperText={!startDate && `${validationMessages.startDate}`}
                InputLabelProps={{ shrink: true }}
                label="Date from"
                onChange={onStartDateChange}
                type="date"
                validationProps={{
                  isValid: isStartDateValid,
                  setIsValid: setIsStartDateValid,
                  additionalCheck: checkStartDate,
                  isDirty: isDirty,
                  setIsDirty: setIsDirty,
                }}
                value={
                  startDate
                    ? formatDateToString(startDate)
                    : formData.startDate === null
                    ? ''
                    : formatDateToString(formData.startDate)
                }
                variant="outlined"
              />
            </Grid>
            <Grid item md={4} xs={6}>
              <ValidatedTextField
                disabled={endDate !== undefined}
                fullWidth
                helperText={!endDate && `${validationMessages.endDate}`}
                InputLabelProps={{ shrink: true }}
                label="Date to"
                onChange={onEndDateChange}
                type="date"
                validationProps={{
                  isValid: isEndDateValid,
                  setIsValid: setIsEndDateValid,
                  additionalCheck: checkEndDate,
                  isDirty: isDirty,
                  setIsDirty: setIsDirty,
                }}
                value={
                  endDate
                    ? formatDateToString(endDate)
                    : formData.endDate === null
                    ? ''
                    : formatDateToString(formData.endDate)
                }
                variant="outlined"
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <ValidatedTextField
                fullWidth
                helperText={validationMessages.maxDays3}
                label="Day Count"
                onChange={onDaysChange}
                validationProps={{
                  isValid: isDaysValid,
                  setIsValid: setIsDaysValid,
                  additionalCheck: checkDays,
                  isDirty: isDirty,
                  regexString: '^[0-9]*$',
                  strictRegex: true,
                  setIsDirty: setIsDirty,
                }}
                value={formData.days.toString()}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <ValidatedTextField
                fullWidth
                label="Reason"
                onChange={onReasonChange}
                validationProps={{
                  isValid: isReasonValid,
                  setIsValid: setIsReasonValid,
                  isDirty: isDirty,
                  setIsDirty: setIsDirty,
                }}
                value={formData.reason}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid alignItems="center" container justify="space-between" spacing={2}>
            <Grid item>
              {isInEditMode && (
                <Button color="secondary" id="cancelButton" onClick={onCancel} type="submit" variant="contained">
                  Cancel
                </Button>
              )}
            </Grid>
            <Grid item>
              <Button
                color="primary"
                disabled={!isValid || !isDirty}
                id="submitButton"
                onClick={onSubmitClick}
                type="submit"
                variant="contained"
              >
                {!isInEditMode && 'Submit'}
                {isInEditMode && 'Edit'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </div>
  );
};

export default AvailabilityForm;
