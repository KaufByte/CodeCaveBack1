
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Paper,
  IconButton,
  Chip,
  useTheme,
  Modal,
  TextField,
} from "@mui/material";
import { Settings, AccountBalanceWallet, EuroSymbol } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {authFetch} from"../utils/authFetch";
import { loadStripe } from "@stripe/stripe-js";

const subscriptions = [
  {
    priceId: "price_1RDBbICBzupUl6DZvborkf3k",
    nameKey: "commitAccess.name",
    descKey: "commitAccess.description",
    price: 5.0,
    url: "https://i.pinimg.com/736x/20/d2/f0/20d2f03fdd5ed1533d5f10ae0a448eba.jpg",
  },
  {
    priceId: "price_1RDBhUCBzupUl6DZnaT7g5HH",
    nameKey: "mergeMaster.name",
    descKey: "mergeMaster.description",
    price: 10.0,
    url: "https://i.pinimg.com/736x/ae/56/70/ae5670ecd0cea2a878b70c07150adc21.jpg",
  },
  {
    priceId: "price_1RDBibCBzupUl6DZd9ojFaDE",
    nameKey: "rootPrivileges.name",
    descKey: "rootPrivileges.description",
    price: 20.0,
    url: "https://i.pinimg.com/736x/d8/b5/f2/d8b5f20a3eea410e47abaa6a729aa325.jpg",
  },
];
const normalizeLevel = (level: string): string => {
  const map: Record<string, string> = {
    "price_1RDBbICBzupUl6DZvborkf3k": "Junior",
    "price_1RDBhUCBzupUl6DZnaT7g5HH": "Chilli",
    "price_1RDBibCBzupUl6DZd9ojFaDE": "Powerful SEO",
    "price_FREE": "Free",
    "чилловиймідл": "Chilli",
    "потужнийseo": "Powerful SEO",
    "chilli": "Chilli",
    "chillimiddle": "Chilli",
    "powerfulseo": "Powerful SEO",
    "junior": "Junior",
    "free": "Free",
  };
  const key = level.toLowerCase().replace(/\s+/g, "").replace(/-/g, "");
  return map[key] || level;
};
const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation("home");
  const { t: tSub } = useTranslation("subscriptions");
  const [user, setUser] = useState<any>(null);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [loadingTopUp, setLoadingTopUp] = useState(false);




useEffect(() => {
  const local = localStorage.getItem("currentUser");
  if (local) {
    try {
      const parsed = JSON.parse(local);
      setUser(parsed);
    } catch (e) {
      console.error("Помилка у читанні currentUser з localStorage", e);
    }
  }

  const fetchUser = async () => {
    try {
      const res = await authFetch("https://codecaveback2.onrender.com/api/me/");
      if (!res || !res.ok) throw new Error("Не вдалося отримати дані користувача");
      const data = await res.json();
      setUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
    } catch (err) {
      console.error("Помилка у завантаженні даних :", err);
    }
  };

  fetchUser();

  if (window.location.pathname === "/success") {
    const interval = setInterval(fetchUser, 2000);
    setTimeout(() => clearInterval(interval), 10000);
    return () => clearInterval(interval);
  }
}, []);

const normalizedSubscriptionName = useMemo(() => {
  return normalizeLevel(user?.subscription_name || "Free");
}, [user]);

if (!user) {
  return <Typography>{t("loading")}</Typography>;
}

