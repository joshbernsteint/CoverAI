import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRef, useContext } from 'react';
import CLContext from "../CLContext";

import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

export default function SettingForm(props) {
  const [formData, setFormData] = useState({
    dark_mode: true,
    suggest_cl: true,
    auto_download_cl: false,
  }); // will need to populate with current logged in user setting, for now hardcode

  const { getToken } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === 'true' ? true : false
    });
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const token = await getToken();

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get("http://localhost:3000/users/settings", {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        });

        setFormData(response.data.settings);
      } catch (error) {
        // console.error("Error occurred:", error);
        console.log("Server error occurred.");
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // here we can send the data to backend to sync settings, for now just log it
    console.log(formData);

    const token = await getToken();

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = axios.post("http://localhost:3000/users/settings", {
        settings: formData
      },
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        });

      console.log(response.data);
    } catch (error) {
      // console.error("Error occurred:", error);
      console.log("Server error occurred.");
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <form onSubmit={handleSubmit}>
        <div>
          <div className="form-field mb-4">
            <label className="text-xl font-bold tracking-tight text-gray-700 dark:text-white">Use Dark Mode: </label>
            <select
              name="dark_mode"
              value={formData.dark_mode}
              onChange={handleChange}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div className="form-field mb-4">
            <label className="text-xl font-bold tracking-tight text-gray-700 dark:text-white">Suggest Cover Letter: </label>
            <select
              name="suggest_cl"
              value={formData.suggest_cl}
              onChange={handleChange}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div className="form-field mb-4">
            <label className="text-xl font-bold tracking-tight text-gray-700 dark:text-white" >Auto Download Cover Letter: </label>
            <select
              name="auto_download_cl"
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
          <button type="submit" className="bg-primary text-white py-2 px-4 transition-all duration-300 rounded text-base hover:bg-greyishPurple">Submit</button>
        </div>
      </form>
    </div>
  );
}
