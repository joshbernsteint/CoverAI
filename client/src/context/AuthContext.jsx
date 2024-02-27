// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import apiClient from "../services/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      setAuthToken(token);
      apiClient.setAuthToken(token); // Set the token in ApiClient
      if (isSignedIn && user) {
        const payload = {
          firstName: user.firstName,
          lastName: user.lastName,
        };

        // Theres a way to sync Clerk with the backend but I have to figure that out later. I only saw it with prisma but im using mongo so idk.
        // Pray for me
        apiClient.signUpUser(payload).then((res) => {
          console.log(res);
        });
      }
    };

    fetchToken();
  }, [isSignedIn]);

  return (
    <AuthContext.Provider value={{ authToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
