import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Box,
  Stack,
  Fade,
  Chip,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
} from "@mui/material";
import {
  FavoriteBorder,
  Favorite,
  ShoppingCartOutlined,
  ShoppingCart,
} from "@mui/icons-material";
import img from "../../../assets/img.jpg";
import { useStore } from "../context/StoreContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { updateCounts } = useStore();

  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const item = product || {
    id: 1,
    title: "Hoodie",
    description: "Hoodies are comfortable and stylish.",
    oldPrice: 150,
    newPrice: 100,
    available: true,
    image: img,
    colors: ["أحمر", "أزرق", "أخضر", "أسود", "أبيض"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  };

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    setIsFavorite(favorites.some((fav) => fav.id === item.id));
    setInCart(cart.some((c) => c.id === item.id));
  }, [item.id]);

  const handleAddToCart = (item) => {
    if (inCart) {
      // إزالة من السلة
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const updated = cart.filter((p) => p.id !== item.id);
      localStorage.setItem("cart", JSON.stringify(updated));
      setMessage("تمت الإزالة من السلة");
      setInCart(false);
      setSeverity("error");
      updateCounts();
      setOpen(true);
    } else {
      // فتح نافذة اختيار اللون والمقاس
      setShowOptionsModal(true);
    }
  };

  const handleConfirmAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      setMessage("يرجى اختيار اللون والمقاس");
      setSeverity("error");
      setOpen(true);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = {
      ...item,
      quantity: 1,
      selectedColor,
      selectedSize,
    };

    const updated = [...cart, cartItem];
    localStorage.setItem("cart", JSON.stringify(updated));

    setMessage("تمت الإضافة إلى السلة");
    setInCart(true);
    setSeverity("success");
    setShowOptionsModal(false);
    setSelectedColor("");
    setSelectedSize("");
    updateCounts();
    setOpen(true);
  };

  const handleToggleFavorite = (item) => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = favorites.find((fav) => fav.id === item.id);
    let updated;

    if (exists) {
      updated = favorites.filter((fav) => fav.id !== item.id);
      setMessage("تم الحذف من المفضلة");
      setIsFavorite(false);
      setSeverity("error");
    } else {
      updated = [...favorites, item];
      setMessage("تمت الإضافة إلى المفضلة");
      setIsFavorite(true);
      setSeverity("success");
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    updateCounts();
    setOpen(true);
  };

  return (
    <>
      <Fade in timeout={500}>
        <Card
          sx={{
            width: 300,
            borderRadius: "33px 5px 18px 5px",
            m: 2,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            cursor: "pointer",
            position: "relative",
            background:
              "linear-gradient(to bottom right,#ffffff,#f7f8fa,#f2f4f8)",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            },
          }}
        >
          {/* حالة التوفر */}
          <Chip
            label={item.available ? "متاح" : "غير متاح"}
            color={item.available ? "success" : "error"}
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              fontWeight: "bold",
              fontSize: "0.8rem",
              zIndex: 2,
            }}
          />

          {/* المفضلة */}
          <Tooltip title={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}>
            <IconButton
              onClick={() => handleToggleFavorite(item)}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "rgba(255,255,255,0.9)",
                "&:hover": { backgroundColor: "#fff" },
                zIndex: 2,
              }}
            >
              {isFavorite ? (
                <Favorite sx={{ color: "#e53935", fontSize: 26 }} />
              ) : (
                <FavoriteBorder sx={{ color: "#444", fontSize: 26 }} />
              )}
            </IconButton>
          </Tooltip>

          {/* الصورة */}
          <CardMedia
            component="img"
            height="240"
            image={item.image}
            alt={item.title}
            onClick={() => navigate(`/product/${item.id}`)}
            sx={{
              objectFit: "cover",
              borderBottom: "1px solid #eee",
              opacity: item.available ? 1 : 0.6,
            }}
          />

          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 0.5, textTransform: "capitalize", color: "#222" }}
            >
              {item.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ height: 40, overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {item.description}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography
                  variant="body2"
                  sx={{ textDecoration: "line-through", color: "#999" }}
                >
                  ${item.oldPrice}
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ${item.newPrice}
                </Typography>
              </Stack>

              <Chip
                label="خصم"
                color="success"
                size="small"
                sx={{ fontWeight: "bold", px: 1 }}
              />
            </Stack>

            <Button
              fullWidth
              variant={inCart ? "outlined" : "contained"}
              color={inCart ? "error" : "primary"}
              startIcon={inCart ? <ShoppingCart /> : <ShoppingCartOutlined />}
              onClick={() => handleAddToCart(item)}
              disabled={!item.available}
              sx={{
                mt: 2,
                borderRadius: 3,
                py: 1,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              {inCart ? "إزالة من السلة" : "أضف للسلة"}
            </Button>
          </CardContent>
        </Card>
      </Fade>

      <Snackbar
        open={open}
        autoHideDuration={1800}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={severity}
          variant="filled"
          onClose={() => setOpen(false)}
          sx={{
            width: "100%",
            borderRadius: 3,
            fontWeight: "bold",
            fontSize: "0.95rem",
            background:
              severity === "success"
                ? "linear-gradient(45deg,#43a047,#66bb6a)"
                : "linear-gradient(45deg,#e53935,#ef5350)",
          }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* نافذة اختيار اللون والمقاس */}
      <Dialog
        open={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", pb: 1 }}>
          اختر اللون والمقاس
        </DialogTitle>

        <DialogContent sx={{ p: 2 }}>
          <Stack spacing={3}>
            {/* اختيار اللون */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1.5, fontWeight: "bold" }}
              >
                اللون
              </Typography>
              <Grid container spacing={1}>
                {item.colors?.map((color, index) => {
                  const colorMap = {
                    أحمر: "#e74c3c",
                    أزرق: "#3498db",
                    أخضر: "#2ecc71",
                    أسود: "#2c3e50",
                    أبيض: "#ecf0f1",
                    أصفر: "#f1c40f",
                    بنفسجي: "#9b59b6",
                    برتقالي: "#e67e22",
                  };

                  return (
                    <Grid item xs={3} key={index}>
                      <Paper
                        elevation={selectedColor === color ? 4 : 1}
                        sx={{
                          p: 1.5,
                          textAlign: "center",
                          cursor: "pointer",
                          borderRadius: 2,
                          border:
                            selectedColor === color
                              ? "2px solid #1976d2"
                              : "1px solid #e0e0e0",
                          backgroundColor:
                            selectedColor === color ? "#e3f2fd" : "white",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor:
                              selectedColor === color ? "#e3f2fd" : "#f5f5f5",
                          },
                        }}
                        onClick={() => setSelectedColor(color)}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            mx: "auto",
                            mb: 0.5,
                            borderRadius: "50%",
                            bgcolor: colorMap[color] || "#2072AF",
                            border: "1px solid #ddd",
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "0.7rem" }}
                        >
                          {color}
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            {/* اختيار المقاس */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1.5, fontWeight: "bold" }}
              >
                المقاس
              </Typography>
              <Grid container spacing={1}>
                {item.sizes?.map((size, index) => (
                  <Grid item xs={2} key={index}>
                    <Paper
                      elevation={selectedSize === size ? 4 : 1}
                      sx={{
                        p: 1.5,
                        textAlign: "center",
                        cursor: "pointer",
                        borderRadius: 2,
                        border:
                          selectedSize === size
                            ? "2px solid #1976d2"
                            : "1px solid #e0e0e0",
                        backgroundColor:
                          selectedSize === size ? "#e3f2fd" : "white",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor:
                            selectedSize === size ? "#e3f2fd" : "#f5f5f5",
                        },
                      }}
                      onClick={() => setSelectedSize(size)}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {size}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* عرض الاختيارات */}
            {(selectedColor || selectedSize) && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f8f9fa",
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                  الاختيارات:
                </Typography>
                <Stack direction="row" spacing={2}>
                  {selectedColor && (
                    <Chip
                      label={`اللون: ${selectedColor}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {selectedSize && (
                    <Chip
                      label={`المقاس: ${selectedSize}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setShowOptionsModal(false)}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2 }}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleConfirmAddToCart}
            variant="contained"
            disabled={!selectedColor || !selectedSize}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            أضف للسلة
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
