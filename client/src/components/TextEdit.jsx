import { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Import styles
import { useRef, useContext } from 'react';
import { pdfExporter } from 'quill-to-pdf';
import CLContext from "../CLContext";

import { saveAs } from 'file-saver';
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from 'react';

export default function TextEdit(props) {
  const { getToken } = useAuth();
  console.log("id: ", props.id);
  const {activeCL, setActiveCL} = useContext(CLContext);
  const [editorContent, setEditorContent] = useState(activeCL);
  const quillRef = useRef(null);

  useEffect(() => {
    const getEditorContent = async () => {
      //call api /covers/getCoverLetterById/:id
      try {
        const response = await axios.get(
          `https://cover-ai-server-three.vercel.app/covers/getCoverLetterById/${props.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );
        console.log("response data", response.data);
        // for each paragraph in paragraphs array add its string to editorContent
        let temp = ""
        for (const paragraph of response.data.paragraphs) {
          temp += paragraph + "<br/>" + "<br/>";
        }
        setEditorContent(temp);
        console.log("editorContent", editorContent);
      } catch (error) {
        console.error(error);
      }
    };
    getEditorContent();
  }, [props.id]);
  

  const toolbarOptions = [
    ['bold', 'italic', 'underline'],        // toggled buttons
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],   // dropdowns with defaults from theme
    [{ 'align': [] }],
    ['link', 'image']
  ];

  const handleSave = async  () => {
    const editorContent = quillRef.current.getEditor().editor.getDelta();
    const newOps = [];
    for (const item of editorContent.ops) {
      newOps.push({...item, insert: item.insert.replaceAll("\t", "    ")});
    }
    editorContent.ops = newOps;
    localStorage.setItem('activeCL', JSON.stringify(editorContent));
    console.log(editorContent);
    const pdfAsBlob = await pdfExporter.generatePdf(editorContent); // converts to PDF
    saveAs(pdfAsBlob, 'NEW_CL.pdf'); // downloads from the browser
    // TODO: Save editorContent to database or process further
  };

  return (
    <>
    <div>
      <ReactQuill ref={quillRef} value={editorContent} onChange={setEditorContent} modules={{ toolbar: toolbarOptions }}/>
      <div>
        <button onClick={handleSave} className="bg-primary text-white py-2 px-4 transition-all duration-300 rounded text-base hover:bg-greyishPurple">
            Save
        </button>
      </div>
    </div>
    </>
  )
}

