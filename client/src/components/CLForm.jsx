import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CLContext from "../CLContext";
import DocumentManager from "../services/documentManager";
import { useAuth } from "@clerk/clerk-react";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import { useSettings } from '../context/SettingsContext'; // Import useSettings hook

function CLForm(props) {
  const { settings, setSettings } = useSettings(); // Access user settings from context
  const buttonRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { activeCL, setActiveCL } = useContext(CLContext);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(""); // State to hold company value
  const [role, setRole] = useState(""); // State to hold role value

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
          import.meta.env.VITE_API_URL+"/covers/",
          {
            company_name: company, // Use state value for company
            job_title: role, // Use state value for role
            useResume: true,
            resume_id: "1",
            useScraper: false,
            scrapedData: promptContent,
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
        if(settings.auto_download_cl) { 
          navigate(`/text-editor/${doc.data._id}`); // Redirect to download page
        }
        //navigate("/text-editor/1");
        //toggleVisibility(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Prompt too short");
      console.log("prompt: ", promptContent)
      setError(
        "Prompt too short. Please be more descriptive on what you want your cover letter to be about."
      );
    }
  };

  async function handleSubmit(event) {
    console.log("submit hit");
    const target = event.currentTarget;
    const promptContent = target[2].value.trim();
    event.preventDefault();
    makeCoverLetter(promptContent);
  }

  return (
    <div className="md:px-14 px-4 max-w-screen-2xl mx-auto text-center dark:bg-background_dark">
      <button ref={buttonRef} className="btn mt-11" onClick={toggleVisibility}>
        Make a new Cover Letter
      </button>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        hidden
        className="bg-indigo-50 dark:bg-midGrey rounded-lg p-4"
      >
        <label>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
            Company:
          </h2>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="max-w-screen-2xl mx-auto mt-2 mb-2 dark:text-black"
          />
        </label>
        <label>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
            Role:
          </h2>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="max-w-screen-2xl mx-auto mt-2 mb-2 dark:text-black"
          />
        </label>
        <label>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
            Input your prompt below:
          </h2>
          <textarea
            className="max-w-screen-2xl mx-auto mt-2 mb-2 dark:text-black"
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
              onClick={() => {
                toggleVisibility(false);
                setError(null);
              }}
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