import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CLContext from "../CLContext";
import DocumentManager from "../services/documentManager";
import { useAuth } from "@clerk/clerk-react";

function CLForm(props) {
  const buttonRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { activeCL, setActiveCL } = useContext(CLContext);
  const toggleVisibility = (newValue = undefined) => {
    buttonRef.current.hidden =
      typeof newValue === "undefined" ? !buttonRef.current.hidden : newValue;
    formRef.current.hidden =
      typeof newValue === "undefined" ? !buttonRef.current.hidden : !newValue;
    formRef.current.reset();
  };

  const { getToken } = useAuth();

  const makeCoverLetter = async (promptContent) => {
    console.log("makeCoverLetter: ", promptContent);
    if (promptContent.length > 25) {
      try {
        const response = await axios.post(
          "https://cover-ai-server-three.vercel.app/covers/genCoverLetter",
          { scrapedData: promptContent , 
            company_name: "Doordash"
        },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );
        console.log("after post");
        const doc = response;
        console.log(doc);
        console.log(doc.data.paragraphs);
        //navigate("/text-editor/1");
        //toggleVisibility(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Prompt too short");
    }
  };

  async function handleSubmit(event) {
    console.log("submit hit");
    const target = event.currentTarget;
    const promptContent = target[0].value.trim();
    event.preventDefault();
    makeCoverLetter(promptContent);
  }

  return (
    <div className="md:px-14 px-4 py-16 max-w-screen-2xl mx-auto text-center mt-11">
      <button
        ref={buttonRef}
        className="bg-primary text-white py-2 px-4 transition-all duration-300 rounded text-2xl hover:bg-greyishPurple"
        onClick={toggleVisibility}
      >
        Make a new Cover Letter
      </button>
      <form ref={formRef} onSubmit={handleSubmit} hidden>
        <label>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Input your prompt below:
          </h2>
          <textarea
            className="max-w-screen-2xl mx-auto mt-5 mb-5"
            style={{ width: "60%", height: "200px" }}
            id="basic-input"
          />
        </label>
        <br />
        <button
          className="bg-primary text-white py-2 px-4 transition-all duration-300 rounded text-2xl hover:bg-greyishPurple mr-5"
          onClick={() => toggleVisibility(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary text-white py-2 px-4 transition-all duration-300 rounded text-2xl hover:bg-greyishPurple"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CLForm;
