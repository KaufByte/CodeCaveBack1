import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/HomeScreen";
import Feed from "./pages/FeedScreen";
import Subscriptions from "./pages/SubscriptionScreen";
import Settings from "./pages/SettingsScreen";
import Support from "./pages/SupportScreen";
import Payments from "./pages/PaymentsScreen"; 
import { useWindowSize } from "react-use";
import { Box } from "@mui/material";
import { Navigate } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import { JSX } from "react";
import "./index.css";
import { VideoPlayerProvider } from "./components/VideoPlayerContext";
import CancelScreen from "./pages/CancelScreen";
import SuccessScreen from "./pages/SuccessScreen";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import StudioPage from "./pages/StudioScreen";


function App() {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const sidebarWidth = width > 1400 ? 350 : 300;
  return (
    <ThemeProvider>
    <Router>
      <VideoPlayerProvider> 
        <AppContent isDesktop={isDesktop} sidebarWidth={sidebarWidth} />
      </VideoPlayerProvider>
    </Router>
  </ThemeProvider>
    
  );
}
const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const userId = localStorage.getItem("userId");
  return userId ? element : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const user = localStorage.getItem("currentUser");
  const parsed = user ? JSON.parse(user) : null;
  const isAdmin = parsed?.role === "admin";

  return isAdmin ? element : <Navigate to="/" />;
};
function AppContent({
  isDesktop,
  sidebarWidth,
}: {
  isDesktop: boolean;
  sidebarWidth: number;
}) {
  const location = useLocation();

  const hideSidebarRoutes = ["/login", "/register", "/forgot-password","/success","/cancel"];

  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {!shouldHideSidebar && (
        <>
          {isDesktop ? (
            <Box sx={{ width: sidebarWidth, flexShrink: 0 }}>
              <Sidebar />
            </Box>
          ) : (
            <MobileSidebar />
          )}
        </>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          overflowX: "hidden",
          px: 2,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<ProtectedRoute element={<Feed />} />} />
          <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
          <Route path="/subscriptions" element={<ProtectedRoute element={<Subscriptions />} />} />
          <Route path="/payment" element={<ProtectedRoute element={<Payments />} />} />
          <Route path="/support" element={<Support />} />
          <Route path="/success" element={<SuccessScreen />} />
          <Route path="/cancel" element={<CancelScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/studio" element={<AdminRoute element={<StudioPage />} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
