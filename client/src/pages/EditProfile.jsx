import React from "react";
import { useState, useEffect } from "react";

import UploadFile from "../components/UploadFile";
import UserForm from "../components/UserForm";
import FormFilled from "../components/FormFilled";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export default function EditProfile() {
  const { getToken } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  //will be used for dropdown menu later


  const [resumeFile, setResumeFile] = useState(null);
  const [resumes, setResumes] = useState([]);

  // Function to handle successful file upload
  const handleUploadSuccess = (file) => {
    setResumeFile(file);
    setUploadSuccess(true);
  };

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/resumes/all",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );

        setResumes(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching resumes");
      }
    };
    fetchResumes();
  }, []);

  return (
    <>
      <div className="flex justify-center min-h-screen dark:bg-background_dark">
        <div className="p-12 w-full">
          <div className="flex justify-center text-3xl font-semibold mb-4 mt-11">
            <h1>
              {uploadSuccess
                ? "Your resume has been successfully uploaded!"
                : "Get started by filling out your profile"}
            </h1>
          </div>

          <div className="flex justify-center items-center">
            {!uploadSuccess && (
              <UploadFile onUploadSuccess={handleUploadSuccess} />
            )}
            {!uploadSuccess && <UserForm />}
            {uploadSuccess && resumeFile && (
              <div className="flex flex-col items-center justify-center">
                <embed
                  src={resumeFile}
                  type="application/pdf"
                  width="400"
                  height="600"
                />
                <button className="btn-outline w-[100px] my-2" onClick={() => setUploadSuccess(false)}>Back</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
