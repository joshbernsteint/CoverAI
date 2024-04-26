import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { FileInput, Label } from "flowbite-react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function UploadFile({ onUploadSuccess, handleAddedResume }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [extractedText, setExtractedText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const token = await getToken();

    const formData = new FormData();
    formData.append("file", file);
    console.log("formData", formData);

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    setIsLoading(true);
    try {
      console.log("Uploading file to database...");
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/resumes",
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const fileURL = URL.createObjectURL(file);
      // console.log("fileURL", fileURL);
      onUploadSuccess(fileURL);
      handleAddedResume(response.data);

      // console.log("File", file);
      // console.log("type", typeof file);
      // console.log(response.status);
      // console.log(response);
      toast.success("File uploaded successfully");
      setExtractedText(response.data.extractedText);
      setIsLoading(false);
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Error uploading file");
      setIsLoading(false);
    }
  };

  return (
    <div
      id="left-resume"
      className="w-full sm:w-2/4 flex justify-center items-center sm:border-r-2 sm:mb-0"
    >
      <div className="text-center ">
        <div className="flex w-full items-center justify-center ">
          <Label
            htmlFor="dropzone-file"
            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            {!isLoading ? (
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
            ) : (
              <div className="flex flex-col items-center justify-center pb-6 pt-5 px-[5rem]">
                <div className="loader-orbit"></div>
                <p className="loading-text text-sm text-gray-500 dark:text-gray-400">
                  Uploading...
                </p>
              </div>
            )}
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
