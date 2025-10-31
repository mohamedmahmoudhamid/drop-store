import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./productcard.css";
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
  BorderStyle,
} from "@mui/icons-material";
import { useStore } from "../context/StoreContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { updateCounts } = useStore();
  const item = product;

  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const inFav = favorites.some((fav) => fav.id === item.id);
    const inCartItem = cart.find((c) => c.id === item.id);

    setIsFavorite(inFav);
    setInCart(!!inCartItem);

    if (inCartItem) {
      setSelectedColor(inCartItem.selectedColor || "");
      setSelectedSize(inCartItem.selectedSize || "");
    } else {
      setSelectedColor("");
      setSelectedSize("");
    }
  }, [item.id]);

  const handleAddToCart = (item) => {
    if (inCart) {
      // إزالة من السلة ومسح الاختيارات المخزنة لهذا المنتج
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const updated = cart.filter((p) => p.id !== item.id);
      localStorage.setItem("cart", JSON.stringify(updated));
      setMessage("تمت الإزالة من السلة");
      setInCart(false);
      setSelectedColor("");
      setSelectedSize("");
      setSeverity("error");
      updateCounts();
      setOpen(true);
    } else {
      // افتح المودال للاختيار
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

    // لو المنتج موجود بالفعل حدث اختياراته بدل ما تضيف نسخة جديدة
    const existingIndex = cart.findIndex((c) => c.id === item.id);

    const cartItem = {
      ...item,
      quantity: 1,
      selectedColor,
      selectedSize,
    };

    let updated;
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex] = cartItem;
    } else {
      updated = [...cart, cartItem];
    }

    localStorage.setItem("cart", JSON.stringify(updated));

    // // حفظ اختيارات اللون والمقاس للمنتج في localStorage منفصل
    const productSelections =
      JSON.parse(localStorage.getItem("productSelections")) || {};
    productSelections[item.id] = {
      selectedColor,
      selectedSize,
    };
    localStorage.setItem(
      "productSelections",
      JSON.stringify(productSelections)
    );
    

    
    setMessage("تمت الإضافة إلى السلة");
    setInCart(true);
    setSeverity("success");
    setShowOptionsModal(false);
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
      <div>
       <Card
  sx={{
    borderStyle: "none",
    borderRadius: "33px 5px 18px 5px",
    p: { xs: 0.5, sm: 0.5, md: 0 },
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    position: "relative",
    background: "linear-gradient(to bottom right,#ffffff,#f7f8fa,#f2f4f8)",
    width: "100%",
    maxWidth: "none",
    height: 350,
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    },
  }}
