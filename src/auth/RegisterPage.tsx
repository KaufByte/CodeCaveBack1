// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   useMediaQuery,
//   MenuItem,
//   InputAdornment
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import ThemeToggle from "../components/ThemeToggle";
// import { useTheme } from "../context/ThemeContext";
// import { COUNTRIES } from "../countries";
// import logo from "../assets/LogoCC-removebg-preview.png";
// import {
//   AccountCircleOutlined,
//   EmailOutlined,
//   LockOutlined,
//   PublicOutlined
// } from "@mui/icons-material";

// const RegisterPage: React.FC = () => {
//   const { isDarkMode } = useTheme();
//   const isMobile = useMediaQuery("(max-width:600px)");
//   const navigate = useNavigate();

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [country, setCountry] = useState("");
//   const [password, setPassword] = useState("");
//   const [adminSecret, setAdminSecret] = useState("");

//   useEffect(() => {
//     fetch("http://ip-api.com/json/")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data && data.country && COUNTRIES.includes(data.country)) {
//           setCountry(data.country);
//         }
//       })
//       .catch((error) => {
//         console.error("Geolocation error:", error);
//       });
//   }, []);

//   const handleRegister = async () => {
//     if (!username || !email || !country || !password) {
//       alert("Please fill all required fields");
//       return;
//     }
//     // Если значение Admin Secret совпадает с "admin123", то пользователь становится администратором
//     const role = adminSecret === "admin123" ? "admin" : "user";
//     const newUser = { username, email, country, password, role };

//     try {
//       // Проверяем, существует ли уже пользователь с таким email
//       const existingUsers = await fetch(`http://localhost:5000/users?email=${email}`)
//         .then((res) => res.json());

//       if (existingUsers.length > 0) {
//         alert("User already exists");
//         return;
//       }

//       // Сохраняем нового пользователя
//       const response = await fetch("http://localhost:5000/users", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newUser)
//       });

//       if (response.ok) {
//         alert("Registration successful");
//         navigate("/login"); // Перенаправляем на страницу входа
//       } else {
//         alert("Failed to register");
//       }
//     } catch (error) {
//       console.error("Error registering user:", error);
//       alert("Error occurred during registration");
//     }
//   };


//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         p: 2,
//         background: isDarkMode
//           ? "#0f0f0f"
//           : "#fafafa",
//         overflow: "hidden",
//         position: "relative",
//       }}
//     >
//       {/* Свечение позади лого */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: "15%",
//           left: "50%",
//           transform: "translateX(-50%)",
//           width: isMobile ? 250 : 300,
//           height: isMobile ? 250 : 300,
//           bgcolor: "#ff8c00",
//           filter: "blur(150px)",
//           opacity: 0.6,
//           zIndex: 0,
//         }}
//       />

//       {/* Свечение позади формы */}
//       <Box
//         sx={{
//           position: "absolute",
//           bottom: "10%",
//           left: "50%",
//           transform: "translateX(-50%)",
//           width: isMobile ? 250 : 400,
//           height: isMobile ? 250 : 400,
//           bgcolor: "#ffc107",
//           filter: "blur(200px)",
//           opacity: 0.5,
//           zIndex: 0,
//         }}
//       />

//       {/* Лого + Переключатель */}
//       <Box sx={{ textAlign: "center", mb: 2, zIndex: 1 }}>
//         <Box
//           component="img"
//           src={logo}
//           alt="MyPremium Logo"
//           sx={{
//             width: isMobile ? 260 : 380,
//             height: "auto",
//             mb: 1,
//           }}
//         />

//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 3,
//           }}
//         >
//           <Typography
//             variant="body1"
//             sx={{
//               color: isDarkMode ? "#ddd" : "#555",
//               fontSize: 25,
//               fontWeight: "bold",
//             }}
//           >
//             Switch mode
//           </Typography>
//           <ThemeToggle />
//         </Box>
//       </Box>
//       {/* Улучшенная форма регистрации */}
//       <Box
//         sx={{
//           width: isMobile ? "85%" : 340,
//           p: 4,
//           borderRadius: 4,
//           position: "relative",
//           bgcolor: isDarkMode ? "rgba(30,30,30,0.7)" : "rgba(255,255,255,0.6)",
//           backdropFilter: "blur(15px)",
//           boxShadow: isDarkMode
//             ? "0 8px 32px rgba(0,0,0,0.7)"
//             : "0 8px 32px rgba(0,0,0,0.15)",
//           zIndex: 1,
//         }}
//       >
//         <Typography
//           variant="h5"
//           fontWeight="bold"
//           sx={{
//             mb: 3,
//             textAlign: "center",
//             color: isDarkMode ? "#fff" : "#000",
//           }}
//         >
//           Create Your Account
//         </Typography>

