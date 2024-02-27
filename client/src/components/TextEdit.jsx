import { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Import styles
import { useRef } from 'react';

export default function TextEdit(props) {
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
//   quillRef.current.getEditor().root.innerHTML = props.id;
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

