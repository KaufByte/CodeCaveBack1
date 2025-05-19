import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface Props {
  onComplete: () => void;
}

const PaymentForm: React.FC<Props> = ({ onComplete }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!stripe || !elements || !cardComplete) return;

  setError(null);
  setSuccess(false);
  setLoading(true);

  const card = elements.getElement(CardElement);
  if (!card) {
    setError("Card input is not available.");
    setLoading(false);
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/api/stripe/setup-intent/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const { clientSecret, customerId } = await res.json();
    localStorage.setItem("stripeCustomerId", customerId);

    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      setError(result.error.message || "An unexpected error occurred.");
      setLoading(false);
      return;
    }

    const paymentMethodId = result.setupIntent.payment_method;

    const duplicateCheck = await fetch(`http://localhost:8000/api/stripe/check-duplicate/${paymentMethodId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const duplicateData = await duplicateCheck.json();

    if (duplicateData.exists) {
      setError("💳 This card is already saved.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onComplete();
      setSuccess(false);
    }, 1500);
  } catch (err) {
    console.error(err);
    setError("Failed to save card. Try again.");
  }

  setLoading(false);
};


  return (
    <form onSubmit={handleSubmit}>
      <Typography fontWeight="bold" mb={1}>
        Card number
      </Typography>

      <CardElement
        onChange={(e) => {
          setCardComplete(e.complete);
        }}
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#fff",
              "::placeholder": { color: "#aaa" },
            },
            invalid: { color: "#ff1744" },
          },
        }}
      />

      <Box mt={2}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Card saved successfully!</Alert>}

        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || !cardComplete || loading}
          fullWidth
          sx={{ bgcolor: "#90caf9", color: "#000" }}
        >
          {loading ? <CircularProgress size={24} /> : "Save Card"}
        </Button>
      </Box>
    </form>
  );
};

export default PaymentForm;
