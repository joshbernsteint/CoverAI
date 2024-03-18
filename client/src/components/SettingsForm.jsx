import { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { useRef, useContext } from 'react';
import CLContext from "../CLContext";



export default function SettingForm(props) {
    const [formData, setFormData] = useState({
        useDarkMode: true,
        suggestCoverLetter: true,
        autoDownloadCoverLetter: false,
        savePastResumes: true,
        savePastCoverLetters: true
      }); // will need to populate with current logged in user setting, for now hardcode
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value === 'true' ? true : false
        });
      };
    
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // here we can send the data to backend to sync settings, for now just log it
        console.log(formData);
      };
    
      return (
        <div className="flex w-full items-center justify-center"> 
       <form onSubmit={handleSubmit}>
        <div>
        <div className="form-field mb-4">
          <label className="text-xl font-bold tracking-tight text-gray-700 dark:text-white">Use Dark Mode: </label>
          <select
            name="useDarkMode"
            value={formData.useDarkMode}
            onChange={handleChange}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div className="form-field mb-4">
          <label className="text-xl font-bold tracking-tight text-gray-700 dark:text-white">Suggest Cover Letter: </label>
          <select
            name="suggestCoverLetter"
            value={formData.suggestCoverLetter}
            onChange={handleChange}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div className="form-field mb-4">
          <label className="text-xl font-bold tracking-tight text-gray-700 dark:text-white" >Auto Download Cover Letter: </label>
          <select
            name="autoDownloadCoverLetter"
            value={formData.autoDownloadCoverLetter}
            onChange={handleChange}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div className="form-field mb-4">
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
        </div>
         <br />
        <button type="submit" className="bg-primary text-white py-2 px-4 transition-all duration-300 rounded text-base hover:bg-greyishPurple">Submit</button>
      </div>
      </form>
    </div>
      );
    }
