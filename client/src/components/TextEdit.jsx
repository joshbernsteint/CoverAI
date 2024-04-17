import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import { useRef, useContext } from "react";
import { pdfExporter } from "quill-to-pdf";
import CLContext from "../CLContext";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useSettings } from "../context/SettingsContext"; // Import useSettings hook
import { MobileContext } from "../App";

import { toast } from "react-toastify";

import PropTypes from "prop-types";

TextEdit.propTypes = {
  id: PropTypes.string,
};

export default function TextEdit(props) {
  const { settings, setSettings } = useSettings(); // Access user settings from context
  const { getToken } = useAuth();
  const navigate = useNavigate();
  // console.log("id: ", props.id);
  const { activeCL, setActiveCL } = useContext(CLContext);
  const isMobile = useContext(MobileContext);
  const [editorContent, setEditorContent] = useState(activeCL);
  const quillRef = useRef(null);
  const checkForAutoSave = useRef(false); //on load will check if we should autosave the cover letter after that do not

  useEffect(() => {
    // Trigger save function if auto download setting is enabled
    const checkForAutoDownload = async () => {
      if (settings.auto_download_cl && !checkForAutoSave.current) {
        checkForAutoSave.current = true;
        handleSave();
      }
    };
    checkForAutoDownload();
  }, [settings.auto_download_cl]);

  useEffect(() => {
    const getEditorContent = async () => {
      //call api /covers/getCoverLetterById/:id
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + `/covers/${props.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );
        // console.log("response data", response.data);
        // for each paragraph in paragraphs array add its string to editorContent
        let temp = "";
        for (const paragraph of response.data.paragraphs) {
          temp += paragraph + "<br/>" + "<br/>";
        }
        setEditorContent(temp);
        // console.log("editorContent", editorContent);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching cover letter");
      }
    };
    getEditorContent();
  }, [props.id]);

  const toolbarOptions = [
    ["bold", "italic", "underline"], // toggled buttons
    [{ list: "ordered" }, { list: "bullet" }], // dropdowns with defaults from theme
    [{ align: [] }],
    ["link", "image"],
  ];

  const handleSave = async () => {
    const editorContent = quillRef.current.getEditor().editor.getDelta();
    const newOps = [];
    for (const item of editorContent.ops) {
      newOps.push({ ...item, insert: item.insert.replaceAll("\t", "    ") });
    }
    editorContent.ops = newOps;
    localStorage.setItem("activeCL", JSON.stringify(editorContent));
    // console.log(editorContent);
    const pdfAsBlob = await pdfExporter.generatePdf(editorContent); // converts to PDF
    saveAs(pdfAsBlob, "NEW_CL.pdf"); // downloads from the browser
    // TODO: Save editorContent to database or process further
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <ReactQuill
          ref={quillRef}
          value={editorContent}
          onChange={setEditorContent}
          modules={{ toolbar: toolbarOptions }}
          style={{ width: `${isMobile ? "90%" : "60%"}` }}
          className=""
        />
        <div className="flex flex-row justify-between">
          <button
            onClick={() => navigate("/cover-letters")}
            className="btn-outline my-4 mx-5"
          >
            Back
          </button>
          <button onClick={handleSave} className="btn my-4 mx-5">
            Save
          </button>
        </div>
      </div>
    </>
  );
}
