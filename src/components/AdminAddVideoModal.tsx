// import React, { useState } from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, Button, Box, IconButton, Typography
// } from "@mui/material";
// import { Add, Delete } from "@mui/icons-material";

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: FormData) => void;
// }

// const AdminAddVideoModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [hashtags, setHashtags] = useState("");
//   const [previewFile, setPreviewFile] = useState<File | null>(null);
//   const [videoFile, setVideoFile] = useState<File | null>(null);
//   const [timecodes, setTimecodes] = useState<{ time: string; label: string }[]>([]);
//   const [timeInput, setTimeInput] = useState("");
//   const [labelInput, setLabelInput] = useState("");

//   const addTimecode = () => {
//     if (!timeInput.trim() || !labelInput.trim()) return;
//     setTimecodes(prev => [...prev, { time: timeInput.trim(), label: labelInput.trim() }]);
//     setTimeInput("");
//     setLabelInput("");
//   };

//   const handleSubmit = () => {
//     if (!title || !previewFile || !videoFile) {
//       alert("Заполните все обязательные поля.");
//       return;
//     }

//     const dateUa = new Date().toLocaleDateString("uk-UA", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric"
//     });

//     const dateUs = new Date().toLocaleDateString("en-US", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric"
//     });

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("hashtags", hashtags);
//     formData.append("preview", previewFile);
//     formData.append("video", videoFile);
//     formData.append("timecodes", JSON.stringify(timecodes));
//     formData.append("dateUa", dateUa);
//     formData.append("dateUs", dateUs);

//     onSubmit(formData);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle>Add video</DialogTitle>
//       <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//         <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} fullWidth />
//         <TextField label="Description" multiline rows={3} value={description} onChange={e => setDescription(e.target.value)} fullWidth />
//         <TextField label="Hashtags (Hashtags should be written separated by commas)" value={hashtags} onChange={e => setHashtags(e.target.value)} fullWidth />

//         <Box>
//           <Typography variant="body2" sx={{ mb: 0.5 }}>Preview Image</Typography>
//           <input type="file" accept="image/*" onChange={e => setPreviewFile(e.target.files?.[0] || null)} />
//         </Box>

//         <Box>
//           <Typography variant="body2" sx={{ mb: 0.5 }}>Video File</Typography>
//           <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} />
//         </Box>

//         <Box>
//           <Typography variant="body2" sx={{ mb: 0.5 }}>Timecodes:</Typography>
//           <Box sx={{
//             display: "flex",
//             gap: 1,
//             background: "#2a2a2a",
//             borderRadius: 2,
//             p: 1,
//             alignItems: "center"
//           }}>
//             <TextField
//               label="00:00:00"
//               value={timeInput}
//               onChange={(e) => setTimeInput(e.target.value)}
//               size="small"
//               sx={{ input: { color: "#fff" }, width: "120px" }}
//             />
//             <TextField
//               label="Description"
//               value={labelInput}
//               onChange={(e) => setLabelInput(e.target.value)}
//               size="small"
//               fullWidth
//               sx={{ input: { color: "#fff" } }}
//             />
//             <IconButton onClick={addTimecode} sx={{ color: "#fff", bgcolor: "#444" }}>
//               <Add />
//             </IconButton>
//           </Box>
//         </Box>

