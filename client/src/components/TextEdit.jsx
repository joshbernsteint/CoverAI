import { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Import styles
import { useRef, useContext } from 'react';
import { pdfExporter } from 'quill-to-pdf';
import CLContext from "../CLContext";

import { saveAs } from 'file-saver';

export default function TextEdit(props) {


  const {activeCL, setActiveCL} = useContext(CLContext);
  const [editorContent, setEditorContent] = useState(activeCL);
  const quillRef = useRef(null);

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

