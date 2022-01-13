import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import ValidatedTextField from '../ValidatedTextField/ValidatedTextField';
import validationMessages from '../../locales/en.json';
import { getLoginState } from '../../state/selectors/loginSelectors';
import { roleArray } from '../../state/reducers/usersReducer';
import { SetNotificationAction } from '../../state/actions/notificationsActions';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface PreferencesFormData {
  oldPassword: string;
  newPassword: string;
  newRepeatPassword: string;
  role: string;
}

const InitialFormData: PreferencesFormData = {
  oldPassword: '',
  newPassword: '',
  newRepeatPassword: '',
  role: '',
};

export const doPasswordsMatch = (otherPassword: string, setIsOtherValid: Function) => {
  return (input: string) => {
    const isEqual = input === otherPassword;
    setIsOtherValid(isEqual);
    return isEqual;
  };
};

function Preferences() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { teamRole } = useSelector(getLoginState).user;
  const [formData, setFormData] = useState<PreferencesFormData>({ ...InitialFormData, role: teamRole });
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(false);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);
  const [isNewRepeatPasswordValid, setIsNewRepeatPasswordValid] = useState(false);

  const history = useHistory();

  const onSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(SetNotificationAction({ isOpen: true, message: 'Information updated successfully.', type: 'success' }));
    history.push('/calendar');
  };

  const saveButtonEnabled =
    (_.isEmpty(formData.oldPassword) &&
      _.isEmpty(formData.newRepeatPassword) &&
      _.isEmpty(formData.newPassword) &&
      formData.role !== teamRole) ||
    (isOldPasswordValid && isNewPasswordValid && isNewRepeatPasswordValid);

  const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof PreferencesFormData) => {
    formData[field.toString()] = e.target.value;
    setFormData({ ...formData });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Change user preferences
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                defaultValue={teamRole}
                fullWidth
                id="role"
                label="Role"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e, 'role')}
                select
                variant="outlined"
              >
                {_.map(roleArray, (role) => (
                  <MenuItem key={`${role}-item`} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <ValidatedTextField
                autoComplete="new-password"
                fullWidth
                id="oldPassword"
                label="Old password"
                name="oldPassword"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e, 'oldPassword')}
                type="password"
                validationProps={{
                  isValid: isOldPasswordValid,
                  setIsValid: setIsOldPasswordValid,
                }}
                value={formData.oldPassword}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <ValidatedTextField
                autoComplete="new-password"
                fullWidth
                helperText={validationMessages.passwordRule}
                id="newPassword"
                label="New password"
                name="newPassword"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e, 'newPassword')}
                type="password"
                validationProps={{
                  isValid: isNewPasswordValid,
                  setIsValid: setIsNewPasswordValid,
                  additionalCheck: (input: string) => {
                    setIsNewRepeatPasswordValid(input === formData.newRepeatPassword);
                    return true;
                  },
                  regexString: '^(.{0,5}|[^0-9]*|[^A-Z]*)$',
                  regexRuleReverse: true,
                }}
                value={formData.newPassword}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <ValidatedTextField
                autoComplete="new-password"
                fullWidth
                helperText={validationMessages.passwordMatchRule}
                id="repeatPassword"
                label="Repeat new password"
                name="repeatPassword"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e, 'newRepeatPassword')}
                type="password"
                validationProps={{
                  isValid: isNewRepeatPasswordValid,
                  setIsValid: setIsNewRepeatPasswordValid,
                  additionalCheck: (input: string) => {
                    return input === formData.newPassword;
                  },
                  regexString: '^(.{0,5}|[^0-9]*|[^A-Z]*)$',
                  regexRuleReverse: true,
                }}
                value={formData.newRepeatPassword}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Button
            className={classes.submit}
            color="primary"
            disabled={!saveButtonEnabled}
            fullWidth
            onClick={onSubmitClick}
            type="submit"
            variant="contained"
          >
            Save changes
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default Preferences;
