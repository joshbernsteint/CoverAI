import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import SignUpClerk from "./pages/SignUpClerk";
import LoginClerk from "./pages/LoginClerk";
import NavbarComp from "./components/Navbar";
import EditProfile from "./pages/EditProfile";
import CoverLetters from "./pages/CoverLetters";
import TextEditor from "./pages/TextEditor";
import SettingsPage from "./pages/SettingsPage";
import About from "./pages/About";
import ProtectedPage from "./pages/ProtectedPage";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import MyFooter from "./components/MyFooter";
import "./App.css";

export const Context = React.createContext();

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  return (
    <Context.Provider value={[ isDarkMode, setIsDarkMode ]}>
      <BrowserRouter>
        <div className={isDarkMode ? "dark" : ""}>
          <SignedIn>
            <NavbarComp userAuthenticated={true} />
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/sign-up" element={<SignUpClerk />} />
              <Route path="/login" element={<LoginClerk />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/cover-letters" element={<CoverLetters />} />
              <Route path="/text-editor/:id" element={<TextEditor />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/protected" element={<ProtectedPage />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </SignedIn>
          <SignedOut>
            <NavbarComp userAuthenticated={false} />
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/sign-up" element={<SignUpClerk />} />
              <Route path="/login" element={<LoginClerk />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </SignedOut>
          <MyFooter />
        </div>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
