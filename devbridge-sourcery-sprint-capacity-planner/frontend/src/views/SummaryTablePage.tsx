import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Container from '@material-ui/core/Container';

import SummaryTable from '../components/SummaryTable/SummaryTable';
import { LoadTeams } from '../state/actions/teamThunk';
import { LoadUsers } from '../state/actions/usersThunk';

const SummaryTablePage: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(LoadUsers());
    dispatch(LoadTeams());
  }, [dispatch]);

  return (
    <Container>
      <SummaryTable />
    </Container>
  );
};
export default SummaryTablePage;
