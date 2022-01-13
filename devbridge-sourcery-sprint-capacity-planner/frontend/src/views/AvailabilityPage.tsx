import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import { getLoginState } from '../state/selectors/loginSelectors';
import AvailabilityForm from '../components/AvailabilityForm/AvailabilityForm';
import AvailabilityTable from '../components/AvailabilityTable/AvailabilityTable';
import { LoadUsers, RemoveDayOff } from '../state/actions/usersThunk';
import { LoadTeams } from '../state/actions/teamThunk';

const useStyles = makeStyles((theme) => ({
  main: {
    marginBottom: theme.spacing(4),
  },
}));

const AvailabilityFormPage: React.FC = () => {
  const username: string = useSelector(getLoginState)?.user?.username;

  const classes = useStyles();
  const [editId, setEditId] = useState<number>(0);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(LoadUsers());
    dispatch(LoadTeams());
  }, [dispatch]);

  const onEdit = (id: number) => {
    setEditId(id);
  };

  const onRemove = (id: number) => {
    if (id === editId) {
      setEditId(0);
    }
    dispatch(RemoveDayOff({ id, name: username }));
  };

  return (
    <Container>
      <div className={classes.main}>
        <AvailabilityForm editId={editId} setEditId={setEditId} />
      </div>
      <Typography component="h1" variant="h4">
        Current Availability
      </Typography>
      <div className={classes.main}>
        <AvailabilityTable onEdit={onEdit} onRemove={onRemove} />
      </div>
    </Container>
  );
};

export default AvailabilityFormPage;
