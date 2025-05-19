// import React, { useState, useEffect } from "react";
// import {
//   Box, Typography, TextField, Button, Select, MenuItem, FormControl, Avatar, useTheme,
//   InputLabel, Switch, FormControlLabel, Divider, IconButton, InputAdornment
// } from "@mui/material";
// import { useTheme as useAppTheme } from "../context/ThemeContext";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// const SettingsScreen: React.FC = () => {
//   const { isDarkMode } = useAppTheme();
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation();

//   const [profile, setProfile] = useState({
//     displayName: "",
//     email: "",
//     country: "",
//     avatar: "",
//     language: "en",
//   });

//   const [passwords, setPasswords] = useState({
//     password: "",
//     confirmPassword: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

//   const [notifications, setNotifications] = useState({
//     replies: true,
//     productUpdates: true,
//     newsletter: true,
//     promotions: true,
//     creatorUpdates: true,
//   });

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) {
//       navigate("/login");
//       return;
//     }

//     fetch(`http://localhost:8000/api`)
//       .then((res) => res.json())
//       .then((user) => {
//         setProfile({
//           displayName: user.displayName || user.username,
//           email: user.email,
//           country: user.country,
//           avatar: user.avatar || "",
//           language: user.language || "en",
//         });
//         setLanguage(user.language || "en");
//         i18n.changeLanguage(user.language || "en");
//         localStorage.setItem("language", user.language || "en");
//       })
//       .catch(() => {
//         localStorage.removeItem("userId");
//         navigate("/login");
//       });
//   }, [navigate, i18n]);

//   const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPasswords({ ...passwords, [e.target.name]: e.target.value });
//   };

//   const handleLanguageChange = (e: any) => {
//     const lang = e.target.value;
//     setLanguage(lang);
//     i18n.changeLanguage(lang);
//     localStorage.setItem("language", lang);
//   };

//   const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleNotificationToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setNotifications({ ...notifications, [event.target.name]: event.target.checked });
//   };

//   const handleSaveChanges = async () => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) {
//       navigate("/login");
//       return;
//     }

//     if (passwords.password && passwords.password !== passwords.confirmPassword) {
//       alert(t("settings.passwordMismatch"));
//       return;
//     }

//     const response = await fetch(`http://localhost:5000/users/${userId}`);
//     const user = await response.json();

//     const updatedUser = {
//       ...user,
//       displayName: profile.displayName,
//       email: profile.email,
//       country: profile.country,
//       avatar: profile.avatar,
//       password: passwords.password || user.password,
//       language,
//     };

//     const saveResponse = await fetch(`http://localhost:5000/users/${userId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(updatedUser),
//     });

//     if (saveResponse.ok) {
//       alert(t("settings.saved"));
//     } else {
//       alert(t("settings.failedToSave"));
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         bgcolor: theme.palette.background.default,
//         py: { xs: 2, sm: 4 },
//         px: { xs: 2, sm: 4 },
//       }}
//     >
//       <Box
//         sx={{
//           maxWidth: 500,
//           width: "100%",
//           bgcolor:isDarkMode ? "#1e1e1e" : "#f8f9fa",
//           borderRadius: 2,
//           boxShadow: 2,
//           p: { xs: 2, sm: 3 },
//           mb: 2,
//           border: `1px solid ${theme.palette.divider}`,
//         }}
//       >
//         <Typography variant="h6">{t("settings.profileInfo")}</Typography>
//         <Box sx={{ display: "flex", gap: 2, alignItems: "center", my: 2 }}>
//           <Avatar sx={{ width: 60, height: 60 }} src={profile.avatar} />
//           <Button
//             variant="outlined"
//             component="label"
//             size="small"
//             sx={{ borderRadius: 2 }}
//           >
//             Upload photo
//             <input type="file" hidden onChange={handleAvatarUpload} />
//           </Button>
//         </Box>
//         <TextField
//           size="small"
//           fullWidth
//           name="displayName"
//           label={t("settings.displayName")}
//           value={profile.displayName}
//           onChange={handleProfileChange}
//           sx={{ mb: 1, boxShadow: "0 0 6px rgba(255,255,255,0.2)" }}
//         />
//         <TextField
//           size="small"
//           fullWidth
//           name="email"
//           label={t("settings.email")}
//           type="email"
//           value={profile.email}
//           onChange={handleProfileChange}
//           sx={{ mb: 1, boxShadow: "0 0 6px rgba(255,255,255,0.2)" }}
//         />
//         <TextField
//           size="small"
//           fullWidth
//           name="country"
//           label={t("settings.country")}
//           value={profile.country}
//           onChange={handleProfileChange}
//           sx={{ boxShadow: "0 0 6px rgba(255,255,255,0.2)" }}
//         />
//       </Box>

//       <Box
//         sx={{
//           maxWidth: 500,
//           width: "100%",
//           bgcolor:isDarkMode ? "#1e1e1e" : "#f8f9fa",
//           borderRadius: 2,
//           p: 2,
//           my: 2,
//           boxShadow: "0 0 6px rgba(255,255,255,0.2)",
//           border: `1px solid ${theme.palette.divider}`,
//         }}
//       >
//         <Typography variant="h6">{t("settings.password")}</Typography>
//         <TextField
//           size="small"
//           fullWidth
//           name="password"
//           label={t("settings.newPassword")}
//           type={showPassword ? "text" : "password"}
//           value={passwords.password}
//           onChange={handlePasswordChange}
//           sx={{ mb: 1, mt: 2, boxShadow: "0 0 6px rgba(255,255,255,0.2)" }}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton 
//                     onClick={() => setShowPassword(!showPassword)}
//                     edge="end"
//                     sx={{ borderRadius: 0,border:"none" }} // Убираем округление
//                 >
//                   {showPassword ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />

//         <TextField
//           size="small"
//           fullWidth
//           name="confirmPassword"
//           label={t("settings.confirmPassword")}
//           type={showConfirmPassword ? "text" : "password"}
//           value={passwords.confirmPassword}
//           onChange={handlePasswordChange}
//           sx={{ boxShadow: "0 0 6px rgba(255,255,255,0.2)"}}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton
//                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                  edge="end"
//                  sx={{ borderRadius: 0,border:"none" }} // Убираем округление
//                 >
//                   {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Box>

//       <Box
//         sx={{
//           bgcolor:isDarkMode ? "#1e1e1e" : "#f8f9fa",
//           borderRadius: 2,
//           boxShadow: "0 0 6px rgba(255,255,255,0.2)",
//           p: 2,
//           mb: 2,
//           width: "100%",
//           maxWidth: 500,
//           border: `1px solid ${theme.palette.divider}`,
//         }}
//       >
//         <Typography variant="h6">{t("settings.languagePref")}</Typography>
//         <FormControl size="small" fullWidth sx={{ mt: 2 }}>
//           <InputLabel>{t("settings.language")}</InputLabel>
//           <Select value={language} label="Language" onChange={handleLanguageChange}>
//             <MenuItem value="en" onClick={() => { i18n.changeLanguage("en"); localStorage.setItem("language", "en"); }}>English</MenuItem>
//             <MenuItem value="ua" onClick={() => { i18n.changeLanguage("ua"); localStorage.setItem("language", "ua"); }}>Українська</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>
//       <Button
//         variant="contained"
//         onClick={handleSaveChanges}
//         sx={{
//           borderRadius: 2,
//           width: "100%",
//           maxWidth: 500,
//           bgcolor: "#6fbfff",
//           color: "#000",
//           textTransform: "none",
//           boxShadow: "0 0 10px rgba(255,255,255,0.2)",
//           "&:hover": { bgcolor: "#5fa8e6" },
//         }}
//       >
//         {t("settings.saved")}
//       </Button>
//     </Box>
//   );
// };
// export default SettingsScreen;
import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Select, MenuItem, FormControl, Avatar, useTheme,
  InputLabel, IconButton, InputAdornment
} from "@mui/material";
import { useTheme as useAppTheme } from "../context/ThemeContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SettingsScreen: React.FC = () => {
  const { isDarkMode } = useAppTheme();
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    country: "",
    avatar: "",
    language: "en",
  });

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");


  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
  
    if (!userId || !token) {
      navigate("/login");
      return;
    }
  
    fetch(`http://localhost:8000/api/users/${userId}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((user) => {
        setProfile({
          displayName: user.display_name || user.username,
          email: user.email,
          country: user.country,
          avatar: user.avatar || "",
          language: user.language || "en",
        });
        setLanguage(user.language || "en");
        i18n.changeLanguage(user.language || "en");
        localStorage.setItem("language", user.language || "en");
      })
      .catch(() => {
        localStorage.removeItem("userId");
        navigate("/login");
      });
  }, [navigate, i18n]);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleLanguageChange = (e: any) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };



  const handleSaveChanges = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
  
    if (!userId || !token) {
      navigate("/login");
      return;
    }
  
    if (passwords.password && passwords.password !== passwords.confirmPassword) {
      alert(t("settings.passwordMismatch"));
      return;
    }
  
    const updatedUser = {
      display_name: profile.displayName,
      email: profile.email,
      country: profile.country,
      avatar: profile.avatar,
      password: passwords.password || undefined,
      language,
    };
  
    const saveResponse = await fetch(`http://localhost:8000/api/users/${userId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUser),
    });
  
    if (saveResponse.ok) {
      alert(t("settings.saved"));
    } else {
      alert(t("settings.failedToSave"));
    }
  };
  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: theme.palette.background.default,
        py: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: 500,
          width: "100%",
          bgcolor:isDarkMode ? "#1e1e1e" : "#f8f9fa",
          borderRadius: 2,
          boxShadow: 2,
          p: { xs: 2, sm: 3 },
          mb: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6">{t("settings.profileInfo")}</Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", my: 2 }}>
          <Avatar sx={{ width: 60, height: 60 }} src={profile.avatar} />
          <Button
            variant="outlined"
            component="label"
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Upload photo
            <input type="file" hidden onChange={handleAvatarUpload} />
          </Button>
        </Box>
        <TextField
          size="small"
          fullWidth
          name="displayName"
          label={t("settings.displayName")}
          value={profile.displayName}
          onChange={handleProfileChange}
          sx={{ mb: 1, boxShadow: "0 0 6px rgba(255,255,255,0.2)" }}
        />
        <TextField
          size="small"
          fullWidth
          name="email"
          label={t("settings.email")}
          type="email"
          value={profile.email}
          onChange={handleProfileChange}
          sx={{ mb: 1, boxShadow: "0 0 6px rgba(255,255,255,0.2)" }}
        />
        <TextField
          size="small"
          fullWidth
          name="country"
          label={t("settings.country")}
          value={profile.country}
          onChange={handleProfileChange}
          sx={{ boxShadow: "0 0 6px rgba(255,255,255,0.2)" }}
        />
      </Box>

      <Box
        sx={{
          maxWidth: 500,
          width: "100%",
          bgcolor:isDarkMode ? "#1e1e1e" : "#f8f9fa",
          borderRadius: 2,
          p: 2,
          my: 2,
          boxShadow: "0 0 6px rgba(255,255,255,0.2)",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6">{t("settings.password")}</Typography>
        <TextField
          size="small"
          fullWidth
          name="password"
          label={t("settings.newPassword")}
          type={showPassword ? "text" : "password"}
          value={passwords.password}
          onChange={handlePasswordChange}
          sx={{ mb: 1, mt: 2, boxShadow: "0 0 6px rgba(255,255,255,0.2)" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ borderRadius: 0,border:"none" }} 
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          size="small"
          fullWidth
          name="confirmPassword"
          label={t("settings.confirmPassword")}
          type={showConfirmPassword ? "text" : "password"}
          value={passwords.confirmPassword}
          onChange={handlePasswordChange}
          sx={{ boxShadow: "0 0 6px rgba(255,255,255,0.2)"}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                 edge="end"
                 sx={{ borderRadius: 0,border:"none" }} 
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box
        sx={{
          bgcolor:isDarkMode ? "#1e1e1e" : "#f8f9fa",
          borderRadius: 2,
          boxShadow: "0 0 6px rgba(255,255,255,0.2)",
          p: 2,
          mb: 2,
          width: "100%",
          maxWidth: 500,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6">{t("settings.languagePref")}</Typography>
        <FormControl size="small" fullWidth sx={{ mt: 2 }}>
          <InputLabel>{t("settings.language")}</InputLabel>
          <Select value={language} label="Language" onChange={handleLanguageChange}>
            <MenuItem value="en" onClick={() => { i18n.changeLanguage("en"); localStorage.setItem("language", "en"); }}>English</MenuItem>
            <MenuItem value="ua" onClick={() => { i18n.changeLanguage("ua"); localStorage.setItem("language", "ua"); }}>Українська</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button
        variant="contained"
        onClick={handleSaveChanges}
        sx={{
          borderRadius: 2,
          width: "100%",
          maxWidth: 500,
          bgcolor: "#6fbfff",
          color: "#000",
          textTransform: "none",
          boxShadow: "0 0 10px rgba(255,255,255,0.2)",
          "&:hover": { bgcolor: "#5fa8e6" },
        }}
      >
        {t("settings.saved")}
      </Button>
    </Box>
  );
};
export default SettingsScreen;
