import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import SignUpClerk from "./pages/SignUpClerk.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import LoginClerk from "./pages/LoginClerk";
import NavbarComp from "./components/Navbar";
import EditProfile from "./pages/EditProfile";
import CoverLetters from "./pages/CoverLetters";
import TextEditor from "./pages/TextEditor";
import SettingsPage from "./pages/SettingsPage";
import About from "./pages/About";
import ProtectedPage from "./pages/ProtectedPage";
import { SettingsProvider } from "./context/SettingsContext"; 
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import MyFooter from "./components/MyFooter";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <>
      <SettingsProvider>
        <SignedIn>
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
            <Route path="*" element={<NoPage />} />
          </Routes>
        </SignedIn>
        </SettingsProvider>
        <SignedOut>
          <NavbarComp userAuthenticated={false} />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </SignedOut>
      </>
      <MyFooter />
    </BrowserRouter>
  );
}

export default App;
