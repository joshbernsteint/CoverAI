import React from "react";
import { Card, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Requests from "../services/requests";
import { useAuth } from "@clerk/clerk-react";
import { FiTrash, FiChevronRight } from "react-icons/fi";
import { Modal } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const CLCards = () => {
  const { getToken } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [coverIdToDelete, setCoverIdToDelete] = useState(null); // Changed to null to indicate no cover ID to delete

  const [coverLetters, setCoverLetters] = useState(undefined);
  useEffect(() => {
    const fetchCoverLetters = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/covers/all",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );
        console.log(response.data);
        if(response.data)
          setCoverLetters(response.data.reverse());
      } catch (error) {
        console.error(error);
      }
    };
    fetchCoverLetters();
  }, [coverIdToDelete]);

  const handleDeleteCoverLetter = (event, coverId) => {
    setOpenModal(true);
    setCoverIdToDelete(coverId); 
  };

  const handleDeleteCoverLetterConfirmed = async () => {
    console.log("Deleting cover letter with ID confirmed: ", coverIdToDelete);

    //TODO: api call to delete cover letter
    try {
      console.log("coverIDToDelete: ", coverIdToDelete)
      const response = await axios.delete(
        import.meta.env.VITE_API_URL+ `/covers/${coverIdToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      console.log("response data", response.data);
      console.log("after deleter")
      setCoverIdToDelete(null);
    } catch (error) {
      console.log("Error deleting cover letter with id: ", coverIdToDelete)
      console.error(error);
    }
    setOpenModal(false);
  };

  const navigate = useNavigate();

  return (
    <div className="md:px-14 px-4 py-16 max-w-screen-2xl mx-auto text-center mt-11">
      <h1 className="font-bold text-3xl"> 
        Your Past Cover Letters 
        {/* add count of cover letters */}
        { coverLetters ? `(${coverLetters.length})` : "" }
      </h1>
      <div className="mt-4">
        {coverLetters ? (
          coverLetters.map((cover, i) => (
            <Card
              // href={`text-editor/${cover._id}`}
              className="cl-card max-w px-4 mt-4 justify-between -z-10"
              key={i}
              onClick={() => navigate(`../text-editor/${cover._id}`)}
              style={{cursor: "pointer"}}
            >
              <div className="flex items-center justify-between">
                <div>
                  <FiChevronRight className="text-3xl" />
                </div>
                <div>
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {cover.company_name !== null
                      ? cover.company_name
                      : "Untitled"}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Created: {cover.date}
                  </p>
                </div>
                <div>
                  <button
                    className="z-10 hover:text-red-500 p-2 relative rounded-full"
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      handleDeleteCoverLetter(event, cover._id);
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
      </div>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Delete Cover Letter</Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this cover letter?
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => setOpenModal(false)} className="btn-outline border-black text-black">Cancel</button>
          <button onClick={handleDeleteCoverLetterConfirmed} className="btn bg-red-500 border-red-500">
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CLCards;
