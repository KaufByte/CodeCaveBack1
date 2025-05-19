import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/LogoCC-removebg-preview.png";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSelector from "../components/LanguageSelector";
import { useTranslation } from "react-i18next";

const ForgotPasswordPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { t } = useTranslation("auth");
  const handleReset = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage("Password reset instructions have been sent to your email.");
      } else {
        setMessage("Email not found.");
      }
    } catch (error) {
      console.error("Reset error:", error);
      setMessage("Something went wrong. Try again later.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: isDarkMode ? "#0f0f0f" : "#fafafa",
        overflow: "hidden",
        position: "relative",
      }}
    >
    <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
      <LanguageSelector />
    </Box>
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? 250 : 300,
          height: isMobile ? 250 : 300,
          bgcolor: "#ff8c00",
          filter: "blur(150px)",
          opacity: 0.6,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? 250 : 400,
          height: isMobile ? 250 : 400,
          bgcolor: "#ffc107",
          filter: "blur(200px)",
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      {/* Логотип та тема */}
      <Box sx={{ textAlign: "center", mb: 3, zIndex: 1 }}>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: isMobile ? 260 : 400,
            height: "auto",
            mb: 1,
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body1"
            sx={{ color: isDarkMode ? "#ddd" : "#555", fontWeight: 500, fontSize: 20 }}
          >
            {t("switchMode")}
          </Typography>
          <ThemeToggle />
        </Box>
      </Box>
      <Box
        sx={{
          width: isMobile ? "85%" : 340,
          p: 4,
          borderRadius: 4,
          bgcolor: isDarkMode ? "rgba(30,30,30,0.7)" : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(15px)",
          boxShadow: isDarkMode
            ? "0 8px 32px rgba(0,0,0,0.7)"
            : "0 8px 32px rgba(0,0,0,0.15)",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 3, color: isDarkMode ? "#fff" : "#000" }}
        >
          {t("forgotPassword")}
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          sx={{ mb: 3, color: isDarkMode ? "#ccc" : "#555" }}
        >
          {t("passwordResetInstruction")}
        </Typography>

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleReset}
          sx={{
            py: 1,
            fontWeight: "bold",
            borderRadius: 3,
            background: "linear-gradient(145deg, #ff9800, #ffc107)",
            boxShadow: "0 4px 10px rgba(255,152,0,0.3)",
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: "0 6px 15px rgba(255,152,0,0.5)",
            },
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          {t("sendResetLink")}
        </Button>

        {message && (
          <Typography
            variant="body2"
            sx={{ mt: 2, color: isDarkMode ? "#fff" : "#000", textAlign: "center" }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;

