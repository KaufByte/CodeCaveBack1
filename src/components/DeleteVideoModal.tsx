import React from "react";
import {
  Modal, Box, Typography, Button
} from "@mui/material";
import { useTranslation } from "react-i18next";

export interface DeleteVideoConfirmProps {
  open: boolean;
  videoId: number;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteVideoConfirm: React.FC<DeleteVideoConfirmProps> = ({ open, onClose, onConfirm }) => {
  const { t } = useTranslation("admin");

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        maxWidth: 400,
        bgcolor: "#1e1e1e",
        color: "#fff",
        p: 3,
        borderRadius: 2,
        mx: "auto",
        mt: "15%",
        textAlign: "center"
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("deleteConfirm.title")}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          {t("deleteConfirm.warning")}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={onClose} color="inherit">{t("cancel")}</Button>
          <Button variant="contained" color="error" onClick={onConfirm}>{t("delete")}</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteVideoConfirm;
