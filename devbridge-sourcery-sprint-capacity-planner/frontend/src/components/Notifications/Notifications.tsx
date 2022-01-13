import React from 'react';
import { Alert } from '@material-ui/lab';
import { makeStyles, Snackbar } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import { getNotificationsState } from '../../state/selectors/notificationsSelector';
import { ClearNotification } from '../../state/actions/notificationsActions';

const useStyles = makeStyles((theme) => ({
  root: {
    top: theme.spacing(7),
  },
}));

export default function Notification() {
  const dispatch = useDispatch();
  const { message, type, isOpen } = useSelector(getNotificationsState);
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(ClearNotification());
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={3000}
      className={classes.root}
      onClose={handleClose}
      open={isOpen}
    >
      <Alert severity={type}>{message}</Alert>
    </Snackbar>
  );
}