//         {timecodes.length > 0 && (
//           <Box>
//             {timecodes.map((tc, idx) => (
//               <Box
//                 key={idx}
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   mt: 1,
//                   px: 1
//                 }}
//               >
//                 <Typography>{tc.time} — {tc.label}</Typography>
//                 <IconButton onClick={() => setTimecodes(prev => prev.filter((_, i) => i !== idx))}>
//                   <Delete fontSize="small" />
//                 </IconButton>
//               </Box>
//             ))}
//           </Box>
//         )}
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSubmit} variant="contained">Add</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AdminAddVideoModal;
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Add, Delete, UploadFile, Download } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const ROLES = ["Chilli Middle", "Powerful SEO"];
const SUBSCRIPTION_LEVELS = ["Free", "Junior", "Chilli Middle", "Powerful SEO"];
const CLOUDINARY_UPLOAD_PRESET = "CodeCaveVideo"; // имя preset'а
const CLOUDINARY_CLOUD_NAME = "dk6kyqn2z"; 
const AdminAddVideoModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation("admin");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState<string>(""); 
  const [availableHashtags, setAvailableHashtags] = useState<string[]>([]);
  const [minSubscriptionLevel, setMinSubscriptionLevel] = useState("Free");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [timecodes, setTimecodes] = useState<{ time: string; label: string }[]>([]);
  const [timeInput, setTimeInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [materials, setMaterials] = useState<{ title: string; url: string; allowedRoles: string[] }[]>([]);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialUrl, setMaterialUrl] = useState("");
  const [showMaterials, setShowMaterials] = useState(false);
  

  useEffect(() => {
    const saved = localStorage.getItem("savedHashtags");
    if (saved) {
      setAvailableHashtags(JSON.parse(saved));
    }
  }, []);

  const addTimecode = () => {
    if (!timeInput.trim() || !labelInput.trim()) return;
    setTimecodes(prev => [...prev, { time: timeInput.trim(), label: labelInput.trim() }]);
    setTimeInput("");
    setLabelInput("");
  };

  const exportTimecodes = () => {
    const content = timecodes.map(tc => `${tc.time} - ${tc.label}`).join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "timecodes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTimecodes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n");

      const importedTimecodes = lines
        .map(line => {
          const [timePart, ...labelParts] = line.split(" - ");
          const time = timePart?.trim();
          const label = labelParts.join(" - ")?.trim();
          if (!time || !label) return null;
          return { time, label };
        })
        .filter(Boolean) as { time: string; label: string }[];

      setTimecodes(prev => [...prev, ...importedTimecodes]);
    };
    reader.readAsText(file);
  };

  const addMaterial = () => {
    if (!materialTitle.trim() || !materialUrl.trim()) return;
    setMaterials(prev => [...prev, { title: materialTitle.trim(), url: materialUrl.trim(), allowedRoles: [] }]);
    setMaterialTitle("");
    setMaterialUrl("");
  };

  const toggleRoleForMaterial = (idx: number, role: string) => {
    setMaterials(prev => prev.map((mat, i) => {
      if (i !== idx) return mat;
      const updatedRoles = mat.allowedRoles.includes(role)
        ? mat.allowedRoles.filter(r => r !== role)
        : [...mat.allowedRoles, role];
      return { ...mat, allowedRoles: updatedRoles };
    }));
  };