>
  <Chip
    label={item.available ? "متاح" : "غير متاح"}
    color={item.available ? "success" : "error"}
    sx={{
      position: "absolute",
      top: { xs: 8, sm: 12 },
      left: { xs: 8, sm: 12 },
      fontWeight: "bold",
      fontSize: { xs: "0.65rem", sm: "0.8rem" },
      zIndex: 2,
      height: { xs: 20, sm: 24 },
    }}
  />

  <Tooltip title={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}>
    <IconButton
      onClick={() => handleToggleFavorite(item)}
      sx={{
        position: "absolute",
        top: { xs: 8, sm: 12 },
        right: { xs: 8, sm: 12 },
        backgroundColor: "rgba(255, 255, 255, 0.49)",
        "&:hover": { backgroundColor: "#fff" },
        zIndex: 2,
        width: { xs: 32, sm: 40 },
        height: { xs: 32, sm: 40 },
      }}
    >
      {isFavorite ? (
        <Favorite sx={{ color: "#e53935", fontSize: { xs: 20, sm: 26 } }} />
      ) : (
        <FavoriteBorder sx={{ color: "#444", fontSize: { xs: 20, sm: 26 } }} />
      )}
    </IconButton>
  </Tooltip>

  <Box
    sx={{
      position: "relative",
      overflow: "hidden",
      borderRadius: "8px 8px 0 0",
      flexShrink: 0,
      backgroundColor: "#f5f5f5",
      width: "100%",
      height: 160,
    }}
  >
    {/* skeleton placeholder */}
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#eee",
        animation: "pulse 1.4s infinite ease-in-out",
        "@keyframes pulse": {
          "0%": { opacity: 0.8 },
          "50%": { opacity: 0.5 },
          "100%": { opacity: 0.8 },
        },
      }}
    />

    <CardMedia
      component="img"
      src={item.image}
      alt={item.name}
      decoding="async"
          loading="lazy"
          fetchpriority="high"
      onClick={() => navigate(`/product/${item.id}`)}
      sx={{
        width: "100%",
        height: 180,
        objectFit: "cover",
        borderBottom: "1px solid #eee",
      borderRadius: "8px 8px 0 0",
        cursor: "pointer",
        "&:hover": { transform: "scale(1.03)" },
        backgroundColor: "#f5f5f5",
      }}
      onLoad={(e) => {
        e.target.style.opacity = 1;
        e.target.previousSibling.style.display = "none";
      }}
    />
  </Box>

  <CardContent
    sx={{
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      p: { xs: 1.5, sm: 2 },
    }}
  >
    <Typography
      variant="h6"
      fontWeight="bold"
      sx={{
        mb: 0.5,
        textTransform: "capitalize",
        color: "#222",
        fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.25rem" },
        lineHeight: 1.2,
      }}
      noWrap
    >
      {item.name}
    </Typography>

    {/* <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        height: { xs: 32, sm: 36, md: 40 },
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
        lineHeight: 1.3,
      }}
    >
      {item.description}
    </Typography> */}

    <Divider />

    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={1}
    >
      {item.discount > 0 && (
        <>
          <Typography
            variant="h6"
            sx={{
              textDecoration: "line-through",
              color: "#999",
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
            }}
          >
            EGP {item.price}
          </Typography>
          <Chip
           label={`Sale ${item.discount}%`}

            color="success"
            size="small"
            sx={{
              fontWeight: "bold",
              px: 1,
              fontSize: { xs: "0.65rem", sm: "0.75rem" },
              height: { xs: 20, sm: 24 },
            }}
          />
        </>
      )}

      <Typography
        fontWeight="bold"
        color="primary"
        sx={{
          fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.25rem" },
        }}
      >
        EGP {item.final_price}
      </Typography>
    </Stack>

    <Button
      fullWidth
      variant={inCart ? "outlined" : "contained"}
      color={inCart ? "error" : "primary"}
      startIcon={inCart ? <ShoppingCart /> : <ShoppingCartOutlined />}
      onClick={() => handleAddToCart(item)}
      disabled={!item.available}
      sx={{
        mt: "auto",
        borderRadius: 3,
        py: { xs: 0.8, sm: 1 },
        fontWeight: "bold",
        textTransform: "none",
        fontSize: { xs: "0.75rem", sm: "0.875rem" },
        minHeight: { xs: 36, sm: 40 },
      }}
    >
      {inCart ? "إزالة من السلة" : "أضف للسلة"}
    </Button>
  </CardContent>
</Card>

      </div>

      {/* Snackbar */}
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
            {/* الألوان */}
            {item.product_variants?.some((v) => v.quantity > 0) && (
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1.5, fontWeight: "bold" }}
                >
                  اللون
                </Typography>
                <Grid container spacing={1}>
                  {[
                    ...new Set(
                      item.product_variants
                        .filter((v) => v.quantity > 0)
                        .map((v) => v.colorName)
                    ),
                  ].map((color, index) => (
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
                        }}
                        onClick={() => setSelectedColor(color)}
                      >
                        <Typography variant="caption">{color}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* المقاسات */}
            {item.product_variants?.some((v) => v.quantity > 0) && (
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1.5, fontWeight: "bold" }}
                >
                  المقاس
                </Typography>
                <Grid container spacing={1}>
                  {[
                    ...new Set(
                      item.product_variants
                        .filter(
                          (v) =>
                            v.quantity > 0 &&
                            (!selectedColor || v.colorName === selectedColor)
                        )
                        .map((v) => v.size)
                    ),
                  ].map((size, index) => (
                    <Grid item xs={3} key={index}>
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
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setShowOptionsModal(false)}
            variant="outlined"
            size="small"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleConfirmAddToCart}
            variant="contained"
            disabled={!selectedColor || !selectedSize}
            size="small"
          >
            أضف للسلة
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