//         <TextField
//           size="small"
//           label="Username"
//           variant="outlined"
//           fullWidth
//           sx={{
//             mb: 2.5,
//             "& .MuiOutlinedInput-root": { borderRadius: 3 },
//           }}
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <AccountCircleOutlined color="primary" />
//               </InputAdornment>
//             ),
//           }}
//         />

//         <TextField
//           size="small"
//           label="Email"
//           variant="outlined"
//           type="email"
//           fullWidth
//           sx={{
//             mb: 2.5,
//             "& .MuiOutlinedInput-root": { borderRadius: 3 },
//           }}
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <EmailOutlined color="primary" />
//               </InputAdornment>
//             ),
//           }}
//         />

//         <TextField
//           size="small"
//           select
//           label="Country"
//           variant="outlined"
//           fullWidth
//           sx={{
//             mb: 2.5,
//             "& .MuiOutlinedInput-root": { borderRadius: 3 },
//           }}
//           value={country}
//           onChange={(e) => setCountry(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <PublicOutlined color="primary" />
//               </InputAdornment>
//             ),
//           }}
//         >
//           {COUNTRIES.map((c) => (
//             <MenuItem key={c} value={c}>
//               {c}
//             </MenuItem>
//           ))}
//         </TextField>

//         <TextField
//           size="small"
//           label="Password"
//           variant="outlined"
//           type="password"
//           fullWidth
//           sx={{
//             mb: 3,
//             "& .MuiOutlinedInput-root": { borderRadius: 3 },
//           }}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <LockOutlined color="primary" />
//               </InputAdornment>
//             ),
//           }}
//         />

//         <Button
//           variant="contained"
//           fullWidth
//           sx={{
//             py: 1,
//             fontWeight: "bold",
//             borderRadius: 3,
//             background: "linear-gradient(145deg, #ff9800, #ffc107)",
//             boxShadow: "0 4px 10px rgba(255,152,0,0.3)",
//             "&:hover": {
//               transform: "scale(1.03)",
//               boxShadow: "0 6px 15px rgba(255,152,0,0.5)",
//             },
//             transition: "transform 0.2s, box-shadow 0.2s",
//           }}
//           onClick={handleRegister}
//         >
//           Sign Up
//         </Button>

//         <Box sx={{ textAlign: "center", mt: 2 }}>
//           <Typography
//             variant="body2"
//             sx={{ color: isDarkMode ? "#fff" : "#000" }}
//           >
//             Already have an account?{" "}
//             <Link to="/login" style={{ color: "#42a5f5", fontWeight: "bold" }}>
//               Log In
//             </Link>
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default RegisterPage;
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { COUNTRIES } from "../countries";
import logo from "../assets/LogoCC-removebg-preview.png";
import {
  AccountCircleOutlined,
  EmailOutlined,
  LockOutlined,
  PublicOutlined,
} from "@mui/icons-material";
import LanguageSelector from "../components/LanguageSelector";
import { useTranslation } from "react-i18next";

const RegisterPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { t } = useTranslation("auth");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const validateForm = () => {
    const newErrors = { username: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;
  
    if (!/^[a-zA-Z0-9_.-]{3,20}$/.test(username)) {
      newErrors.username = "Username must be 3–20 characters, Latin letters only";
      isValid = false;
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[а-яА-ЯёЁ]/.test(email)) {
      newErrors.email = "Invalid email format or contains Cyrillic characters";
      isValid = false;
    }
  
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      /[а-яА-ЯёЁ]/.test(password)
    ) {
      newErrors.password = "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, Latin only";
      isValid = false;
    }
  
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };
  
  useEffect(() => {
    fetch("http://localhost:8000/api/location/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country && COUNTRIES.includes(data.country)) {
          setCountry(data.country);
        }
      })
      .catch((error) => {
        console.error("Geolocation error:", error);
      });
  }, []);

  const handleRegister = async () => {
    if (!validateForm()) return;
    if (!username || !email || !country || !password) {
      alert("Please fill all required fields");
      return;
    }
  
    try {
      let exists = false;
      try {
        const cleanEmail = email.trim();
        const check = await fetch(`http://localhost:8000/api/user/${encodeURIComponent(cleanEmail)}/`);
        exists = check.ok;          
      } catch {
      }
      if (exists) {
        alert("User with this email already exists");
        return;
      }
  
      const language = localStorage.getItem("language") || "en";
      const newUser  = { username, email, country, password,language};
  
      const registerRes = await fetch(
        "http://localhost:8000/api/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );
  
      if (registerRes.ok) {
        const data = await registerRes.json();
        localStorage.setItem("token",         data.access);
        localStorage.setItem("refreshToken",  data.refresh);
        localStorage.setItem("userId",        data.user.id);
        localStorage.setItem("currentUser",   JSON.stringify(data.user));
        navigate("/login");
      } else {
        const errorData = await registerRes.json();
        console.error("Registration error:", errorData);
        alert("Failed to register user");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("An error occurred while registering");
    }
  };
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <Box
        sx={{
          position: "fixed", top: 0, left: 0,
          width: "100%", height: "100%",
          background: isDarkMode
            ? "#000"  
            : "#fafafa",
          zIndex: -2,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "15%", left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? 200 : 300,
          height: isMobile ? 200 : 300,
          bgcolor: "#ff8c00",
          filter: "blur(150px)",
          opacity: 0.6,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%", left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? 200 : 400,
          height: isMobile ? 200 : 400,
          bgcolor: "#ffc107",
          filter: "blur(200px)",
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          pt: 2,
          px: 2,
        }}
      >
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
        <LanguageSelector />
      </Box>
      <Box sx={{ textAlign: "center", mb:2, zIndex: 1 }}>
        <Box
          component="img"
          src={logo}
          alt="MyPremium Logo"
          sx={{
            width: isMobile ? 260 : 380,
            height: "auto",
            mt: -1,
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1}}>
        <Typography
          variant="body1"
          sx={{
            color: isDarkMode ? "#ddd" : "#555",
            fontWeight: 500,
            fontSize: 20, 
          }}
      >
            {t("switchMode")}
          </Typography>
          <ThemeToggle />
        </Box>
      </Box>

      <Box
        sx={{
          width: isMobile ? "85%" : 340,
          mt: -0.5, 
          p: 4,
          borderRadius: 4,
          position: "relative",
          bgcolor: isDarkMode ? "rgba(30,30,30,0.7)" : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(15px)",
          boxShadow: isDarkMode
            ? "0 8px 32px rgba(0,0,0,0.7)"
            : "0 8px 32px rgba(0,0,0,0.15)",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 3, color: isDarkMode ? "#fff" : "#000" }}
        >
          {t("createAccount")}
        </Typography>

        <TextField
          size="small"
          label={t("username")}
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={Boolean(errors.username)}
          helperText={errors.username}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleOutlined color="primary" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          size="small"
          label={t("email")}
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlined color="primary" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          size="small"
          select
          label={t("country")}
          fullWidth
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PublicOutlined color="primary" />
              </InputAdornment>
            ),
          }}
        >
          {COUNTRIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField
            size="small"
            label={t("password")}
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            size="small"
            label={t("confirmPassword")}
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="primary" />
                </InputAdornment>
              ),
            }}
          />
        <Button
          variant="contained"
          fullWidth
          onClick={handleRegister}
          sx={{
            background: "linear-gradient(145deg, #ff9800, #ffc107)",
            borderRadius: 3,
            py: 1,
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(255,152,0,0.3)",
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: "0 6px 15px rgba(255,152,0,0.5)",
            },
          }}
        >
          {t("signUp")}
        </Button>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" sx={{ color: isDarkMode ? "#fff" : "#000" }}>
            {t("alreadyHaveAccount")}
            <Link to="/login" style={{ color: "#42a5f5", fontWeight: "bold" }}>
              {t("login")}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
    </Box>
  );
};

export default RegisterPage;
