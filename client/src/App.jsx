import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
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

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

function App() {
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  const ClerkWithRoutes = () => {
    const navigate = useNavigate();
  };

  const ProtectedRoute = ({
    component: Component,
    isAuthenticated,
    ...rest
  }) => {
    return isAuthenticated ? (
      <Route {...rest} element={<Component />} />
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return (
    <BrowserRouter>
      <NavbarComp userAuthenticated={userAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute
              component={EditProfile}
              isAuthenticated={userAuthenticated}
            />
          }
        />
        <Route
          path="/cover-letters"
          element={
            <ProtectedRoute
              component={CoverLetters}
              isAuthenticated={userAuthenticated}
            />
          }
        />
        <Route
          path="/text-editor/:id"
          element={
            <ProtectedRoute
              component={TextEditor}
              isAuthenticated={userAuthenticated}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute
              component={SettingsPage}
              isAuthenticated={userAuthenticated}
            />
          }
        />
        <Route path="/sign-up" element={<SignUpClerk />} />
        <Route path="/login" element={<LoginClerk />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
