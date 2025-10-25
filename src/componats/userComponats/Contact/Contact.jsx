import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [alertMsg, setAlertMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setSeverity("error");
      setAlertMsg("يرجى ملء جميع الحقول");
      setOpen(true);
      return;
    }

    setSeverity("success");
    setAlertMsg("شكرا لمراسلتك، سوف نتواصل معك في أقرب وقت");
    setOpen(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Box
      sx={{
    
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
   
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 1,
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          color: "#1137d0ff",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            textAlign="center"
            mb={3}
            fontWeight="bold"
            sx={{ color: "#b52525ff" }}
          >
            تواصل معنا
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="الاسم"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#2072AF" } }}
              InputProps={{
                style: { color: "#3587c2072AF", borderColor: "#F0F8FF" },
              }}
            />
            <TextField
              label="البريد الإلكتروني"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#2072AF" } }}
              InputProps={{
                style: { color: "#2072AF", borderColor: "#2072AF" },
              }}
            />
            <TextField
              label="الرسالة"
              name="message"
              value={formData.message}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#2072AF" } }}
              InputProps={{
                style: { color: "#2072AF", borderColor: "#2072AF" },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                borderRadius: 4,
                p: 1.5,
                fontSize: "1rem",
                background: "#2072AF",
                "&:hover": {
                  background: "#2072AF",
                },
              }}
            >
              إرسال الرسالة
            </Button>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={open}
        autoHideDuration={2500}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
