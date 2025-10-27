import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Link, Navigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
    const { updateCounts } = useStore();

  // تحميل المفضلات من localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // حذف منتج واحد
  const handleRemove = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    updateCounts();
  };

  // حذف الكل
  const handleClearAll = () => {
    setFavorites([]);
    localStorage.removeItem("favorites");
    updateCounts();
  };

  if (favorites.length === 0)
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          لا توجد منتجات في المفضلة
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/"
          sx={{
            backgroundColor: "black",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          تسوق الآن
        </Button>
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          المفضلات ({favorites.length})
        </Typography>

        <Button
          variant="outlined"
          color="error"
          onClick={handleClearAll}
        >
          حذف الكل
        </Button>
      </Box>

      <Grid container spacing={3}>
        {favorites.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
            <Link to={`/product/${item.id}`} style={{ textDecoration: "none" }}>
  <CardMedia
    component="img"
    height="180"
    image={item.image}
    alt={item.title}
    sx={{
      borderRadius: 2,
      objectFit: "cover",
      cursor: "pointer",
    }}
  />
</Link>

              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold">
                  {item.name}
                </Typography>
                <Typography color="text.secondary">EGP {item.final_price}</Typography>
              </CardContent>

              <Box>
                <IconButton
                  color="error"
                  onClick={() => handleRemove(item.id)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Favorites;
