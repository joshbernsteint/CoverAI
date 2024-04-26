import React from "react";
import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import UploadFile from "../components/UploadFile";
import UserForm from "../components/UserForm";
import { FiTrash, FiChevronRight } from "react-icons/fi";
import { Modal } from "flowbite-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { MobileContext } from "../App";

export default function EditProfile() {
  const { getToken } = useAuth();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const isMobile = React.useContext(MobileContext);
  const [openModal, setOpenModal] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [resumeIdToDelete, setResumeIdToDelete] = useState(null);

  // Function to handle successful file upload
  const handleUploadSuccess = (file) => {
    setResumeFile(file);
    setUploadSuccess(true);
  };

  const handleAddedResume = (resume) => {
    setResumes([resume, ...resumes]);
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

        setResumes(response.data.reverse());
      } catch (error) {
        console.error(error);
        toast.error("Error fetching resumes");
      }
    };
    fetchResumes();
    // eslint-disable-next-line
  }, []);

  const handleDeleteResume = async (event, resumeId) => {
    setOpenModal(true);
    setResumeIdToDelete(resumeId);
  }

  const handleDeleteResumeConfirmed = async () => {
    try {
      const response = await axios.delete(
        import.meta.env.VITE_API_URL + `/resumes/${resumeIdToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (response) {
        setResumes(resumes.filter((resume) => resume._id !== resumeIdToDelete));
      } else {
        toast.error("Error deleting resume");
      }
      setResumeIdToDelete(null);
      setOpenModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Error deleting resume");
    }
  }

  return (
    <>
      <div className="flex flex-col text-center items-center min-h-screen max-w-screen-2xl mx-auto dark:bg-background_dark">
        <div className="p-12 w-full">
          <div className="flex justify-center text-3xl font-semibold mb-4 mt-11">
            <h1>
              {uploadSuccess
                ? "Your resume has been successfully uploaded!"
                : "Get started by filling out your profile"}
            </h1>
          </div>

          <div className="flex justify-center items-center">
            {!isMobile && !uploadSuccess && (
              <UploadFile onUploadSuccess={handleUploadSuccess} handleAddedResume={handleAddedResume} />
            )}
            {!isMobile && !uploadSuccess && <UserForm />}
            {isMobile && !uploadSuccess && (
              <div className="flex flex-col items-center justify-between w-full m-0">
                <UploadFile onUploadSuccess={handleUploadSuccess} />
                <UserForm />
              </div>
            )}
            {uploadSuccess && resumeFile && (
              <div className="flex flex-col items-center justify-center">
                <embed
                  src={resumeFile}
                  type="application/pdf"
                  width="400"
                  height="600"
                />
                <button
                  className="btn-outline w-[100px] my-2"
                  onClick={() => setUploadSuccess(false)}
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
        {!uploadSuccess && <div className="mt-4 mb-16 w-full">
          {resumes ? (
            resumes.map((resume, i) => (
              <Card
                className="cl-card px-4 mt-4 mx-4 md:mx-12 justify-between z-10"
                key={`resume-${i}-${resume._id}`}
                style={{ cursor: "pointer" }}
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <FiChevronRight className="text-3xl" />
                  </div>
                  <div className="overflow-x-hidden">
                    <h5 className="text-lg font-bold tracking-tight md:text-2xl text-gray-900 dark:text-white">
                      {resume.pdfName !== null
                        ? resume.pdfName
                        : `Resume_${resume.created}`}
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                      Created: {resume.created}
                    </p>
                  </div>
                  <div>
                    <button
                      className="z-10 hover:text-red-500 p-2 relative rounded-full"
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        handleDeleteResume(event, resume._id);
                      }}
                    >
                      <FiTrash className="text-3xl" />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="loader-orbit"></div>
            </div>
          )}
        </div>}
        <Modal show={openModal} onClose={() => setOpenModal(false)} className="backdrop-blur-lg dark:bg-background_dark/70">
          <Modal.Header className="">Delete Resume</Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this resume?
          </Modal.Body>
          <Modal.Footer>
            <button onClick={() => setOpenModal(false)} className="btn-outline border-black text-black hover:border-gray-300 hover:text-gray-300 transition-colors duration-100">Cancel</button>
            <button onClick={handleDeleteResumeConfirmed} className="btn bg-red-500 border-red-500 hover:bg-red-800 hover:border-red-800 transition-colors duration-100">
              Delete
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
