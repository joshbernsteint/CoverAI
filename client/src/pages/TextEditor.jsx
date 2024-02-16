import { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Import styles
import { useRef } from 'react';

export default function TextEditor() {
  const [editorContent, setEditorContent] = useState('');
  const quillRef = useRef(null);

  const toolbarOptions = [
    ['bold', 'italic', 'underline'],        // toggled buttons
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],   // dropdowns with defaults from theme
    [{ 'align': [] }],
    ['link', 'image']
  ];

  const handleSave = () => {
    const editorContent = quillRef.current.getEditor().root.innerHTML; //getEditor().getContents();
    console.log(editorContent);
    // Save editorContent to database or process further
  };
  
  return (
    <>
    <div>
      <ReactQuill ref={quillRef} value={editorContent} onChange={setEditorContent} modules={{ toolbar: toolbarOptions }}/>
      <button onClick={handleSave}>Save</button>
    </div>
    </>
  )
}

