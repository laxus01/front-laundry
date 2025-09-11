import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "./services/Login.services";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await login({ user, password });
    if (response) {
      localStorage.setItem("Authorization", response.data.token);
      navigate("/dashboard");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#d2e7f7",
        overflow: "hidden",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          border: "1px solid #ddd",
          borderRadius: 2,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" component="h2" color="#000000" gutterBottom>
          Iniciar Sesión
        </Typography>
        <TextField
          label="Usuario"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#999",
            "&:hover": {
              backgroundColor: "#026dc2",
            },
          }}
        >
          Iniciar Sesión
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
