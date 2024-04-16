// ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { getToken } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const fetchThemeSettings = async () => {
      console.log("fetchThemeSettings");
      const token = await getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/users/settings",
          {
            headers: {
              ...headers,
              "Content-Type": "application/json",
            },
          }
        );

        setIsDarkMode(response.data.settings.dark_mode);
        console.log(
          "response.data.settings.dark_mode",
          response.data.settings.dark_mode
        );
      } catch (error) {
        console.error("Error occurred while fetching theme settings:", error);
        // Handle error as needed
      }
    };

    fetchThemeSettings();
  }, []); // Run only once on component mount

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error("OHNO useTheme must be used within a ThemeProvider");
//   }
  return context;
}
