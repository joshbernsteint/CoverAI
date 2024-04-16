import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRef } from 'react';
import axios from 'axios';

const SettingsContext = createContext();
import { useAuth } from '@clerk/clerk-react';
export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    // Default settings
    dark_mode: true,
    auto_download_cl: true,
    // add more settings as needed
  });

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      const token = await getToken();

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/users/settings", {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        });

        //setFormData(response.data.settings);
        // console.log(response.data.settings)
        setSettings(response.data.settings);
      } catch (error) {
        console.log(error);
        //just leave default it cant make call
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
