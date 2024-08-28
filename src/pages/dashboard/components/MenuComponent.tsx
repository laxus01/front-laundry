// MenuComponent.tsx
import React, { useState } from 'react';
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Person, Settings, Menu as MenuIcon } from '@mui/icons-material';
import "../styles/dashboard.scss";

const MenuComponent: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon className='color-white'/>
      </IconButton>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          <ListItem component="li" onClick={toggleDrawer(false)}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItem>
          <ListItem component="li" onClick={toggleDrawer(false)}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Perfil" />
          </ListItem>
          <ListItem component="li" onClick={toggleDrawer(false)}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Configuración" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default MenuComponent;