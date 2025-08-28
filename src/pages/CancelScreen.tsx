// src/pages/CancelScreen.tsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";

const CancelScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fff7f7",
        px: 2,
        width:"100vw"
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
          width: "100vw",
        }}
      >
        <CancelIcon sx={{ fontSize: 64, color: "#f44336", mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Відміна оплати 
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          Ви можете повторити в інший час.
        </Typography>
        <Button variant="outlined" fullWidth onClick={() => navigate("/subscriptions")}>
          Повернутися до підписок
        </Button>
      </Box>
    </Box>
  );
};

export default CancelScreen;
