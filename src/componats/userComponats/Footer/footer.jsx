import React from "react";
import { Box, Typography, IconButton, Link } from "@mui/material";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 5,
        py: 5,
        px: { xs: 2, sm: 6 },
        backgroundColor: "#2072AF",
        color: "#F0F8FF",
        textAlign: "center",
        borderRadius:2,
       
      }}
    >
     
      <Box mb={3}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Drop Store
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Best place to shop online. Quality products at fair prices.
        </Typography>
      </Box>

      {/* Social Icons */}
      <Box mb={3} display="flex" justifyContent="center" gap={2}>
        <IconButton
          component="a"
          href="https://www.facebook.com/share/1ACsxeHcCr/?mibextid=wwXIfr"
          target="_blank"
          color="inherit"
          sx={{ "&:hover": { color: "#F0F8FF" } }}
        >
          <FaFacebook />
        </IconButton>
        <IconButton
          component="a"
          href="https://www.instagram.com/drop.store.1?igsh=MTZ1bDJxemloa3ZhMw=="
          target="_blank"
          color="inherit"
          sx={{ "&:hover": { color: "#F0F8FF" } }}
        >
          <FaInstagram />
        </IconButton>
        <IconButton
          component="a"
          href="https://www.tiktok.com/@drop_store_1?_t=ZS-90k9dO1Fahr&_r=1"
          target="_blank"
          color="inherit"
          sx={{ "&:hover": { color: "#F0F8FF" } }}
        >
          <FaTiktok />
        </IconButton>
      </Box>

  
     

     
      <Box
        sx={{
          textAlign: "center",
          mt: 3,
          borderTop: "1px solid rgba(255,255,255,0.2)",
          pt: 3,
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          ©2025 Drop Store. All rights reserved.
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
          mt={2}
        >
        
          <Typography
            variant="body2"
            sx={{
              color: "#F0F8FF",
              fontWeight: 500,
              fontSize: "0.9rem",
            }}
          >
            Website Design by :
         <br />
            <Link
              href="https://wa.me/201280538625"
              target="_blank"
              rel="noopener"
              underline="none"
              sx={{
                color: "#F0F8FF",
                fontWeight: 600,
                ml: 0.5,
                "&:hover": { textDecoration: "underline" },
              }}
            >
             {"< Mohamed Mahmoud />"}
            </Link>
         <br />
            <Link
              href="https://wa.me/201120203912"
              target="_blank"
              rel="noopener"
              underline="none"
              sx={{
                color: "#F0F8FF",
                fontWeight: 600,
                ml: 0.5,
                "&:hover": { textDecoration: "underline" },
              }}
            >
             {"< MohamedA.Elhameid />"}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;


