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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { ShoppingCartOutlined, ShoppingCart } from "@mui/icons-material";
import { useStore } from "../context/StoreContext";
import apiLink from "../../../apiLink";

const ProductDetails = () => {
  const { id } = useParams(); // هنا id = documentId
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
      try {
        const res = await fetch(
          `${apiLink}/products?filters[documentId][$eq]=${id}&populate=*`
        );
        const data = await res.json();

        if (data?.data?.length) {
          const p = data.data[0];

          const formatted = {
            id: p.documentId,
            name: p.name,
            description: p.description,
            price: p.price,
            final_price: p.final_price,
            available: p.product_variants?.some((v) => v.quantity > 0) || false,
            images:
              p.images && p.images.length > 0
                ? p.images.map((img) =>
                    img.formats?.medium?.url
                      ? img.formats.medium.url
                      : img.url
                      ? img.url
                      : "https://via.placeholder.com/500x500?text=No+Image"
                  )
                : ["https://via.placeholder.com/500x500?text=No+Image"],

            sizes: [
              ...new Set(p.product_variants?.map((v) => v.size) || []),
            ].map((s) => ({
              label: s,
              available: p.product_variants.some(
                (v) => v.size === s && v.quantity > 0
              ),
            })),
            colors: [
              ...new Set(p.product_variants?.map((v) => v.colorName) || []),
            ].map((c) => {
              const variant = p.product_variants.find((v) => v.colorName === c);
              return {
                label: c,
                hex: variant?.colorHex || variant?.colorCode || "#000", // لو عندك colorHex أو colorCode في البيانات
                available: variant?.quantity > 0,
              };
            }),
          };

          setProduct(formatted);
        } else {
          console.error("❌ No product found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
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
        name: product.name,
        description: product.description,
        price: product.price,
        final_price: product.final_price,
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
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!product)
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "gray",
        }}
      >
        المنتج غير موجود
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
      {/* صور المنتج */}
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

      {/* تفاصيل المنتج */}
      <Box sx={{ maxWidth: 500 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          {product.name}
        </Typography>

        <Typography color="text.secondary" mb={2}>
          {product.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary">
          <del>EGP {product.price}</del>
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
          EGP {product.final_price}
        </Typography>

        {/* المقاسات */}
        <Typography fontWeight="bold" mb={1}>
          المقاس
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
          {product.sizes.map((s) => (
            <Button
              key={s.label}
              onClick={() => s.available && setSize(s.label)}
              disabled={!s.available}
              sx={{
                minWidth: 50,
                borderRadius: 2,
                fontWeight: "bold",
                border: "2px solid #000",
                color: s.available
                  ? size === s.label
                    ? "#fff"
                    : "#000"
                  : "#999",
                backgroundColor: size === s.label ? "#000" : "#fff",
                "&:hover": {
                  backgroundColor: s.available ? "#000" : "#f0f0f0",
                  color: "#fff",
                },
              }}
            >
              {s.label}
            </Button>
          ))}
        </Box>

        {/* الألوان */}
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

      {/* التنبيه */}
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
