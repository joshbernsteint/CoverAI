import {
  // useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import CLContext from "../CLContext";
import DocumentManager from "../services/documentManager";
import { useAuth } from "@clerk/clerk-react";
import { HiInformationCircle } from "react-icons/hi";
// import { Alert } from "flowbite-react";
import { useSettings } from "../context/SettingsContext"; // Import useSettings hook
import { toast } from "react-toastify";

import PropTypes from "prop-types";

CLForm.propTypes = {
  addedCoverLetter: PropTypes.object,
  setAddedCoverLetter: PropTypes.func,
};

function CLForm({ setAddedCoverLetter }) {
  const { settings, setSettings } = useSettings(); // Access user settings from context
  const buttonRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  // const { activeCL, setActiveCL } = useContext(CLContext);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(""); // State to hold company value
  const [role, setRole] = useState(""); // State to hold role value
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/resumes/all",
          {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );
        setResumes(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch resumes");
      }
    };
    fetchResumes();
    // eslint-disable-next-line
  }, []);

  const toggleVisibility = (newValue = undefined) => {
    buttonRef.current.hidden =
      typeof newValue === "undefined" ? !buttonRef.current.hidden : newValue;
    formRef.current.hidden =
      typeof newValue === "undefined" ? !buttonRef.current.hidden : !newValue;
    formRef.current.reset();
    if (selectedResume !== "none" && resumes.length > 0) {
      setSelectedResume(resumes[0]._id);
    }
  };

  const { getToken } = useAuth();

  const makeCoverLetter = async (promptContent) => {
    console.log("makeCoverLetter: ", promptContent);
    let use_scraper =
      (resumes.length === 0 ? true : false) ||
      (selectedResume === "none" ? true : false);
    let use_resume =
      (resumes.length === 0 ? false : true) &&
      (selectedResume === "none" ? false : true);

    if (
      (use_scraper === true && promptContent.length > 25) ||
      use_resume === true
    ) {
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_URL + "/covers/",
          {
            company_name: company, // Use state value for company
            job_title: role, // Use state value for role
            useResume: use_resume,
            resume_id: selectedResume,
            useScraper: use_scraper,
            scrapedData: promptContent,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );
        // console.log("after post");
        const doc = response;
        console.log(doc);
        // console.log(doc.data.paragraphs);
        if (settings.auto_download_cl) {
          navigate(`/text-editor/${doc.data._id}`); // Redirect to download page
        }
        //navigate("/text-editor/1");
        setAddedCoverLetter(doc.data);
        toast.success("Cover letter created successfully");
        toggleVisibility(false);
        setTimeout(() => {
          setAddedCoverLetter(null);
        }, 5000);
      } catch (error) {
        console.error(error);
        toast.error("Failed to create cover letter");
      }
    } else {
      console.log("Prompt too short");
      console.log("prompt: ", promptContent);
      setError(
        "Prompt too short. Please be more descriptive on what you want your cover letter to be about."
      );
    }
  };

  async function handleSubmit(event) {
    console.log("submit hit");
    const target = event.currentTarget;
    const promptContent = target[3].value.trim();
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
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Company:
          </h2>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="max-w-screen-2xl mx-auto mt-2 mb-2 rounded-md dark:text-white dark:bg-background_dark/20"
          />
        </label>
        <label>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Role:
          </h2>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="max-w-screen-2xl mx-auto mt-2 mb-2 rounded-md dark:text-white dark:bg-background_dark/20"
          />
        </label>
        <aria-label htmlFor="select-res" hidden>
          Select res
        </aria-label>
        <div id="select-res">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Select a resume:
          </h2>
          {resumes.length > 0 ? (
            <select
              className=" max-w-[100%] mx-auto mt-2 mb-2 rounded-md dark:text-white dark:bg-background_dark/20"
              style={{ width: "auto" }}
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
            >
              <option
                className=" text-black dark:text-white dark:bg-background_dark/20"
                value={"none"}
              >
                Write a prompt...
              </option>
              {resumes.length > 0 &&
                resumes.map((resume) => {
                  if (resume.resumeType === "pdf") {
                    return (
                      <option
                        className=" text-black dark:text-white dark:bg-background_dark/20"
                        key={resume._id}
                        value={resume._id}
                      >
                        {resume.pdfName}
                      </option>
                    );
                  } else {
                    return (
                      <option
                        className=" text-black dark:text-white dark:bg-background_dark/20"
                        key={resume._id}
                        value={resume._id}
                      >
                        {`Resume_${resume.created}`}
                      </option>
                    );
                  }
                })}
            </select>
          ) : (
            <div className="max-w-[100%] mx-auto mt-2 mb-2 rounded-md">
              <p className="align-center px-2">No resumes found.</p>
              <div>
                <button
                  className="btn"
                  onClick={() => navigate("/edit-profile")}
                >
                  Add a resume
                </button>
              </div>
            </div>
          )}
        </div>
        <label>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Input your prompt below:
          </h2>
          <textarea
            className="max-w-screen-2xl mx-auto mt-2 mb-2 rounded-md dark:text-white dark:bg-background_dark/20"
            style={{ width: "80%", height: "200px" }}
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