const handleSubmit = () => {
  if (!title || !previewFile || !videoFile) {
    alert(t("fillRequired"));
    return;
  }

    const cleanedTags = hashtags
    .split(",")
    .map((h) => h.trim().replace(/^#+/, ""))  
    .filter(Boolean);

  const updatedHashtags = Array.from(new Set([
    ...availableHashtags,
    ...cleanedTags
  ]));
  localStorage.setItem("savedHashtags", JSON.stringify(updatedHashtags));

  const now = new Date();
  const dateUa = now.toLocaleDateString("uk-UA", { day: "2-digit", month: "long", year: "numeric" });
  const dateUs = now.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
  const createdAtUa = now.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
  const createdAtUs = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("date_ua", dateUa);
  formData.append("date_us", dateUs);
  formData.append("created_at_ua", createdAtUa);
  formData.append("created_at_us", createdAtUs);
  formData.append("min_subscription_level", minSubscriptionLevel);


  formData.append("hashtags", JSON.stringify(cleanedTags));

  formData.append("timecodes", JSON.stringify(timecodes));
  formData.append("materials", JSON.stringify(materials));
  formData.append("preview", previewFile);
  formData.append("video", videoFile);

  onSubmit(formData);
  onClose();
};



  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("addVideo")}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label={t("title")} value={title} onChange={e => setTitle(e.target.value)} fullWidth />
        <TextField label={t("description")} multiline rows={3} value={description} onChange={e => setDescription(e.target.value)} fullWidth />
        <TextField
          fullWidth
          label={t("hashtags")}
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="#tag1, #tag2"
          sx={{ input: { color: "#fff" } }}
        />

        <FormControl fullWidth>
          <InputLabel>{t("minSubscriptionLevel")}</InputLabel>
          <Select
            value={minSubscriptionLevel}
            label={t("minSubscriptionLevel")}
            onChange={(e) => setMinSubscriptionLevel(e.target.value)}
          >
            {SUBSCRIPTION_LEVELS.map(level => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Typography variant="body2">{t("previewImage")}</Typography>
          <input type="file" accept="image/*" onChange={e => setPreviewFile(e.target.files?.[0] || null)} />
        </Box>
        <Box>
          <Typography variant="body2">{t("videoFile")}</Typography>
          <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} />
        </Box>

        <Box>
          <Typography variant="body2">{t("timecodes")}</Typography>
          <Box sx={{ display: "flex", gap: 1, bgcolor: "#2a2a2a", borderRadius: 2, p: 1 }}>
            <TextField label={t("timecodeFormat")} value={timeInput} onChange={e => setTimeInput(e.target.value)} size="small" sx={{ input: { color: "#fff" }, width: "120px" }} />
            <TextField label={t("description")} value={labelInput} onChange={e => setLabelInput(e.target.value)} size="small" fullWidth sx={{ input: { color: "#fff" } }} />
            <IconButton onClick={addTimecode} sx={{ color: "#fff", bgcolor: "#444" }}>
              <Add />
            </IconButton>
            <IconButton onClick={exportTimecodes} sx={{ color: "#fff", bgcolor: "#444" }}>
              <Download />
            </IconButton>
            <IconButton component="label" sx={{ color: "#fff", bgcolor: "#444" }}>
              <UploadFile />
              <input type="file" accept=".txt" hidden onChange={importTimecodes} />
            </IconButton>
          </Box>

          {timecodes.length > 0 && (
            <Box mt={1} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {timecodes.map((tc, idx) => (
                <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#2a2a2a", borderRadius: 2, p: 1 }}>
                  <Typography sx={{ fontSize: "0.9rem" }}>{tc.time} — {tc.label}</Typography>
                  <IconButton size="small" onClick={() => setTimecodes(prev => prev.filter((_, i) => i !== idx))} sx={{ color: "red" }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={showMaterials}
              onChange={(e) => setShowMaterials(e.target.checked)}
              sx={{ color: "#f7266e" }}
            />
          }
          label={t("addMaterialsCheckbox")}
        />

        {showMaterials && (
          <Box>
            <Typography variant="body2">{t("additionalMaterials")}</Typography>
            <Box sx={{ display: "flex", gap: 1, bgcolor: "#2a2a2a", borderRadius: 2, p: 1 }}>
              <TextField
                label={t("materialTitle")}
                value={materialTitle}
                onChange={e => setMaterialTitle(e.target.value)}
                size="small"
                sx={{ input: { color: "#fff" }, width: "150px" }}
              />
              <TextField
                label={t("materialUrl")}
                value={materialUrl}
                onChange={e => setMaterialUrl(e.target.value)}
                size="small"
                fullWidth
                sx={{ input: { color: "#fff" } }}
              />
              <IconButton onClick={addMaterial} sx={{ color: "#fff", bgcolor: "#444" }}>
                <Add />
              </IconButton>
            </Box>

            {materials.length > 0 && (
              <Box mt={2}>
                {materials.map((m, idx) => (
                  <Box key={idx} sx={{ mt: 2, p: 1, border: "1px solid #555", borderRadius: 2 }}>
                    <Typography variant="subtitle2">{m.title} — {m.url}</Typography>
                    {ROLES.map(role => (
                      <FormControlLabel
                        key={role}
                        control={
                          <Checkbox
                            checked={m.allowedRoles.includes(role)}
                            onChange={() => toggleRoleForMaterial(idx, role)}
                            sx={{ color: "#f7266e" }}
                          />
                        }
                        label={t(`roles.${role}`)}
                      />
                    ))}
                    <IconButton onClick={() => setMaterials(prev => prev.filter((_, i) => i !== idx))}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button onClick={handleSubmit} variant="contained">{t("add")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminAddVideoModal;


