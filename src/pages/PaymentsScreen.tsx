import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  List,
  ListItem,
  ListItemText,
  useTheme,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../components/PaymentForm";
import { authFetch } from "../utils/authFetch";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe("pk_test_51RDBLDCBzupUl6DZGQ1yi94hjUde2NjAbke6gH0NBtt6GcGTzFtJ3lalXkrPNqAt1JIiQUS7Ck365aOJLrLP8TIR00RNjASMAa");

const PaymentsScreen: React.FC = () => {
  const theme = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const { t } = useTranslation("payments");
  const fetchCustomerId = async () => {
    try {
      const res = await authFetch("https://codecaveback2.onrender.com/api/stripe/customer-id/");
      if (!res) return;
      const data = await res.json();
      if (data.customer_id) {
        localStorage.setItem("stripeCustomerId", data.customer_id);
      }
    } catch (err) {
      console.error("❌ Failed to fetch Stripe customer ID:", err);
    }
  };

  const fetchSavedCards = async () => {
    try {
      const res = await authFetch("https://codecaveback2.onrender.com/api/stripe/payment-methods/");
      if (!res) {
        console.warn("authFetch вернул undefined");
        setSavedCards([]);
        return;
      }
      const data = await res.json();
      setSavedCards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error loading cards:", err);
      setSavedCards([]);
    }
  };

  const handleDeleteCard = async (paymentMethodId: string) => {
  try {
    const res = await authFetch(`https://codecaveback2.onrender.com/api/stripe/payment-methods/${paymentMethodId}/`, {
      method: "DELETE",
    });

    if (!res || !res.ok) throw new Error("Failed to delete card");

    fetchSavedCards();
  } catch (err) {
    console.error("❌ Error deleting card:", err);
  }
};

  const fetchBillingHistory = async () => {
  try {
    const res = await authFetch("https://codecaveback2.onrender.com/api/stripe/invoices/");
    if (!res) {
      console.warn("authFetch вернул undefined");
      return;
    }
    const data = await res.json();
    setBillingHistory(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("❌ Error fetching billing history:", err);
  }
};

  useEffect(() => {
    const loadData = async () => {
      if (!localStorage.getItem("stripeCustomerId")) {
        await fetchCustomerId();
      }
      if (!showForm) {
        fetchSavedCards();
        fetchBillingHistory();
      }
    };
    loadData();
  }, [showForm]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 6,
        bgcolor: theme.palette.background.default,
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
       {t("paymentMethods")}
      </Typography>

      <Card sx={{ width: 450, p: 3, mt: 3, borderRadius: 4 }}>
        {showForm ? (
          <Elements stripe={stripePromise}>
            <PaymentForm onComplete={() => setShowForm(false)} />
          </Elements>
        ) : (
          <Button variant="contained" fullWidth onClick={() => setShowForm(true)}>
            {t("addPaymentMethod")}
          </Button>
        )}
      </Card>

      <Card sx={{ width: 450, p: 2, mt: 4, borderRadius: 4 }}>
        <Typography variant="h6" textAlign="center">{t("savedCards")}</Typography>
        {loadingCards ? (
          <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
            {t("loadingCards")}
          </Typography>
        ) : savedCards.length === 0 ? (
          <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
            {t("noCards")}
          </Typography>
        ) : (
          <List>
            {savedCards.map((pm) => (
              <ListItem key={pm.id} divider
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCard(pm.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${t("cardEnding")} •••• ${pm.card.last4}`}
                  secondary={`${t("exprires")} ${pm.card.exp_month}/${pm.card.exp_year}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Card>

      <Card sx={{ width: 450, p: 2, mt: 4, borderRadius: 4 }}>
        <Typography variant="h6" textAlign="center">
          {t("billingHistory")}
        </Typography>
        <List>
          {billingHistory.map(({ id, amount, date, status }) => (
            <ListItem key={id} divider>
              <ListItemText
                primary={`${t("amount")}: €${amount}`}
                secondary={`${t("date")}: ${new Date(date * 1000).toLocaleDateString()} – ${status}`}
              />
            </ListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
};

export default PaymentsScreen;
