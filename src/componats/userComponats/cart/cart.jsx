import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Snackbar,
  Alert,
  TextField,
  Stack,
  Paper,
  Chip,
} from "@mui/material";
import {
  Delete,
  Add,
  RemoveShoppingCart,
  Remove,
  ShoppingCartCheckout,
  CheckCircle,
  ErrorOutline,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const { updateCounts } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  }, []);

  const updateLocalStorage = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    updateCounts();
  };

  const handleIncrease = (id) => {
    const updated = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );
    updateLocalStorage(updated);
  };

  const handleDecrease = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id && (item.quantity || 1) > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity !== 0);
    updateLocalStorage(updated);
  };

  const handleRemove = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    updateLocalStorage(updated);
    setMessage("تم حذف المنتج من السلة");
    setSeverity("error");
    setOpen(true);
  };

  const handleClearAll = () => {
    updateLocalStorage([]);
    setMessage("تم حذف جميع المنتجات");
    setSeverity("error");
    setOpen(true);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.final_price || 0) * (item.quantity || 1),
    0
  );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 6 },
        minHeight: "80vh",
        backgroundColor: "#f9fafb",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        textAlign="center"
        sx={{ color: "#333" }}
      >
        سلة المشتريات
      </Typography>

      {cart.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 10, color: "text.secondary" }}>
          <RemoveShoppingCart sx={{ fontSize: 80, color: "#ccc" }} />
          <Typography variant="h6" mt={2}>
            السلة فارغة
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/"
            sx={{
              mt: 3,
              borderRadius: "30px",
              px: 4,
              backgroundColor: "#111",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            تسوق الآن
          </Button>
        </Box>
      ) : (
        <>
          {cart.map((item) => (
            <Paper
              key={item.id}
              elevation={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 3,
                mb: 2,
                borderRadius: 4,
                flexWrap: "wrap",
                backgroundColor: "#fff",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <img
                 onClick={() => navigate(`/product/${item.id}`)}
                  src={item.image}
                  alt={item.title}
                  width="80"
                  height="80"
                  style={{ borderRadius: 10, objectFit: "cover" }}
                />
                <Box>
                  <Typography fontWeight="bold">{item.name}</Typography>
                  <Typography color="text.secondary" fontSize={14} mb={1}>
                    EGP {item.final_price}
                  </Typography>

                  {/* تفاصيل المنتج */}
                  <Typography fontSize={13} color="text.secondary">
                    {item.description || "لا توجد تفاصيل متاحة"}
                  </Typography>

                  {/* عرض اللون والمقاس المختار */}
                  {(item.selectedColor || item.selectedSize) && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {item.selectedColor && (
                        <Chip 
                          label={`اللون: ${item.selectedColor}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ fontSize: "0.7rem", height: 20 }}
                        />
                      )}
                      {item.selectedSize && (
                        <Chip 
                          label={`المقاس: ${item.selectedSize}`} 
                          size="small" 
                          color="secondary" 
                          variant="outlined"
                          sx={{ fontSize: "0.7rem", height: 20 }}
                        />
                      )}
                    </Stack>
                  )}

                 
                </Box>
              </Stack>

              {/* التحكم في الكمية */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  mt: { xs: 2, md: 0 },
                  backgroundColor: "#f1f1f1",
                  borderRadius: 3,
                  px: 1,
                  py: 0.5,
                }}
              >
                <IconButton
                  onClick={() => handleDecrease(item.id)}
                  sx={{
                    backgroundColor: "#fff",
                    "&:hover": { backgroundColor: "#e0e0e0" },
                    border: "1px solid #ccc",
                  }}
                >
                  <Remove fontSize="small" />
                </IconButton>

                <Typography
                  sx={{ width: 40, textAlign: "center", fontWeight: "bold" }}
                >
                  {item.quantity || 1}
                </Typography>

                <IconButton
                  onClick={() => handleIncrease(item.id)}
                  sx={{
                    backgroundColor: "#fff",
                    "&:hover": { backgroundColor: "#e0e0e0" },
                    border: "1px solid #ccc",
                  }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Stack>

              <Typography fontWeight="bold" sx={{ minWidth: 80 }}>
                EGP {(item.final_price * (item.quantity || 1)).toFixed(2)}
              </Typography>

              <IconButton
                color="error"
                onClick={() => handleRemove(item.id)}
                sx={{ "&:hover": { backgroundColor: "#ffe5e5" } }}
              >
                <Delete />
              </IconButton>
            </Paper>
          ))}

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              color="error"
              variant="outlined"
              startIcon={<Delete />}
              onClick={handleClearAll}
              sx={{
                borderRadius: "30px",
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
              }}
            >
              حذف الكل
            </Button>

            <Box textAlign="right">
              <Typography fontWeight="bold" fontSize={18}>
                EGP الإجمالي:  {totalPrice.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ShoppingCartCheckout />}
                onClick={handleCheckout}
                sx={{
                  mt: 1,
                  borderRadius: "30px",
                  textTransform: "none",
                  px: 4,
                  fontWeight: "bold",
                }}
              >
                الدفع الآن
              </Button>
            </Box>
          </Box>
        </>
      )}

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

export default Cart;
