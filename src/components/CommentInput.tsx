import React, { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  TextField,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";

interface Props {
  onSubmit: (text: string) => void;
}

const CommentInput: React.FC<Props> = ({ onSubmit }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation("comments");

  const [text, setText] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const username = currentUser?.username || "Anonymous";
  const initial = username.charAt(0).toUpperCase();
  const avatarSrc = currentUser?.avatar?.startsWith("data:image") ? currentUser.avatar : undefined;

  const handleSend = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText("");
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
      <Avatar
        src={avatarSrc}
        sx={{
          bgcolor: avatarSrc ? "transparent" : isDark ? "#444" : "#ddd",
          width: 36,
          height: 36,
          fontSize: 14,
        }}
      >
        {!avatarSrc && initial}
      </Avatar>
      <Box sx={{ flex: 1, position: "relative" }}>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          placeholder={t("writeComment")}
          size="small"
          sx={{
            "& .MuiInputBase-root": {
              background: isDark ? "#222" : "#f1f1f1",
              borderRadius: 2,
              paddingRight: "45px",
              fontSize: 13,
              minHeight: 38,
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          sx={{
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            color: isDark ? "#aaa" : "#555",
            outline: "none",
            boxShadow: "none",
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CommentInput;
