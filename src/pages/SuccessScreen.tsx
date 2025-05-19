import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SuccessScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("success");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
          p: 4,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 64, color: "#4caf50", mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {t("successTitle")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          {t("successMessage")}
        </Typography>
        <Button variant="contained" fullWidth onClick={() => navigate("/")}>
          {t("return")}
        </Button>
      </Box>
    </Box>
  );
};

export default SuccessScreen;
