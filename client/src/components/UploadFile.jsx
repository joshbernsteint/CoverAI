import React from "react";
import { useAuth } from '@clerk/clerk-react';
import { FileInput, Label } from "flowbite-react";
import { useState } from "react";

import axios from "axios";

export default function UploadFile({ onUploadSuccess }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [extractedText, setExtractedText] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const token = await getToken();

    const formData = new FormData();
    formData.append("file", file);
    console.log("formData", formData);

    const fileURL = URL.createObjectURL(file);
    console.log("fileURL", fileURL);
    onUploadSuccess(fileURL);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      console.log("Uploading file to database...");
      const response = await axios.post(
        "https://cover-ai-server-three.vercel.app/resumes",
        file,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File", file);
      console.log("type", typeof file);
      console.log(response.status);
      console.log(response);
      setExtractedText(response.data.extractedText);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div
      id="left-resume"
      className="w-2/4 flex justify-center items-center border-r-2"
    >
      <div className="text-center">
        <div className="flex w-full items-center justify-center">
          <Label
            htmlFor="dropzone-file"
            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5 px-4">
              <svg
                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF, DOCX, DOC, TXT
              </p>
            </div>
            <FileInput
              id="dropzone-file"
              accept=".pdf,.docs,.doc"
              className="hidden"
              onChange={handleFileUpload}
            />
          </Label>
        </div>
      </div>
    </div>
  );
}
