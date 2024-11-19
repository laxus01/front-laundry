import { Card, CardContent, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
//import { getBackup } from "../services/dashboard.services";

export const User = () => {
  const [showCard, setShowCard] = useState(false);

  const handleUserClick = () => {
    setShowCard(!showCard);
  };

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    window.location.href = "/";
  };

  /* const generateBackup = async() => {
    try {
      getBackup();
    } catch (error) {
      console.log(error);
    }
  }; */

  return (
    <div>
      <div className="user" onClick={handleUserClick}>
        <PersonIcon
          style={{ width: "35px", height: "35px", color: "#9FB404" }}
        />
      </div>
      {showCard && (
        <Card style={{ position: "absolute", top: "65px", right: "10px" }}>
          <CardContent sx={{ display: "flex", flexDirection: "column" }}>
            {/* <Button onClick={generateBackup}>
              <label className="color-lime cursor-pointer">Crear Backup</label>
            </Button> */}
            <Button onClick={handleLogout}>
              <label className="color-lime cursor-pointer">Cerrar Sesión</label>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
