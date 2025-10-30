import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Stack,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Chip,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import {
  CreditCard,
  AccountBalance,
  LocalShipping,
  CheckCircle,
  ArrowBack,
  Payment,
  Security,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import apiLink from "../../../apiLink";

const Checkout = () => {
  const navigate = useNavigate();
  const { updateCounts } = useStore();

  const [cart, setCart] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  // بيانات العميل
  const [customerData, setCustomerData] = useState({
    fullName: "",
    phone: "",
    secondaryPhone: "",
    city: "",
    detailedAddress: "",
  });

  // بيانات الدفع
  const [paymentData, setPaymentData] = useState({
    method: "vodafone",
    transferImage: null,
  });

  // قائمة المحافظات المصرية
  const egyptianGovernorates = [
    "القاهرة",
    "الجيزة",
    "الإسكندرية",
    "البحيرة",
    "كفر الشيخ",
    "الغربية",
    "المنوفية",
    "الدقهلية",
    "الشرقية",
    "القليوبية",
    "بورسعيد",
    "الإسماعيلية",
    "السويس",
    "دمياط",
    "الفيوم",
    "بني سويف",
    "المنيا",
    "أسيوط",
    "سوهاج",
    "قنا",
    "الأقصر",
    "أسوان",
    "البحر الأحمر",
    "الوادي الجديد",
    "مطروح",
    "شمال سيناء",
    "جنوب سيناء",
  ];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);

    if (saved.length === 0) {
      navigate("/cart");
    }
  }, [navigate]);

  const steps = ["معلومات العميل", "طريقة الدفع", "تأكيد الطلب"];

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.final_price || 0) * (item.quantity || 1),
    0
  );

  // حساب تكلفة الشحن حسب المدينة
  const getShippingCost = () => {
    const city = customerData.city?.toLowerCase();

    if (city === "سوهاج") {
      return 40; // سوهاج 40 جنيه
    }

    // أسعار المحافظات الأخرى
    const cityPrices = {
      القاهرة: 100,
      الجيزة: 100,
      الإسكندرية: 115,
      البحيرة: 130,
      "كفر الشيخ": 130,
      الغربية: 130,
      المنوفية: 130,
      الدقهلية: 130,
      الشرقية: 130,
      القليوبية: 110,
      بورسعيد: 130,
      الإسماعيلية: 130,
      السويس: 130,
      دمياط: 130,
      الفيوم: 95,
      "بني سويف": 100,
      المنيا: 95,
      أسيوط: 90,
      قنا: 90,
      الأقصر: 95,
      أسوان: 90,
      "البحر الأحمر": 200,
      "الوادي الجديد": 200,
      مطروح: 200,
      "شمال سيناء": 200,
      "جنوب سيناء": 90,
    };

    return cityPrices[city] || 50; // سعر افتراضي 50 جنيه للمحافظات غير المحددة
  };

  const shippingCost = getShippingCost();
  const tax = 0; // بدون ضريبة
  const finalTotal = totalPrice + shippingCost + tax;

  const handleInputChange = (field, value) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
  };

  // التحقق من صحة رقم الهاتف المصري
  const validateEgyptianPhone = (phone) => {
    // إزالة جميع المسافات والشرطات
    const cleanPhone = phone.replace(/[\s-]/g, "");

    // التحقق من أن الرقم يبدأ بـ 01 ويحتوي على 11 رقم
    const egyptianPhoneRegex = /^01[0-9]{9}$/;

    return egyptianPhoneRegex.test(cleanPhone);
  };

  // تنسيق رقم الهاتف أثناء الكتابة
  const formatPhoneNumber = (value) => {
    // إزالة جميع الأحرف غير الرقمية
    const numbers = value.replace(/\D/g, "");

    // الحد الأقصى 11 رقم
    const limitedNumbers = numbers.slice(0, 11);

    // تنسيق الرقم مع إضافة شرطات
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(
        3,
        7
      )}-${limitedNumbers.slice(7)}`;
    }
  };

  const handlePaymentChange = (field, value) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // التحقق من بيانات العميل
      const required = ["fullName", "phone", "city", "detailedAddress"];
      const missing = required.filter((field) => !customerData[field]);

      if (missing.length > 0) {
        setMessage("يرجى ملء جميع الحقول المطلوبة");
        setSeverity("error");
        setOpen(true);
        return;
      }

      // التحقق من صحة رقم الهاتف
      if (!validateEgyptianPhone(customerData.phone)) {
        setMessage("يرجى إدخال رقم هاتف مصري صحيح (11 رقم يبدأ بـ 01)");
        setSeverity("error");
        setOpen(true);
        return;
      }

      // التحقق من رقم الهاتف الثانوي إذا تم إدخاله
      if (
        customerData.secondaryPhone &&
        !validateEgyptianPhone(customerData.secondaryPhone)
      ) {
        setMessage("يرجى إدخال رقم هاتف ثانوي صحيح (11 رقم يبدأ بـ 01)");
        setSeverity("error");
        setOpen(true);
        return;
      }
    }

    if (activeStep === 1) {
      // التحقق من بيانات الدفع
      if (
        paymentData.method === "vodafone" ||
        paymentData.method === "instapay"
      ) {
        if (!paymentData.transferImage) {
          setMessage("يرجى رفع صورة التحويل");
          setSeverity("error");
          setOpen(true);
          return;
        }
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCompleteOrder = () => {
    setLoading(true);

    // 🔹 دالة رفع الصورة على Cloudinary
    const uploadImage = () => {
      return new Promise((resolve, reject) => {
        if (!paymentData.transferImage) return resolve(null);

        const formData = new FormData();
        formData.append("file", paymentData.transferImage);
        formData.append("upload_preset", "unsigned_preset");

        fetch("https://api.cloudinary.com/v1_1/dauag2aqm/image/upload", {
          method: "POST",
          body: formData,
        })
          .then((res) => {
            if (!res.ok) throw new Error("فشل في رفع الصورة");
            return res.json();
          })
          .then((data) => resolve(data.secure_url))
          .catch((err) => reject(err));
      });
    };

    uploadImage()
      .then((uploadedUrl) => {
        // 🔹 إنشاء الـ Order الرئيسي
        return fetch(`${apiLink}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              client_name: customerData.fullName || "",
              phone_number: customerData.phone || "",
              second_number: customerData.secondaryPhone || "",
              full_address: `${customerData.city || ""}, ${
                customerData.detailedAddress || ""
              }`,
              total_price: parseFloat(finalTotal) || 0,
              order_status: "pending",
              payment_method:
                paymentData.method === "cod"
                  ? "Cash_On_delivery"
                  : paymentData.method === "vodafone"
                  ? "E-wallet"
                  : paymentData.method === "instapay"
                  ? "instapay"
                  : "Cash_On_delivery",
              proofImage_Link: uploadedUrl || null,
            },
          }),
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((orderData) => {
        if (!orderData?.data?.id)
          throw new Error("Response doesn't contain order ID");

        const orderId = orderData.data.id;

        // 🔹 إنشاء كل عناصر الـ Order وربطهم بالـ Order الجديد
        const itemRequests = cart.map((item) => {
          const bodyPayload = {
            data: {
              orders: [orderId],
              product_name: item.name,
              product_color: item.selectedColor || null,
              product_size: item.selectedSize || null,
              price: item.price,
              discount: item.discount || 0,
              final_price: item.final_price,
              quantity: item.quantity,
              total_price: item.final_price * item.quantity,
            },
          };

          console.log("🧾 Order-item payload:", bodyPayload);

          return fetch(`${apiLink}/order-items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyPayload),
          });
        });

        return Promise.all(itemRequests);
      })
      .then(() => {
        setMessage("✅ تم إرسال الطلب بنجاح!");
        setSeverity("success");
        setOpen(true);
        localStorage.removeItem("cart");
        updateCounts();
        setTimeout(() => navigate("/"), 2000);
      })
      .catch((error) => {
        console.error("❌ Error:", error);
        setMessage("حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
        setSeverity("error");
        setOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const renderCustomerForm = () => (
    <Paper
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        mb: 3,
        borderRadius: "20px 1px",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          fontWeight: "bold",
          color: "#2c3e50",
          textAlign: "center",
        }}
      >
        <CreditCard color="primary" sx={{ fontSize: 28 }} />
        معلومات العميل
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="الاسم بالكامل"
            value={customerData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            required
            placeholder="مثال: عمر محمود سيد عبدالسلام"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="رقم الهاتف للتواصل"
            value={customerData.phone}
            onChange={(e) =>
              handleInputChange("phone", formatPhoneNumber(e.target.value))
            }
            required
            placeholder="مثال: 010-1234-5678"
            inputProps={{ maxLength: 13 }}
            helperText="رقم هاتف مصري (11 رقم يبدأ بـ 01)"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
              "& .MuiFormHelperText-root": {
                fontSize: { xs: "0.75rem", sm: "0.8rem" },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="رقم هاتف ثانوي (اختياري)"
            value={customerData.secondaryPhone}
            onChange={(e) =>
              handleInputChange(
                "secondaryPhone",
                formatPhoneNumber(e.target.value)
              )
            }
            placeholder="مثال: 012-3456-7890"
            inputProps={{ maxLength: 13 }}
            helperText="رقم هاتف مصري (11 رقم يبدأ بـ 01)"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
              "& .MuiFormHelperText-root": {
                fontSize: { xs: "0.75rem", sm: "0.8rem" },
              },
            }}
          />
        </Grid>

        <Grid item xs={6} sm={6}>
          <FormControl fullWidth required>
            <InputLabel sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              المحافظة
            </InputLabel>

            <Select
              value={customerData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              label="المحافظة"
              placeholder=" المحافظة"
              sx={{
                borderRadius: 3,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                "& .MuiSelect-select": {
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                },
              }}
            >
              {egyptianGovernorates.map((governorate) => (
                <MenuItem
                  key={governorate}
                  value={governorate}
                  sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                >
                  {governorate}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="المكان بالتفصيل"
            multiline
            rows={3}
            value={customerData.detailedAddress}
            onChange={(e) =>
              handleInputChange("detailedAddress", e.target.value)
            }
            required
            placeholder="مثال: شارع النيل، بجوار مسجد السلام، عمارة رقم 15، الدور الثالث، شقة 301"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPaymentData((prev) => ({ ...prev, transferImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPaymentForm = () => (
    <Paper
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        mb: 3,
        borderRadius: "20px 1px",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          fontWeight: "bold",
          color: "#2c3e50",
          textAlign: "center",
        }}
      >
        <Payment color="primary" sx={{ fontSize: 28 }} />
        طريقة الدفع
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 4 }}>
        <FormLabel
          component="legend"
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem" },
            fontWeight: "bold",
            color: "#2c3e50",
            mb: 2,
          }}
        >
          اختر طريقة الدفع
        </FormLabel>
        <RadioGroup
          value={paymentData.method}
          onChange={(e) => handlePaymentChange("method", e.target.value)}
          sx={{ gap: 2 }}
        >
          <FormControlLabel
            value="vodafone"
            control={<Radio color="primary" />}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 3,
                  border:
                    paymentData.method === "vodafone"
                      ? "2px solid #e60012"
                      : "2px solid #e0e0e0",
                  backgroundColor:
                    paymentData.method === "vodafone" ? "#fff5f5" : "#f8f9fa",
                  transition: "all 0.3s ease",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#e60012",
                    fontSize: { xs: "1.2rem", sm: "1.4rem" },
                  }}
                >
                  V
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: "bold",
                  }}
                >
                  فودفون كاش - 01099653935
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="instapay"
            control={<Radio color="primary" />}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 3,
                  border:
                    paymentData.method === "instapay"
                      ? "2px solid #00a651"
                      : "2px solid #e0e0e0",
                  backgroundColor:
                    paymentData.method === "instapay" ? "#f0fff4" : "#f8f9fa",
                  transition: "all 0.3s ease",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#00a651",
                    fontSize: { xs: "1.2rem", sm: "1.4rem" },
                  }}
                >
                  I
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: "bold",
                  }}
                >
                  انستا باي - 01280538625
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="cod"
            control={<Radio color="primary" />}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 3,
                  border:
                    paymentData.method === "cod"
                      ? "2px solid #1976d2"
                      : "2px solid #e0e0e0",
                  backgroundColor:
                    paymentData.method === "cod" ? "#e3f2fd" : "#f8f9fa",
                  transition: "all 0.3s ease",
                }}
              >
                <LocalShipping
                  sx={{ color: "#1976d2", fontSize: { xs: 20, sm: 24 } }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: "bold",
                  }}
                >
                  الدفع عند الاستلام
                </Typography>
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>

      {(paymentData.method === "vodafone" ||
        paymentData.method === "instapay") && (
        <Box
          sx={{
            mb: 4,
            p: { xs: 2, sm: 3 },
            bgcolor: "#f8f9fa",
            borderRadius: 3,
            border: "2px solid #e0e0e0",
            background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: "#1976d2",
              fontWeight: "bold",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              textAlign: "center",
            }}
          >
            تعليمات الدفع:
          </Typography>
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                fontWeight: "500",
              }}
            >
              1. قم بالتحويل إلى الرقم المحدد أعلاه
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                fontWeight: "500",
              }}
            >
              2. المبلغ المطلوب: <strong>{finalTotal} جنيه</strong>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                fontWeight: "500",
              }}
            >
              3. ارفع صورة التحويل في الحقل أدناه
            </Typography>
          </Stack>

          <input
            accept="image/*"
            style={{ display: "none" }}
            id="transfer-image"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="transfer-image">
            <Button
              variant="outlined"
              component="span"
              sx={{
                mb: 2,
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: "bold",
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  borderColor: "#1565c0",
                },
              }}
            >
              رفع صورة التحويل
            </Button>
          </label>

          {paymentData.transferImage && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  color: "green",
                  fontWeight: "bold",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                ✓ تم رفع صورة التحويل بنجاح
              </Typography>
              <img
                src={paymentData.transferImage}
                alt="صورة التحويل"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            </Box>
          )}
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      <Typography
        variant="h6"
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          fontWeight: "bold",
          color: "#2c3e50",
          fontSize: { xs: "1rem", sm: "1.1rem" },
        }}
      >
        <LocalShipping color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
        تكلفة الشحن
      </Typography>

      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: "#f8f9fa",
          borderRadius: 3,
          border: "2px solid #e0e0e0",
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderRadius: 2,
              bgcolor: customerData.city ? "#e3f2fd" : "#fff3e0",
              border: customerData.city
                ? "1px solid #1976d2"
                : "1px solid #ff9800",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              المدينة:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                color: customerData.city ? "#1976d2" : "#ff9800",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              {customerData.city || "يرجى اختيار المدينة أولاً"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderRadius: 2,
              bgcolor: customerData.city ? "#e8f5e8" : "#fff3e0",
              border: customerData.city
                ? "1px solid #4caf50"
                : "1px solid #ff9800",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              تكلفة الشحن:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                color: customerData.city ? "#4caf50" : "#ff9800",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              {customerData.city
                ? `${shippingCost} جنيه`
                : "سيتم حسابها بعد اختيار المدينة"}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              fontStyle: "italic",
            }}
          >
            {customerData.city === "سوهاج"
              ? "الشحن داخل سوهاج - 24-48 ساعة"
              : customerData.city
              ? "الشحن لباقي المحافظات - 3-5 أيام"
              : "يرجى اختيار المدينة لمعرفة تكلفة الشحن"}
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );

  const renderOrderSummary = () => (
    <Paper
      sx={{
        p: { xs: 2, sm: 3, md: 4 },

        top: 20,
        borderRadius: "20px 1px",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          fontWeight: "bold",
          color: "#2c3e50",
          textAlign: "center",
        }}
      >
        <CheckCircle color="primary" sx={{ fontSize: 28 }} />
        ملخص الطلب
      </Typography>

      <Stack spacing={3} sx={{ mb: 3 }}>
        {cart.map((item) => (
          <Box
            key={item.id}
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: 50,
                height: 50,
                borderRadius: 8,
                objectFit: "cover",
                padding: 1,
              }}
            />
            <Box sx={{flex: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" fontWeight="bold">
                {item.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                الكمية: {item.quantity}
              </Typography>
              {(item.selectedColor || item.selectedSize) && (
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  {item.selectedColor && (
                    <Chip
                      label={`اللون: ${item.selectedColor}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {item.selectedSize && (
                    <Chip
                      label={`المقاس: ${item.selectedSize}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Stack>
              )}
            </Box>
            
        
            <Typography fontWeight="bold"  >
              EGP {(item.final_price * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>المجموع الفرعي:</Typography>
          <Typography>EGP {totalPrice.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>الشحن:</Typography>
          <Typography>{shippingCost} EGP</Typography>
        </Box>
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            الإجمالي:
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {finalTotal} EGP
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );

  const renderConfirmation = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
      >
        <Security color="primary" />
        تأكيد الطلب
      </Typography>

      <Card sx={{ mb: 3, bgcolor: "#f8f9fa" }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <CheckCircle color="success" />
            بيانات العميل
          </Typography>
          <Typography>
            <strong>الاسم:</strong> {customerData.fullName}
          </Typography>
          <Typography>
            <strong>الهاتف:</strong> {customerData.phone}
          </Typography>
          {customerData.secondaryPhone && (
            <Typography>
              <strong>الهاتف الثانوي:</strong> {customerData.secondaryPhone}
            </Typography>
          )}
          <Typography>
            <strong>المدينة:</strong> {customerData.city}
          </Typography>
          <Typography>
            <strong>العنوان:</strong> {customerData.detailedAddress}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, bgcolor: "#f8f9fa" }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Payment color="primary" />
            طريقة الدفع
          </Typography>
          <Typography>
            <strong>الطريقة:</strong>{" "}
            {paymentData.method === "vodafone"
              ? "فودفون كاش - 01099653935"
              : paymentData.method === "instapay"
              ? "انستا باي - 01280538625"
              : "الدفع عند الاستلام"}
          </Typography>
          {(paymentData.method === "vodafone" ||
            paymentData.method === "instapay") && (
            <Typography>
              <strong>المبلغ:</strong> {finalTotal} جنيه
            </Typography>
          )}
          {paymentData.transferImage && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: "green", fontWeight: "bold" }}
              >
                ✓ تم رفع صورة التحويل
              </Typography>
              <img
                src={paymentData.transferImage}
                alt="صورة التحويل"
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: "#f8f9fa" }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <LocalShipping color="primary" />
            الشحن
          </Typography>
          <Typography>
            <strong>المدينة:</strong> {customerData.city}
          </Typography>
          <Typography>
            <strong>المدة:</strong>{" "}
            {customerData.city === "سوهاج" ? "24-48 ساعة" : "3-5 أيام"}
          </Typography>
          <Typography>
            <strong>التكلفة:</strong> {shippingCost} جنيه
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );

  if (cart.length === 0) {
    return null; // سيتم التوجه إلى السلة تلقائياً
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        background: "linear-gradient(135deg, #f5f5f5 0%, #e8f4f8 100%)",
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: { xs: 2, sm: 3 },
            borderRadius: "20px 1px",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <IconButton
            onClick={() => navigate("/cart")}
            sx={{
              bgcolor: "#e3f2fd",
              "&:hover": {
                bgcolor: "#bbdefb",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ArrowBack sx={{ color: "#1976d2" }} />
          </IconButton>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              color: "#2c3e50",
              textAlign: "center",
              flex: 1,
            }}
          >
            إتمام الطلب
          </Typography>
        </Box>

        {/* Stepper */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: "20px 1px",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              "& .MuiStepLabel-label": {
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                fontWeight: "bold",
              },
              "& .MuiStepLabel-label.Mui-active": {
                color: "#1976d2",
                fontWeight: "bold",
              },
              "& .MuiStepLabel-label.Mui-completed": {
                color: "#4caf50",
                fontWeight: "bold",
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            {activeStep === 0 && renderCustomerForm()}
            {activeStep === 1 && renderPaymentForm()}
            {activeStep === 2 && renderConfirmation()}

            {/* Navigation Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  fontWeight: "bold",
                  minWidth: { xs: "100%", sm: "120px" },
                }}
              >
                السابق
              </Button>

              {activeStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: "bold",
                    minWidth: { xs: "100%", sm: "120px" },
                    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #1565c0, #1976d2)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(25, 118, 210, 0.4)",
                    },
                  }}
                >
                  التالي
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleCompleteOrder}
                  disabled={loading}
                  sx={{
                    mt: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: "bold",
                    borderRadius: 3,
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: "white",
                      }}
                    />
                  ) : (
                    "تأكيد الطلب"
                  )}
                </Button>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} lg={4}>
            {renderOrderSummary()}
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={3000}
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

export default Checkout;
