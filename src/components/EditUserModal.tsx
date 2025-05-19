import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
    display_name?: string;
  } | null;
  onSave: (updated: {
    id: number;
    email: string;
    username: string;
    role: string;
    display_name: string;
  }) => void;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#1e1e1e",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  color: "#fff",
};

const EditUserModal: React.FC<EditUserModalProps> = ({ open, onClose, user, onSave }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setUsername(user.username);
      setDisplayName(user.display_name || "");
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = () => {
    if (user) {
      onSave({
        id: user.id,
        email,
        username,
        role,
        display_name: displayName,
      });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" sx={{ mb: 2 }}>Редагування користувача</Typography>

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Роль</InputLabel>
          <Select value={role} label="Роль" onChange={(e) => setRole(e.target.value)}>
            <MenuItem value="user">user</MenuItem>
            <MenuItem value="admin">admin</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>Скасувати</Button>
          <Button variant="contained" onClick={handleSubmit}>Зберегти</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
