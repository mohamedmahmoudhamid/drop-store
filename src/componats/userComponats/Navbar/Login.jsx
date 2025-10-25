import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ece9e6, #ffffff)",
        p: 2,
      }}
    >
      <Paper
        sx={{
          p: 5,
          width: { xs: "90%", sm: 400 },
          textAlign: "center",
          borderRadius: 4,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          mb={3}
          sx={{ fontWeight: 700, color: "#333", fontFamily: "'Roboto', sans-serif" }}
        >
          Welcome Back
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              "& .MuiInputBase-root": { borderRadius: 2 },
              "& label": { color: "#666" },
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              "& .MuiInputBase-root": { borderRadius: 2 },
              "& label": { color: "#666" },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 3,
              fontWeight: "bold",
              textTransform: "none",
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              "&:hover": {
                background: "linear-gradient(90deg, #2575fc, #6a11cb)",
              },
            }}
          >
            Login
          </Button>
        </form>

        <Typography variant="body2" mt={3} sx={{ color: "#666" }}>
          Don't have an account?{" "}
          <a href="/register" style={{ color: "#2575fc", fontWeight: 500 }}>
            Sign up
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