const subData = subscriptions.find(s => s.priceId === user.subscription_name);

  const subscription = subData
    ? {
        name: tSub(subData.nameKey),
        price: `${subData.price.toFixed(2)} `,
        status: user.subscription_status,
        description: tSub(subData.descKey),
        backgroundImage: `url('${subData.url}')`,
      }
    : {
        name: "Hard Worker",
        price: "Free",
        status: t("status"),
        description: t("subscriptionDescription"),
        backgroundImage:
          "url('https://i.pinimg.com/474x/8a/96/88/8a9688dd932a09d59a76ac4f879c7657.jpg')",
      };

  const handleTopUpSubmit = async () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount");
      return;
    }

    setLoadingTopUp(true);

    try {
      const res = await authFetch("https://codecaveback2.onrender.com/api/stripe/topup-session/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!res) {
        throw new Error("No response received from server");
      }

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Server error:", data);
        alert(data.error || "Error creating top-up session");
        setLoadingTopUp(false);
        return;
      }

      const stripe = await loadStripe("pk_test_51RDBLDCBzupUl6DZGQ1yi94hjUde2NjAbke6gH0NBtt6GcGTzFtJ3lalXkrPNqAt1JIiQUS7Ck365aOJLrLP8TIR00RNjASMAa");
      await stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Something went wrong.");
      setLoadingTopUp(false);
    }
  };
  const isAdmin = user?.role === "admin"; 
  const isHardWorker = !isAdmin && normalizedSubscriptionName === "Free";
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 6,
        bgcolor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: { xs: "90%", sm: 500 },
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          position: "relative",
          bgcolor: theme.palette.mode === "dark" ? "#2b3040" : "#f5f7fa",
          p: 3,
          boxShadow:
            "0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.2)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -3,
            left: -3,
            right: -3,
            bottom: -3,
            borderRadius: "inherit",
            background:
              "linear-gradient(135deg, #FF6B6B, #FFCA3A, #32CD32, #1E90FF)",
            zIndex: -1,
          },
        }}
      >
        <Avatar
          src={user.avatar || ""}
          sx={{
            width: { xs: 80, sm: 120 },
            height: { xs: 80, sm: 120 },
            bgcolor: "#b71c1c",
            mb: { xs: 2, sm: 0 },
            mr: { xs: 0, sm: 2 },
            fontSize: { xs: 30, sm: 50 },
          }}
        >
          {!user.avatar && user.username.charAt(0).toUpperCase()}
        </Avatar>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", sm: "flex-start" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Typography variant="h6" fontSize={{ xs: 20, sm: 25 }}>
          {user.display_name || user.username}
          </Typography>

          <Typography
            variant="body1"
            fontSize={{ xs: 16, sm: 20 }}
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}
          >
            {t("balance")}: {user.balance || "0.00"} <EuroSymbol fontSize="small" />
          </Typography>

          <Button
            variant="contained"
            startIcon={<AccountBalanceWallet />}
            sx={{
              mt: 2,
              width: { xs: "80%", sm: "80%" },
              bgcolor: theme.palette.mode === "dark" ? "#000" : "#fff",
              color: theme.palette.mode === "dark" ? "#fff" : "#000",
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(29, 29, 29, 0.7)"
                    : "rgba(255, 255, 255, 0.8)",
              },
            }}
            onClick={() => setTopUpOpen(true)}
          >
            {t("deposit")}
          </Button>
        </Box>
      </Paper>

      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          my: 5,
          textAlign: { xs: "center", md: "left" },
          transform: { xs: "none", md: "translateX(-100px)" },
        }}
      >
        {t("yourSubscription")}
      </Typography>

      <Paper
        elevation={6}
        sx={{
          width: { xs: "90%", sm: 500 },
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
          bgcolor: theme.palette.mode === "dark" ? "#424242" : "#f5f5f5",
          padding: 3,
          boxShadow:
            "0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.2)",
           "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: subscription.backgroundImage,
            backgroundSize: "110%",    
            backgroundPosition: "center", 
            backgroundRepeat: "no-repeat",
            opacity: 0.15,
            zIndex: 0,
          },

          "&::after": {
            content: '""',
            position: "absolute",
            inset: -3,
            background: "linear-gradient(135deg, #aaa, #ddd)",
            borderRadius: "inherit",
            zIndex: -1,
          },
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: theme.palette.text.primary,
            zIndex: 1,
          }}
          onClick={() => navigate("/subscriptions")}
        >
          <Settings />
        </IconButton>

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
          {isAdmin
            ? "Administrator"
            : isHardWorker
            ? "Hard Worker"
            : subscription.name}
        </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <Chip icon={<EuroSymbol />} label={subscription.price} sx={{ bgcolor: "#8bc34a", color: "#fff" }} />
            <Chip label={subscription.status} sx={{ bgcolor: "#4caf50", color: "#fff" }} />
          </Box>
          {!isAdmin && (
            <Typography variant="body1">
              {subscription.description}
            </Typography>
          )}
        </Box>
      </Paper>
      <Modal open={topUpOpen} onClose={() => setTopUpOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            {t("enterAmount")}
          </Typography>
          <TextField
            fullWidth
            type="number"
            label={t("pay") + " (EUR)"}
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            disabled={loadingTopUp}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleTopUpSubmit}
            disabled={loadingTopUp}
          >
            {loadingTopUp ? t("processing") : t("pay")}
          </Button>
        </Box>
      </Modal>
    </Box>
    
  );
};

export default HomeScreen;
