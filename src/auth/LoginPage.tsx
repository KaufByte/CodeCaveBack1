// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   useMediaQuery,
//   InputAdornment,
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import ThemeToggle from "../components/ThemeToggle";
// import { useTheme } from "../context/ThemeContext";
// import logo from "../assets/LogoCC-removebg-preview.png";
// import {
//   AccountCircleOutlined,
//   LockOutlined,
// } from "@mui/icons-material";

// const LoginPage: React.FC = () => {
//   const { isDarkMode } = useTheme();
//   const isMobile = useMediaQuery("(max-width:600px)");
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     if (!email || !password) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/user/${email}/`);
//       const users = await response.json();

//       if (users.length === 0) {
//         alert("User not found");
//         return;
//       }

//       const user = users[0];

//       if (user.password !== password) {
//         alert("Incorrect password");
//         return;
//       }

//       alert(`Welcome back, ${user.username}!`);

//       // Сохраняем ID и роль пользователя (например, "admin" или "user")
//       localStorage.setItem("userId", user.id);
//       localStorage.setItem("role", user.role || "user");
//       localStorage.setItem("currentUser", JSON.stringify(user));

//       navigate("/feed"); // Успешный вход
//     } catch (error) {
//       console.error("Login error:", error);
//       alert("Error logging in");
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
//         background: isDarkMode ? "#0f0f0f" : "#fafafa",
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

//       {/* Лого и переключатель темы */}
//       <Box sx={{ textAlign: "center", mb: 3, zIndex: 1 }}>
//         <Box
//           component="img"
//           src={logo}
//           alt="MyPremium Logo"
//           sx={{
//             width: isMobile ? 260 : 400,
//             height: "auto",
//             mb: 1,
//           }}
//         />

//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 2,
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

//       {/* Форма логина (улучшенный дизайн) */}
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
//           Welcome Back!
//         </Typography>

//         <TextField
//           size="small"
//           label="Email"
//           variant="outlined"
//           type="email"
//           fullWidth
//           sx={{
//             mb: 3,
//             "& .MuiOutlinedInput-root": { borderRadius: 3 },
//           }}
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
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
//           label="Password"
//           variant="outlined"
//           type="password"
//           fullWidth
//           sx={{
//             mb: 4,
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
//           onClick={handleLogin}
//         >
//           Log In
//         </Button>

//         <Box sx={{ textAlign: "center", mt: 2 }}>
//           <Typography
//             variant="body2"
//             sx={{ color: isDarkMode ? "#fff" : "#000" }}
//           >
//             Don't have an account yet?{" "}
//             <Link to="/register" style={{ color: "#42a5f5", fontWeight: "bold" }}>
//               Sign Up
//             </Link>
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default LoginPage;
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  AccountCircleOutlined,
  LockOutlined,
} from "@mui/icons-material";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/LogoCC-removebg-preview.png";
import LanguageSelector from "../components/LanguageSelector";
import { useTranslation } from "react-i18next";
import { authFetch } from "../utils/authFetch";

const LoginPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const tokenData = await response.json();
        localStorage.setItem("token", tokenData.access); // JWT access token
        localStorage.setItem("refreshToken", tokenData.refresh); // JWT refresh token
  
        const userRes = await authFetch(`http://localhost:8000/api/user/?email=${encodeURIComponent(email)}`);
        if (!userRes || !userRes.ok) {
          alert("Failed to fetch user data");
          return;
        }

        const user = await userRes.json();
        localStorage.setItem("userId", user.id);
        localStorage.setItem("role", user.role);
        localStorage.setItem("currentUser", JSON.stringify(user));
  
        alert(`Welcome back, ${user.username}!`);
        navigate("/feed");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Check server.");
    }
  };
  


  return (
    <Box sx={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* ==== Повноекранний фон === */}
      <Box
        sx={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100%",
          // тут можна замінити на ваш градієнт
          backgroundImage: isDarkMode
            ? "radial-gradient(circle at center, rgba(255,140,0,0.3), #000 80%)"
            : "radial-gradient(circle at center, rgba(255,193,7,0.3), #fafafa 80%)",
          zIndex: -2,
        }}
      />

      {/* ==== Додаткові розмиті плями зверху і знизу, якщо потрібно ==== */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? 250 : 300,
          height: isMobile ? 250 : 300,
          bgcolor: "#ff8c00",
          filter: "blur(150px)",
          opacity: 0.6,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? 250 : 400,
          height: isMobile ? 250 : 400,
          bgcolor: "#ffc107",
          filter: "blur(200px)",
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      {/* ==== Контент поверх фону ==== */}
      <Box
        sx={{
          position: "relative", // щоб перекривати фон
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        {/* Селектор мови у правому куті */}
        <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}>
          <LanguageSelector />
        </Box>

        {/* Логотип і перемикач теми */}
        <Box sx={{ textAlign: "center", mb: 3, zIndex: 1 }}>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: isMobile ? 260 : 400,
              height: "auto",
              mb: 1,
            }}
          />
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center" }}>
            <Typography sx={{ color: isDarkMode ? "#ddd" : "#555", fontWeight: 500, fontSize: 20 }}>
              {t("switchMode")}
            </Typography>
            <ThemeToggle />
          </Box>
        </Box>

        {/* Форма входу */}
        <Box
          sx={{
            width: isMobile ? "85%" : 340,
            p: 4,
            borderRadius: 4,
            bgcolor: isDarkMode ? "rgba(30,30,30,0.7)" : "rgba(255,255,255,0.6)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 3, color: isDarkMode ? "#fff" : "#000" }}
          >
            {t("welcomeBack")}
          </Typography>

          <TextField
            size="small"
            label={t("email")}
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
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
            label={t("password")}
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ textAlign: "right", mb: 2 }}>
            <Link to="/forgot-password" style={{ fontSize: 14, color: "#42a5f5" }}>
              {t("forgotPassword")}
            </Link>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              py: 1,
              fontWeight: "bold",
              borderRadius: 3,
              background: "linear-gradient(145deg, #ff9800, #ffc107)",
              boxShadow: "0 4px 10px rgba(255,152,0,0.3)",
              transition: "transform .2s, box-shadow .2s",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: "0 6px 15px rgba(255,152,0,0.5)",
              },
            }}
          >
            {t("login")}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" sx={{ color: isDarkMode ? "#fff" : "#000" }}>
              {t("dontHaveAccount")}&nbsp;
              <Link to="/register" style={{ color: "#42a5f5", fontWeight: 500 }}>
                {t("signUp")}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
