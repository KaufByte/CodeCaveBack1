import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  useTheme,
  useMediaQuery,
  Modal,
  CircularProgress,
} from "@mui/material";
import EuroIcon from "@mui/icons-material/Euro";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useTranslation } from "react-i18next";
import { loadStripe } from "@stripe/stripe-js";
import { authFetch } from "../utils/authFetch";
const stripePromise = loadStripe("pk_test_51RDBLDCBzupUl6DZGQ1yi94hjUde2NjAbke6gH0NBtt6GcGTzFtJ3lalXkrPNqAt1JIiQUS7Ck365aOJLrLP8TIR00RNjASMAa");

interface SubscriptionProps {
  id: number;
  nameKey: string;
  descriptionKey: string;
  price: number;
  priceId: string;
  url: string;
  color: string;
}

const subscriptions: SubscriptionProps[] = [
  {
    id: 1,
    nameKey: "commitAccess.name",
    descriptionKey: "commitAccess.description",
    price: 5.0,
    priceId: "price_1RDBbICBzupUl6DZvborkf3k",
    url: "https://i.pinimg.com/736x/20/d2/f0/20d2f03fdd5ed1533d5f10ae0a448eba.jpg",
    color: "#4CAF50",
  },
  {
    id: 2,
    nameKey: "mergeMaster.name",
    descriptionKey: "mergeMaster.description",
    price: 10.0,
    priceId: "price_1RDBhUCBzupUl6DZnaT7g5HH",
    url: "https://i.pinimg.com/736x/ae/56/70/ae5670ecd0cea2a878b70c07150adc21.jpg",
    color: "#FF9800",
  },
  {
    id: 3,
    nameKey: "rootPrivileges.name",
    descriptionKey: "rootPrivileges.description",
    price: 20.0,
    priceId: "price_1RDBibCBzupUl6DZd9ojFaDE",
    url: "https://i.pinimg.com/736x/d8/b5/f2/d8b5f20a3eea410e47abaa6a729aa325.jpg",
    color: "#79b9a6",
  },
];


