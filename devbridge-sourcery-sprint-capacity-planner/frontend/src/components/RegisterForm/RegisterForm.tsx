import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import _ from 'lodash';
import { useDispatch } from 'react-redux';

import ValidatedTextField from '../ValidatedTextField/ValidatedTextField';
import validationMessages from '../../locales/en.json';
import { register } from '../../domain/AuthApi';
import { roleArray } from '../../state/reducers/usersReducer';

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

export interface RegisterFormData {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  role: string;
  remember: boolean;
}

const InitialFormData: RegisterFormData = {
  username: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  role: '',
  remember: false,
};

export default function Register() {
  const classes = useStyles();

  const [formData, setFormData] = useState<RegisterFormData>(InitialFormData);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isLastNameValid, setIsLastNameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);

  const isFormValid =
    isUsernameValid &&
    isFirstNameValid &&
    isLastNameValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    formData.role;

  const dispatch = useDispatch();

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof RegisterFormData) => {
    formData[field.toString()] = e.target.value;
    setFormData({ ...formData });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} noValidate onSubmit={onFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ValidatedTextField
                autoComplete="username"
                autoFocus
                fullWidth
                helperText={validationMessages.usernameRule}
                id="username"
                label="Username"
                name="username"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e, 'username')}
                validationProps={{
                  isValid: isUsernameValid,
                  setIsValid: setIsUsernameValid,
                  regexRuleReverse: true,
                  regexString: '[._]{2,}',
                  strictRegex: true,
                }}
                value={formData.username}
                variant="outlined"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <ValidatedTextField
                autoComplete="firstname"
                fullWidth
                id="firstname"
                label="First name"
                name="firstname"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e, 'firstName')}
                validationProps={{
                  isValid: isFirstNameValid,
                  setIsValid: setIsFirstNameValid,
                }}
                value={formData.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <ValidatedTextField
                autoComplete="lastname"
                fullWidth
                id="lastname"
                label="Last name"
                name="lastname"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e, 'lastName')}
                validationProps={{
                  isValid: isLastNameValid,
                  setIsValid: setIsLastNameValid,
                }}
                value={formData.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <ValidatedTextField
                autoComplete="new-password"
                fullWidth
                helperText={validationMessages.passwordRule}
                id="password"
                label="Password"
                name="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e, 'password')}
                type="password"
                validationProps={{
                  isValid: isPasswordValid,
                  setIsValid: setIsPasswordValid,
                  regexString: '^(.{0,5}|[^0-9]*|[^A-Z]*)$',
                  regexRuleReverse: true,
                  additionalCheck: (input: string) => {
                    setIsConfirmPasswordValid(input === formData.confirmPassword);
                    return true;
                  },
                }}
                value={formData.password}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <ValidatedTextField
                autoComplete="new-password"
                fullWidth
                helperText={validationMessages.passwordMatchRule}
                id="confirmPassword"
                label="Confirm password"
                name="confirmPassword"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e, 'confirmPassword')}
                type="password"
                validationProps={{
                  isValid: isConfirmPasswordValid,
                  setIsValid: setIsConfirmPasswordValid,
                  regexString: '^(.{0,5}|[^0-9]*|[^A-Z]*)$',
                  regexRuleReverse: true,
                  additionalCheck: (input: string) => {
                    return input === formData.password;
                  },
                }}
                value={formData.confirmPassword}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                defaultValue=""
                fullWidth
                id="role"
                label="Role"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e, 'role')}
                required={true}
                select
                variant="outlined"
              >
                {_.map(roleArray, (role: string) => (
                  <MenuItem key={`${role}-item`} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Button
            className={classes.submit}
            color="primary"
            disabled={!isFormValid}
            fullWidth
            type="submit"
            variant="contained"
          >
            Register
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Login!
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
