import { useState, useEffect} from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRef, useContext } from 'react';
import CLContext from "../CLContext";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext"; // Import the AuthContext hook




export default function SettingForm(props) {
  //const { authToken } = useAuthContext(); // Get authToken from AuthContext 
  const { authToken } = {};
  const [formData, setFormData] = useState({
    dark_mode: true,
    suggest_cl: true,
    auto_download_cl: false,
    save_resumes: true,
    save_cl: true,
  }); // will need to populate with current logged in user setting, for now hardcode



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/settings', {
          headers: {
            Authorization: `Bearer ${authToken}` // Include authToken in the request headers
          }
        });
        const data = response.data;

        setFormData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the function to fetch data when component mounts
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === 'true' ? true : false
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      //await axios.post('http://localhost:3000/settings', formData);
      await axios.post('http://localhost:3000/settings', formData, {
        headers: {
          Authorization: `Bearer ${authToken}` // Include authToken in the request headers
        }
      });
      // refetch data to make sure updated 
      const response = await axios.get('http://localhost:3000/settings', {
        headers: {
          Authorization: `Bearer ${authToken}` // Include authToken in the request headers
        }
      });
      const updatedData = response.data;
      setFormData(updatedData);
      console.log("Settings updated successfully!");
    } catch (error) {
      console.error('Error updating settings:', error);
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
          <div className="form-field mb-4">
            <label className="text-xl font-bold tracking-tight text-gray-700 dark:text-white" >Save Past Resumes: </label>
            <select
              name="save_resumes"
              value={formData.save_resumes}
              onChange={handleChange}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div className="form-field mb-4">
            <label className="text-xl font-bold tracking-tight text-gray-700 dark:text-white" >Save Past Cover Letters: </label>
            <select
              name="save_cl"
              value={formData.save_cl}
              onChange={handleChange}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <br />
          <button type="submit" className="bg-primary text-white py-2 px-4 transition-all duration-300 rounded text-base hover:bg-greyishPurple">Submit</button>
        </div>
      </form>
    </div>
  );
}