const SubscriptionCard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { t } = useTranslation("subscriptions");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasCard, setHasCard] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<number | null>(null);
  const currentSub = subscriptions.find(s => s.id === selectedSubscription);
  const [user, setUser] = useState<any>(null);
  const handleOpen = async (id: number) => {
    setSelectedSubscription(id);
    setOpen(true);
    await checkSavedCard(); 
  };
  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await authFetch(`http://localhost:8000/api/users/${userId}/`);
        if (!res || !res.ok) throw new Error("Не вдалося отримати дані користувача");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();

    const pathname = window.location.pathname;
    if (pathname === "/success") {
      const timer = setTimeout(fetchUser, 1000); 
      return () => clearTimeout(timer);
    }
  }, []);



  if (user === null) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>{t("loading")}</Typography>
      </Box>
    );
  } 
  const handleClose = () => setOpen(false);
  const checkSavedCard = async () => {
    const customerId = localStorage.getItem("stripeCustomerId");
    if (!customerId) return setHasCard(false);

    try {
      const res = await fetch("http://localhost:8000/api/stripe/payment-methods/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const cards = await res.json();
      setHasCard(Array.isArray(cards) && cards.length > 0);
    } catch {
      setHasCard(false);
    }
  };
  const handlePayment = async () => {
    if (!currentSub) return;
    setLoading(true);

    if (hasCard) {
      const res = await authFetch("http://localhost:8000/api/stripe/create-strict-subscription/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ priceId: currentSub.priceId }),
      });

      if (!res) {
        setLoading(false);
        throw new Error("❌ authFetch");
      }

      const data = await res.json();
      if (!res.ok) {
        console.error("❌ Server returned:", data);
        setLoading(false);
        throw new Error(data.error || "Unknown error");
      }

      alert("Підписка оформлена успішно!");
      window.location.href = "/success";
      return;
    }

    const stripe = await stripePromise;

    const res = await authFetch("http://localhost:8000/api/stripe/checkout-session/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ priceId: currentSub.priceId }),
    });

    if (!res) {
      setLoading(false);
      throw new Error("❌ authFetch");
    }

    const data = await res.json();
    if (!res.ok) {
      console.error("❌ Server returned:", data);
      setLoading(false);
      throw new Error(data.error || "Unknown error");
    }

    await stripe?.redirectToCheckout({ sessionId: data.sessionId });
  };


  
  const cancelSubscription = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/stripe/cancel-subscription/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to cancel subscription");
      alert("Підписку скасовано");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Помилка при скасуванні підписки");
    }
  };
  const isSubscribedTo = (sub: SubscriptionProps) =>
    user?.subscription_status?.toLowerCase() === "active" &&
    user?.subscription_name === sub.priceId;
  const isPremium = (id: number) => id === 3;
  const handleBalancePayment = async (sub: SubscriptionProps) => {
    const res = await authFetch("http://localhost:8000/api/stripe/subscribe-with-balance/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId: sub.priceId }),
    });

    if (!res) {
      alert("Не вдалося з'єднатися з сервером");
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Помилка при оформленні підписки через баланс");
      return;
    }
    window.location.href = "/success";
  };


  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: isMobile ? 2 : 3 }}>
      <Box
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f9f9f9",
          borderRadius: 3,
          p: 3,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: 600,
          textAlign: "center",
          mb: 4,
        }}
      >
        <Typography variant="body1" sx={{ opacity: 0.7 }}>
          {t("info")}
        </Typography>
      </Box>

      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight="bold"
        sx={{ color: theme.palette.text.primary, textAlign: "center", maxWidth: 600, width: "100%", mb: 4 }}
      >
        {t("choose")}
      </Typography>

      {subscriptions.map((sub) => (
        <Card
          key={sub.id}
          sx={{
            width: "90%",
            maxWidth: 600,
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
            backgroundColor: `${sub.color}CC`,
            p: 2,
            mb: 4,
            backdropFilter: "blur(10px)",
            boxShadow: "0px 0px 30px rgba(255, 255, 255, 0.3)",
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${sub.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.1,
              zIndex: -1,
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-10px",
              left: "-10px",
              right: "-10px",
              bottom: "-10px",
              zIndex: -2,
              borderRadius: "inherit",
              background: isPremium(sub.id)
                ? "linear-gradient(135deg, rgba(255,215,0,0.6), rgba(255,255,255,0))"
                : "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0))",
              filter: "blur(50px)",
              opacity: isPremium(sub.id) ? 0.6 : 0.3,
            },
          }}
        >
          <CardContent sx={{ position: "relative", zIndex: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#fff", textShadow: "0 0 4px rgba(0,0,0,0.4)", fontSize: isMobile ? "1.3rem" : "1.5rem", mb: 1 }}>
              {t(sub.nameKey, { ns: "subscriptions" })}
            </Typography>

            <List sx={{ p: 0, mb: 1 }}>
              <ListItem
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 0,
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "rgba(0, 0, 0, 0.6)",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    mr: 1,
                  }}
                >
                  <EuroIcon sx={{ fontSize: 18, mr: 0.5, color: "#fff" }} />
                  <Typography
                    fontWeight="bold"
                    sx={{ color: "#fff", fontSize: isMobile ? "0.9rem" : "1.1rem" }}
                  >
                    {sub.price.toFixed(2)}
                  </Typography>
                </Box>
                {isSubscribedTo(sub) ? (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={cancelSubscription}
                      sx={{
                        fontWeight: "bold",
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: isMobile ? "0.8rem" : "1rem",
                        px: 2.5,
                        py: 1,
                        minWidth: "auto",
                      }}
                    >
                      {t("cancel")}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#ffc107",
                        color: "#000",
                        fontWeight: "bold",
                        borderRadius: 2,
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#ffb300" },
                        fontSize: isMobile ? "0.8rem" : "1rem",
                        px: 2.5,
                        py: 1,
                        minWidth: "auto",
                      }}
                      startIcon={<CreditCardIcon sx={{ fontSize: 18 }} />}
                      onClick={() => handleOpen(sub.id)}
                    >
                      {t("buy")}
                    </Button>
                  )}
              </ListItem>
            </List>

            <Box sx={{ bgcolor: theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.8)", p: 1, borderRadius: 1, color: theme.palette.mode === "dark" ? "#fff" : "#000" }}>
              <Typography variant="body2">{t(sub.descriptionKey)}</Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
       <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMobile ? "90%" : 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {t("paymentTitle")}
            </Typography>

            <Button
              variant="contained"
              color="success"
              fullWidth
              disabled={!currentSub || user.balance < currentSub.price}
              onClick={() => handleBalancePayment(currentSub!)}
            >
              💰 {t("balancePayment")} ({currentSub?.price.toFixed(2)} €)
            </Button>

            <Button
              variant="contained"
              fullWidth
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <>💳 {t("cardPayment")} ({currentSub?.price.toFixed(2)} €)</>
              )}
            </Button>
          </Box>
        </Modal>
    </Box>
  );
};

export default SubscriptionCard;
