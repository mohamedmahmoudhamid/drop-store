import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
} from "@mui/material";
import {
  FavoriteBorder,
  ShoppingCartOutlined,
  Menu as MenuIcon,
  Inventory2Outlined,
} from "@mui/icons-material";
import logo from "../../../assets/logoo.png";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import apiLink from "../../../apiLink";

const Header = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
const { cartCount, favCount, ordersCount, updateCounts } = useStore();


  const isAdmin = localStorage.getItem("adminName") === "drop store admin";

  const toggleDrawer = (state) => () => {
    setOpenDrawer(state);
  };

useEffect(() => {
  if (isAdmin) {
    fetch(`${apiLink}/orders`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          localStorage.setItem("orders", JSON.stringify(data.data));
          updateCounts();
        }
      })
      .catch((err) => console.error("❌ Error fetching orders count:", err));
  }
}, [isAdmin, updateCounts]);


  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
          px: { xs: 2, sm: 6 },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src={logo}
              alt="Drop Store Logo"
              style={{
                width: "100%",
                height: 60,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </Box>

          {/* Links */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 4,
            }}
          >
            <Link
              to="/"
              style={{ textDecoration: "none", color: "black", fontWeight: 500 }}
            >
              Home
            </Link>
            <Link
              to="/about"
              style={{ textDecoration: "none", color: "black", fontWeight: 500 }}
            >
              About
            </Link>
            <Link
              to="/contact"
              style={{ textDecoration: "none", color: "black", fontWeight: 500 }}
            >
              Contact
            </Link>
          </Box>

          {/* Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" component={Link} to="/favorites">
              <Badge badgeContent={favCount} color="error">
                <FavoriteBorder />
              </Badge>
            </IconButton>

            <IconButton color="inherit" component={Link} to="/cart">
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>

            {isAdmin && (
              <IconButton color="inherit" component={Link} to="/orderTable" sx={{ display: { xs: "none", sm: "block" } }}>
                <Badge badgeContent={ordersCount} color="error">
                  <Inventory2Outlined />
                </Badge>
              </IconButton>
            )}

            {/* Menu Icon (mobile) */}
            <IconButton
              sx={{ display: { xs: "block", sm: "none" } }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer Menu (mobile) */}
      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 220, p: 2 }}
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Drop Store
          </Typography>
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/about">
              <ListItemText primary="About" />
            </ListItem>
            <ListItem button component={Link} to="/contact">
              <ListItemText primary="Contact" />
            </ListItem>

            {/* ✅ زر الطلبات برضو يظهر هنا لو الأدمن داخل */}
            {isAdmin && (
              <ListItem button component={Link} to="/orderTable">
                <ListItemText
                  primary={`Orders (${ordersCount})`}
                  sx={{ color: "#0288d1" }}
                />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
