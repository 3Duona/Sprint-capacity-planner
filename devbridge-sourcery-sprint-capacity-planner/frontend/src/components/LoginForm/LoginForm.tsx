import React, { useState } from 'react';
import './LoginForm.css';
import { Checkbox, Button, Box, FormControlLabel, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { login } from '../../domain/AuthApi';
import ValidatedTextField from '../ValidatedTextField/ValidatedTextField';
import Roles from '../Roles/UserRoles';

const useStyles = makeStyles({
  inputfield: {
    marginTop: '10px',
    marginBottom: '5px',
  },
  cboxtext: {
    fontSize: '0.8rem',
  },
  login: {
    marginRight: 5,
  },
  register: {
    marginLeft: 5,
  },
  header: {
    margin: 10,
    textAlign: 'center',
  },
});

const GetRole = () => {
  //To be edited, when we can get roles from BE
  return Roles.ADMIN;
};

interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

const InitialFormData: LoginFormData = {
  username: '',
  password: '',
  remember: false,
};

const LoginForm: React.FC = () => {
  const classes = useStyles();

  const [formData, setFormData] = useState<LoginFormData>(InitialFormData);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const dispatch = useDispatch();

  const isFormValid = isUsernameValid && isPasswordValid;

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password, remember } = formData;
    dispatch(
      login({
        username: username,
        password: password,
        role: GetRole(),
        remember: remember,
      })
    );
  };

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, username: e.target.value });
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const onRememberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, remember: e.target.checked });
  };

  return (
    <form className="login-form" onSubmit={onFormSubmit}>
      <Box className={classes.header}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
      </Box>
      <Box>
        <ValidatedTextField
          autoFocus
          className={classes.inputfield}
          error={false}
          fullWidth
          id="username"
          label="Username"
          onChange={onUsernameChange}
          validationProps={{
            isValid: isUsernameValid,
            setIsValid: setIsUsernameValid,
            regexString: '[._]{2,}',
            regexRuleReverse: true,
          }}
          value={formData.username}
          variant="outlined"
        />
      </Box>
      <Box>
        <ValidatedTextField
          className={classes.inputfield}
          error={false}
          fullWidth
          id="password"
          label="Password"
          onChange={onPasswordChange}
          type="password"
          validationProps={{
            isValid: isPasswordValid,
            setIsValid: setIsPasswordValid,
          }}
          value={formData.password}
          variant="outlined"
        />
      </Box>
      <Box>
        <FormControlLabel
          control={<Checkbox color="primary" name="remember-user" onChange={onRememberChange} />}
          label={<Typography className={classes.cboxtext}>Remember me</Typography>}
        />
      </Box>
      <Box>
        <Button className={classes.login} color="primary" disabled={!isFormValid} type="submit" variant="contained">
          Sign in
        </Button>
        <Button className={classes.register} color="primary" component={Link} to="/register" variant="contained">
          Register
        </Button>
      </Box>
    </form>
  );
};
export default LoginForm;
