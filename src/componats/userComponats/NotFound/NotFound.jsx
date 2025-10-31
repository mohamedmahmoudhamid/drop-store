import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.jpg";

const NotFound = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        gap: 2,
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{ width: 100, height: 100, borderRadius: "50%", marginBottom: 10 }}
      />

      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        الصفحة غير موجودة
      </Typography>

      <Typography variant="body1" sx={{ color: "gray" }}>
        الصفحة التي تبحث عنها غير متوفرة أو تم حذفها
      </Typography>

      <Button
        variant="contained"
        component={Link}
        to="/"
        sx={{
          mt: 2,
          backgroundColor: "black",
          "&:hover": { backgroundColor: "#333" },
        }}
      >
        الرجوع إلى الصفحة الرئيسية
      </Button>
    </Box>
  );
};

export default NotFound;
