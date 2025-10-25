import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Form Data:", form);
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
          Create Account
        </Typography>

        <form onSubmit={handleRegister}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleChange}
            required
            sx={{ "& .MuiInputBase-root": { borderRadius: 2 }, "& label": { color: "#666" } }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
            required
            sx={{ "& .MuiInputBase-root": { borderRadius: 2 }, "& label": { color: "#666" } }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
            sx={{ "& .MuiInputBase-root": { borderRadius: 2 }, "& label": { color: "#666" } }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            margin="normal"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            sx={{ "& .MuiInputBase-root": { borderRadius: 2 }, "& label": { color: "#666" } }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 3,
              fontWeight: "bold",
              textTransform: "none",
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              "&:hover": { background: "linear-gradient(90deg, #2575fc, #6a11cb)" },
            }}
          >
            Register
          </Button>
        </form>

        <Typography variant="body2" mt={3} sx={{ color: "#666" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#2575fc", fontWeight: 500 }}>
            Login
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
