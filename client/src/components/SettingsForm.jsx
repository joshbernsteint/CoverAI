import { useState, useEffect } from "react";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useContext } from "react";
// import CLContext from "../CLContext";

import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "../App";
import { useSettings } from "../context/SettingsContext"; // Import useSettings hook

export default function SettingForm() {
  const { settings, setSettings } = useSettings(); // Access user settings from context

  const [isDarkMode, setIsDarkMode] = useContext(Context);

  const [formData, setFormData] = useState({
    dark_mode: isDarkMode,
    auto_download_cl: false,
  }); // will need to populate with current logged in user setting, for now hardcode

  const { getToken } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "true" ? true : false,
    });
    setSettings({
      ...settings,
      [name]: value === "true" ? true : false,
    });
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const token = await getToken();

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      // console.log(import.meta.env.VITE_API_URL + "/users/settings")
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

        // console.log(response.data.settings)
        if (response.data.settings.dark_mode === true) {
          localStorage.setItem("theme", "dark");
        } else {
          localStorage.setItem("theme", "light");
        }
        setSettings(response.data.settings);
        if (response.data.settings.dark_mode) {
          setIsDarkMode(true);
        }
        setFormData({
          dark_mode: response.data.settings
            ? response.data.settings.dark_mode
            : true,
          auto_download_cl: response.data.settings
            ? response.data.settings.auto_download_cl
            : true,
        });
      } catch (error) {
        // console.error("Error occurred:", error);
        //console.log("Server error occurred.");
        toast.error("Server error occurred.");
      }
    };

    fetchSettings();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // here we can send the data to backend to sync settings, for now just log it
    // console.log(settings);

    const token = await getToken();

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/users/settings",
        {
          settings: settings,
        },
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("first response: ", response.data);

      //refetch updated settings
      const response1 = await axios.get(
        import.meta.env.VITE_API_URL + "/users/settings",
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );

      if (response1.data.settings.dark_mode === true) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }

      setIsDarkMode(response1.data.settings.dark_mode);
      setSettings(response.data.settings);
      setFormData({
        dark_mode: response.data.settings
          ? response.data.settings.dark_mode
          : true,
        auto_download_cl: response.data.settings
          ? response.data.settings.auto_download_cl
          : true,
      });

      toast.success("Settings updated successfully.");
    } catch (error) {
      toast.error("Server error occurred.");
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <form onSubmit={handleSubmit}>
        <div>
          <div className="form-field mb-4">
            <label className="text-xl font-bold tracking-tight text-gray-700 dark:text-white">
              Use Dark Mode:{" "}
            </label>
            <select
              name="dark_mode"
              className="font-body rounded-md dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              value={formData.dark_mode}
              onChange={handleChange}
            >
              <option value="true" className="font-body">
                True
              </option>
              <option value="false">False</option>
            </select>
          </div>
          <div className="form-field mb-4">
            <label className="text-xl font-bold tracking-tight text-gray-700 dark:text-white">
              Auto Download Cover Letter:{" "}
            </label>
            <select
              name="auto_download_cl"
              className="font-body rounded-md dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              value={formData.auto_download_cl}
              onChange={handleChange}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          {/* <div className="form-field mb-4">
            <label className="text-xl font-bold tracking-tight text-gray-700 dark:text-white" >Save Past Resumes: </label>
            <select
              name="savePastResumes"
              value={formData.savePastResumes}
              onChange={handleChange}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div className="form-field mb-4">
            <label className="text-xl font-bold tracking-tight text-gray-700 dark:text-white" >Save Past Cover Letters: </label>
            <select
              name="savePastCoverLetters"
              value={formData.savePastCoverLetters}
              onChange={handleChange}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div> */}
          <br />
          <button type="submit" className="btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
