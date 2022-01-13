import React from 'react';
import { ListItem, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';

type NavBarButtonProps = {
  name: string;
  url: string;
  position: string;
};

const NavBarButton: React.FC<NavBarButtonProps> = ({ name, url }) => {
  return (
    <ListItem button component={Link} style={{ width: 'fit-content' }} to={url}>
      <ListItemText primary={name} />
    </ListItem>
  );
};

export default NavBarButton;
