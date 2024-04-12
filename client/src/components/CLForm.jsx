import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CLContext from "../CLContext";
import DocumentManager from "../services/documentManager";
import { useAuth } from "@clerk/clerk-react";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";

function CLForm(props) {
  const buttonRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { activeCL, setActiveCL } = useContext(CLContext);
  const [error, setError] = useState(null);

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
          import.meta.env.VITE_API_URL+"/covers/genCoverLetter",
          { scrapedData: promptContent, company_name: "Doordash" },
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
      setError("Prompt too short. Please be more descriptive on what you want your cover letter to be about.");
      
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
    <div className="md:px-14 px-4 max-w-screen-2xl mx-auto text-center mt-11">
      {error && (
        <Alert color="failure" icon={HiInformationCircle} className="my-10 transition-opacity">
          <span className="font-medium">Alert!</span> {error}
        </Alert>
      )}
      <button ref={buttonRef} className="btn" onClick={toggleVisibility}>
        Make a new Cover Letter
      </button>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        hidden
        className="bg-indigo-50 rounded-lg p-4"
      >
        <label>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
            Input your prompt below:
          </h2>
          <textarea
            className="max-w-screen-2xl mx-auto mt-5 mb-5"
            style={{ width: "60%", height: "200px" }}
            id="basic-input"
          />
        </label>
        <br />
        <div className="flex justify-center gap-12">
          <div>
            <button
              className="btn-outline"
              type="button"
              onClick={() => 
                {toggleVisibility(false)
                setError(null)}
              }
            >
              Cancel
            </button>
          </div>
          <div>
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CLForm;
