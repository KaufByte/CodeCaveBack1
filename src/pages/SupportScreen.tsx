import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";

const SupportScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation("support");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const faqItems = [
    {
      question: t("faq.q1"),
      answer: t("faq.a1"),
    },
    {
      question: t("faq.q2"),
      answer: t("faq.a2"),
    },
    {
      question: t("faq.q3"),
      answer: t("faq.a3"),
    },
  ];

  const handleSubmit = async () => {
    if (!email.trim() || !message.trim()) {
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("https://codecaveback2.onrender.com/api/support/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
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
        py: 4,
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          p: 3,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 0 15px rgba(255,255,255,0.1)"
              : "0 0 10px rgba(0,0,0,0.1)",
          border: `1px solid ${theme.palette.divider}`,
          mb: 4,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("title")}
        </Typography>

        {status === "success" && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {t("success")}
          </Alert>
        )}
        {status === "error" && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {t("error")}
          </Alert>
        )}

        <TextField
          fullWidth
          label={t("email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          multiline
          rows={4}
          fullWidth
          placeholder={t("placeholder")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            borderRadius: 10,
            bgcolor: "#1976D2",
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          {t("send")}
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        {t("faq.title")}
      </Typography>

      <Box sx={{ width: "100%", maxWidth: 600 }}>
        {faqItems.map((item, index) => (
          <Accordion
            key={index}
            sx={{
              mb: 1.5,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 0 8px rgba(255,255,255,0.15)"
                  : "0 0 10px rgba(0,0,0,0.1)",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: theme.palette.text.primary }} />
              }
            >
              <Typography sx={{ fontWeight: "bold" }}>{item.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default SupportScreen;
