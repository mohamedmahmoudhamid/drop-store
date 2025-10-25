import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { ShoppingCartOutlined, ShoppingCart, Favorite, FavoriteBorder } from "@mui/icons-material";
import img1 from "../../../assets/img.jpg";
import img2 from "../../../assets/logo.jpg";
import { useStore } from "../context/StoreContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [inCart, setInCart] = useState(false);

  const { updateCounts } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      const data = {
        id,
        title: "Hoodie",
        description: "High-quality cotton hoodie. Soft and durable.",
        oldPrice: 150,
        newPrice: 100,
        available: true,
        images: [img1, img2, img1],
        sizes: [
          { label: "M", available: true },
          { label: "L", available: true },
          { label: "XL", available: false },
          { label: "XXL", available: true },
        ],
        colors: [
          { label: "Black", hex: "#000", available: true },
          { label: "White", hex: "#fff", available: true },
          { label: "Gray", hex: "#808080", available: false },
        ],
      };
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
     setInCart(cart.some((i) => i.id === product.id));
      
    }
  }, [product]);

  const handleCartToggle = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let updated;
    if (inCart) {
      updated = cart.filter((i) => i.id !== product.id);
      setMessage("تمت الإزالة من السلة");
      setSeverity("error");
      setInCart(false);
    } else {
      const newItem = {
        id: product.id,
        title: product.title,
        description: product.description,
        newPrice: product.newPrice,
        oldPrice: product.oldPrice,
        image: product.images[0],
        size,
        color,
        quantity: 1,
      };
      updated = [...cart, newItem];
      setMessage("تمت الإضافة إلى السلة");
      setSeverity("success");
      setInCart(true);
    }
    localStorage.setItem("cart", JSON.stringify(updated));
    updateCounts();
    setOpen(true);
  };

 

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  if (loading)
    return (
      <Box sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        p: 5,
        backgroundColor: "#fafafa",
        borderRadius: 3,
      }}
    >
      <Box sx={{ position: "relative", width: { xs: "100%", md: "40%" } }}>
        <Box
          component="img"
          src={product.images[currentIndex]}
          alt={product.title}
          sx={{
            width: "100%",
            height: 420,
            borderRadius: 3,
            objectFit: "cover",
            boxShadow: 3,
          }}
        />

        <Chip
          label={product.available ? "متاح" : "غير متاح"}
          color={product.available ? "success" : "error"}
          sx={{
            position: "absolute",
            top: 15,
            left: 15,
            fontWeight: "bold",
            borderRadius: 1.5,
          }}
        />

       
        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 10,
            backgroundColor: "rgba(0,0,0,0.4)",
            color: "#fff",
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: 10,
            backgroundColor: "rgba(0,0,0,0.4)",
            color: "#fff",
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      <Box sx={{ maxWidth: 500 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          {product.title}
        </Typography>

        <Typography color="text.secondary" mb={2}>
          {product.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary">
          <del>${product.oldPrice}</del>
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
          ${product.newPrice}
        </Typography>

        <Typography fontWeight="bold" mb={1}>
          المقاس
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
          {product.sizes.map((s) => (
            <Button
              key={s.label}
              variant={size === s.label ? "contained" : "outlined"}
              onClick={() => s.available && setSize(s.label)}
              disabled={!s.available}
              sx={{
                minWidth: 50,
                borderRadius: 2,
                color: s.available ? "#000" : "#999",
                backgroundColor: size === s.label ? "#000" : "#fff",
                "&:hover": { backgroundColor: s.available ? "#000" : "#f0f0f0", color: "#fff" },
              }}
            >
              {s.label}
            </Button>
          ))}
        </Box>

        <Typography fontWeight="bold" mb={1}>
          اللون
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, mb: 4 }}>
          {product.colors.map((c) => (
            <Box
              key={c.label}
              onClick={() => c.available && setColor(c.label)}
              sx={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                backgroundColor: c.hex,
                border: color === c.label ? "3px solid #000" : "2px solid #ccc",
                opacity: c.available ? 1 : 0.4,
                cursor: c.available ? "pointer" : "not-allowed",
              }}
            />
          ))}
        </Box>

        <Button
          variant={inCart ? "outlined" : "contained"}
          color={inCart ? "error" : "primary"}
          startIcon={inCart ? <ShoppingCart /> : <ShoppingCartOutlined />}
          onClick={handleCartToggle}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          {inCart ? "إزالة من السلة" : "أضف إلى السلة"}
        </Button>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={severity}
          variant="filled"
          onClose={() => setOpen(false)}
          sx={{ width: "100%", borderRadius: 2, fontWeight: "bold" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails;
