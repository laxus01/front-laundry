// MenuComponent.tsx
import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { 
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  FormatListBulleted as ListIcon
} from "@mui/icons-material";
import WashIcon from "@mui/icons-material/Wash";
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { Link } from "react-router-dom";
import "../styles/dashboard.scss";

const MenuComponent: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [listadosOpen, setListadosOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleListadosClick = () => {
    setListadosOpen(!listadosOpen);
  };

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon className="color-white" />
      </IconButton>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          <Link to="/dashboard/attentions" onClick={toggleDrawer(false)}>
            <ListItem className="cursor-pointer" component="li">
              <ListItemIcon>
                <AssignmentIcon className="color-dark" />
              </ListItemIcon>
              <ListItemText primary="Atenciones" />
            </ListItem>
          </Link>

          <ListItem className="cursor-pointer" component="li" onClick={handleListadosClick}>
            <ListItemIcon>
              <ListIcon className="color-dark" />
            </ListItemIcon>
            <ListItemText primary="Listados" />
            {listadosOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          
          <Collapse in={listadosOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link to="/dashboard/vehicles" onClick={toggleDrawer(false)}>
                <ListItem className="cursor-pointer" component="li" sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <DirectionsCarIcon className="color-dark" />
                  </ListItemIcon>
                  <ListItemText primary="Vehículos" />
                </ListItem>
              </Link>

              <Link to="/dashboard/washers" onClick={toggleDrawer(false)}>
                <ListItem className="cursor-pointer" component="li" sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <WashIcon className="color-dark" />
                  </ListItemIcon>
                  <ListItemText primary="Lavadores" />
                </ListItem>
              </Link>

              <Link to="/dashboard/products" onClick={toggleDrawer(false)}>
                <ListItem className="cursor-pointer" component="li" sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ShoppingBasketIcon className="color-dark" />
                  </ListItemIcon>
                  <ListItemText primary="Productos" />
                </ListItem>
              </Link>

              <Link to="/dashboard/services" onClick={toggleDrawer(false)}>
                <ListItem className="cursor-pointer" component="li" sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <LocalCarWashIcon className="color-dark" />
                  </ListItemIcon>
                  <ListItemText primary="Servicios" />
                </ListItem>
              </Link>
            </List>
          </Collapse>

          <Link to="/dashboard/sales" onClick={toggleDrawer(false)}>
            <ListItem className="cursor-pointer" component="li">
              <ListItemIcon>
                <PointOfSaleIcon className="color-dark" />
              </ListItemIcon>
              <ListItemText primary="Ventas" />
            </ListItem>
          </Link>

          <Link to="/dashboard/parkings" onClick={toggleDrawer(false)}>
            <ListItem className="cursor-pointer" component="li">
              <ListItemIcon>
                <LocalParkingIcon className="color-dark" />
              </ListItemIcon>
              <ListItemText primary="Parqueos" />
            </ListItem>
          </Link>

          <ListItem
            className="cursor-pointer"
            component="li"
            onClick={toggleDrawer(false)}
          >
            <ListItemIcon>
              <ShoppingCartIcon className="color-dark" />
            </ListItemIcon>
            <ListItemText primary="Compras" />
          </ListItem>

          <ListItem
            className="cursor-pointer"
            component="li"
            onClick={toggleDrawer(false)}
          >
            <ListItemIcon>
              <MonetizationOnIcon className="color-dark" />
            </ListItemIcon>
            <ListItemText primary="Gastos" />
          </ListItem>

        </List>
      </Drawer>
    </div>
  );
};

export default MenuComponent;
