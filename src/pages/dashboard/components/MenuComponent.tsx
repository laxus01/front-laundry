// MenuComponent.tsx
import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import WashIcon from "@mui/icons-material/Wash";
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Link } from "react-router-dom";
import "../styles/dashboard.scss";

const MenuComponent: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon className="color-white" />
      </IconButton>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>  
          <ListItem
            className="cursor-pointer"
            component="li"
            onClick={toggleDrawer(false)}
          >
            <ListItemIcon>
              <AssignmentIcon className="color-blue" />
            </ListItemIcon>
            <ListItemText primary="Atenciones" />
          </ListItem>
          <Link to="/dashboard/vehicles" onClick={toggleDrawer(false)}>
            <ListItem
              className="cursor-pointer"
              component="li"              
            >
              <ListItemIcon>
                <DirectionsCarIcon className="color-blue" />
              </ListItemIcon>
              <ListItemText primary="Vehiculos" />
            </ListItem>
          </Link>
          <ListItem
            className="cursor-pointer"
            component="li"
            onClick={toggleDrawer(false)}
          >
            <ListItemIcon>
              <WashIcon className="color-blue" />
            </ListItemIcon>
            <ListItemText primary="Lavadores" />
          </ListItem>
          <ListItem
            className="cursor-pointer"
            component="li"
            onClick={toggleDrawer(false)}
          >
            <ListItemIcon>
              <LocalParkingIcon className="color-blue" />
            </ListItemIcon>
            <ListItemText primary="Parqueos" />
          </ListItem>
          <ListItem
            className="cursor-pointer"
            component="li"
            onClick={toggleDrawer(false)}
          >
            <ListItemIcon>
              <ShoppingCartIcon className="color-blue" />
            </ListItemIcon>
            <ListItemText primary="Compras" />
          </ListItem>
          <ListItem
            className="cursor-pointer"
            component="li"
            onClick={toggleDrawer(false)}
          >
            <ListItemIcon>
              <MonetizationOnIcon className="color-blue" />
            </ListItemIcon>
            <ListItemText primary="Gastos" />
          </ListItem>
          <ListItem
            className="cursor-pointer"
            component="li"
            onClick={toggleDrawer(false)}
          >
            <ListItemIcon>
              <ShoppingBasketIcon className="color-blue" />
            </ListItemIcon>
            <ListItemText primary="Productos" />
          </ListItem>
          <ListItem
            className="cursor-pointer"
            component="li"
            onClick={toggleDrawer(false)}
          >
            <ListItemIcon>
              <LocalCarWashIcon className="color-blue" />
            </ListItemIcon>
            <ListItemText primary="Servicios" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default MenuComponent;
