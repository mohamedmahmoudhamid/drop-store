import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import "./Favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const { updateCounts } = useStore();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleRemove = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    updateCounts();
  };

  const handleClearAll = () => {
    setFavorites([]);
    localStorage.removeItem("favorites");
    updateCounts();
  };

  if (favorites.length === 0)
    return (
      <Box sx={{ height: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>لا توجد منتجات في المفضلة</Typography>
        <Button variant="contained" component={Link} to="/" sx={{ backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}>تسوق الآن</Button>
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">المفضلات ({favorites.length})</Typography>
        <Button variant="outlined" color="error" onClick={handleClearAll}>حذف الكل</Button>
      </Box>

      <Box className="favorites-grid">
        {favorites.map((item) => (
          <Box key={item.id} className="fav-grid-item">
            <Card className="fav-card">
              <Link to={`/product/${item.id}`} style={{ textDecoration: "none", width: "100%" }}>
                <Box className="fav-card-img-wrapper">
                  <img src={item.image} alt={item.title} className="fav-card-img" />
                </Box>
              </Link>

              <CardContent className="fav-card-content">
                <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
                <Typography color="text.secondary">EGP {item.final_price}</Typography>
              </CardContent>

              <Box className="fav-card-delete">
                <IconButton color="error" onClick={() => handleRemove(item.id)}><Delete /></IconButton>
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Favorites;
