/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { AppBar, Toolbar, Box } from '@material-ui/core';
import _ from 'lodash';

const NavBar: React.FC = (props) => {
  const groupedChildren = _.groupBy(props.children, (child) => child.props.position);
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Box display="flex" marginRight="auto">
          {groupedChildren.left}
        </Box>
        <Box display="flex" marginLeft="auto">
          {groupedChildren.right}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
