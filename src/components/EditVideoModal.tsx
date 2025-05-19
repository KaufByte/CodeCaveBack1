import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { Post } from "../pages/FeedScreen";

export interface EditVideoModalProps {
  open: boolean;
  onClose: () => void;
  video: Post | null;
  onSave: (updatedVideo: Post) => void;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "#1e1e1e",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  color: "#fff",
  maxHeight: "90vh",
  overflowY: "auto"
};

const EditVideoModal: React.FC<EditVideoModalProps> = ({ open, onClose, video, onSave }) => {
  const { t } = useTranslation("admin");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [timecodes, setTimecodes] = useState<{ time: string; label: string }[]>([]);
  const [materials, setMaterials] = useState<{ title: string; url: string; allowedRoles: string[] }[]>([]);


  const [newTime, setNewTime] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const [newMaterialTitle, setNewMaterialTitle] = useState("");
  const [newMaterialUrl, setNewMaterialUrl] = useState("");

  useEffect(() => {
    if (!video) return;
    setTitle(video.title);
    setDescription(video.description);
    setHashtags(
      video.hashtags.map((h) => h.startsWith("#") ? h : `#${h}`).join(", ")
    );
    setTimecodes(video.timecodes ?? []);
    setMaterials(video.materials ?? []);
  }, [video]);

const handleSave = () => {
  if (!video) return;

  const cleanedTags = hashtags
    .split(",")
    .map((h) => h.trim().replace(/^#+/, ""))  
    .filter(Boolean);

  const updated: Post = {
    ...video,
    title,
    description,
    hashtags: cleanedTags,           
    timecodes,
    materials,
  };

  onSave(updated);  
  onClose();
};


  const addTimecode = () => {
    if (!newTime.trim() || !newLabel.trim()) return;
    setTimecodes([...timecodes, { time: newTime.trim(), label: newLabel.trim() }]);
    setNewTime("");
    setNewLabel("");
  };

  const addMaterial = () => {
    if (!newMaterialTitle.trim() || !newMaterialUrl.trim()) return;
    setMaterials([...materials, { title: newMaterialTitle.trim(), url: newMaterialUrl.trim(), allowedRoles: [] }]);
    setNewMaterialTitle("");
    setNewMaterialUrl("");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>{t("editVideo")}</Typography>

        <TextField
          fullWidth
          label={t("title")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: "#aaa" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label={t("description")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: "#aaa" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        <TextField
          fullWidth
          label={t("hashtags")}
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          sx={{ mb: 3 }}
          InputLabelProps={{ style: { color: "#aaa" } }}
          InputProps={{ style: { color: "#fff" } }}
        />

        <Typography sx={{ mb: 1 }}>{t("timecodes")}</Typography>
        {timecodes.map((tc, idx) => (
          <List dense key={idx}>
            <ListItem sx={{ pl: 0 }}>
              <ListItemText primary={`${tc.time} — ${tc.label}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => setTimecodes(timecodes.filter((_, i) => i !== idx))}>
                  <Delete sx={{ color: "red" }} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        ))}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            label={t("timecodeFormat")}
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            size="small"
            sx={{ input: { color: "#fff" }, flex: 1 }}
          />
          <TextField
            label={t("description")}
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            size="small"
            sx={{ input: { color: "#fff" }, flex: 2 }}
          />
          <Button onClick={addTimecode} variant="outlined" color="inherit">
            {t("add")}
          </Button>
        </Box>

        <Typography sx={{ mb: 1 }}>{t("additionalMaterials")}</Typography>
        {materials.map((m, idx) => (
          <List dense key={idx}>
            <ListItem sx={{ pl: 0 }}>
              <ListItemText primary={`${m.title} — ${m.url}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => setMaterials(materials.filter((_, i) => i !== idx))}>
                  <Delete sx={{ color: "red" }} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        ))}
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <TextField
            label={t("materialTitle")}
            value={newMaterialTitle}
            onChange={(e) => setNewMaterialTitle(e.target.value)}
            size="small"
            sx={{ input: { color: "#fff" }, flex: 1 }}
          />
          <TextField
            label={t("materialUrl")}
            value={newMaterialUrl}
            onChange={(e) => setNewMaterialUrl(e.target.value)}
            size="small"
            sx={{ input: { color: "#fff" }, flex: 2 }}
          />
          <Button onClick={addMaterial} variant="outlined" color="inherit">
            {t("add")}
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} variant="contained">
            {t("save")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditVideoModal;
