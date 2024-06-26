import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
// import ForgotPassword from './pages/ForgotPassword.jsx';
// import SignUpClerk from "./pages/SignUpClerk.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
// import LoginClerk from "./pages/LoginClerk";
import NavbarComp from "./components/Navbar";
import EditProfile from "./pages/EditProfile";
import CoverLetters from "./pages/CoverLetters";
import TextEditor from "./pages/TextEditor";
import SettingsPage from "./pages/SettingsPage";
import ComingSoon from "./pages/ComingSoon";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import About from "./pages/About";
import ProtectedPage from "./pages/ProtectedPage";
import PosterPage from "./pages/PosterPage";
import { SettingsProvider } from "./context/SettingsContext";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

import {
  SignedIn,
  SignedOut,
  // SignInButton,
  // UserButton,
} from "@clerk/clerk-react";
import MyFooter from "./components/MyFooter";
import "./App.css";

export const Context = React.createContext();
export const MobileContext = React.createContext();

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const { isLoaded, getToken } = useAuth();

  React.useEffect(() => {
    const fetchTheme = async () => {
      const theme = localStorage.getItem("theme");
      if (theme) {
        if (theme === "dark") {
          setIsDarkMode(true);
        } else {
          setIsDarkMode(false);
        }
      } else {
        const token = await getToken();
        if (isLoaded === true && !token) return;
        const headers = { Authorization: `Bearer ${token}` };
        try {
          const response = await axios.get(
            import.meta.env.VITE_API_URL + "/users/settings",
            {
              headers: { ...headers, "Content-Type": "application/json" },
            }
          );
          localStorage.setItem(
            "theme",
            response.data.settings.dark_mode ? "dark" : "light"
          );
          setIsDarkMode(response.data.settings.dark_mode);
        } catch (error) {
          console.error("Error occurred while fetching theme settings:", error);
        }
      }
    };
    const checkWindowWidth = () => {
      if (window.innerWidth < 720) {
        setIsMobile(true);
      }
    };
    fetchTheme();
    checkWindowWidth();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    const body = document.querySelector("body");
    if (isDarkMode) {
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
    }
  }, [isDarkMode]);

  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  return (
    <Context.Provider value={[isDarkMode, setIsDarkMode]}>
      <MobileContext.Provider value={isMobile}>
        <BrowserRouter>
          <div className={isDarkMode ? "dark" : ""}>
            <SignedIn>
              <SettingsProvider>
                <NavbarComp userAuthenticated={true} />
                <Routes>
                  <Route path="/" element={<Navigate to="/home" />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/cover-letters" element={<CoverLetters />} />
                  <Route path="/text-editor/:id" element={<TextEditor />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/protected" element={<ProtectedPage />} />
                  <Route path="/coming-soon" element={<ComingSoon />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/poster" element={<PosterPage />} />
                  <Route path="*" element={<NoPage />} />
                </Routes>
              </SettingsProvider>
            </SignedIn>
            <SignedOut>
              <NavbarComp userAuthenticated={false} />
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/sign-up" element={<SignUp />} />
                {/* <Route path="/forgot-password" element={<ForgotPassword/>} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/poster" element={<PosterPage />} />
                <Route path="*" element={<NoPage />} />
              </Routes>
            </SignedOut>
            <MyFooter />
          </div>
        </BrowserRouter>
      </MobileContext.Provider>
    </Context.Provider>
  );
}

export default App;
