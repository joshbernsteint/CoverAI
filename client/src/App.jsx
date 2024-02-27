import {
  SignOutButton,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import SignUp from "./pages/SignUp";
import SignUpClerk from "./pages/SignUpClerk";
import { AuthProvider } from "./context/AuthContext";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import EditProfile from "./pages/EditProfile";
import NoPage from "./pages/NoPage";
import CoverLetters from './pages/CoverLetters';
import React, { useState } from 'react';
import TextEditor from './pages/TextEditor';
import CLContext from './CLContext';

function App() {

  const [activeCL, setActiveCL] = useState(JSON.parse(localStorage.getItem('activeCL') || `{"ops": [{"insert": "Place your cover letter here!"}]}`));

  return (
    <>
      <AuthProvider>
      <CLContext.Provider value={{activeCL, setActiveCL}}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/cover-letters" element={<CoverLetters />} />
          <Route path="/text-editor/:id" element={<TextEditor />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
      </CLContext.Provider>
    </AuthProvider>
    </>
  );
}

export default App;
