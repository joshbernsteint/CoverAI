import { useEffect, useState, useRef } from 'react';
import {Button, ButtonGroup, Dropdown} from 'react-bootstrap';
import DocumentManager from '../documentManager';
import DescriptionInput from './DescriptionInput.jsx'

export default function Home({styleSheet, userSettings, ...props}){

    const settings = userSettings.current;
    const buttonRef = useRef(null);
    const formRef = useRef(null);
    const [value, setValue] = useState("");

    async function handleOpenPreview(){
        console.log("Handling opening preview");
    }
    
    async function handleDownload(){
        console.log("Downloading pdf");
    }

  const toggleVisibility = (newValue=undefined) => {
      buttonRef.current.hidden = typeof newValue === "undefined" ? !buttonRef.current.hidden : newValue;
      formRef.current.hidden = typeof newValue === "undefined" ? !buttonRef.current.hidden : !newValue;
      formRef.current.reset();
  };

  async function handleSubmit(event){
      const target = event.currentTarget;
      const promptContent = target[0].value.trim();
      event.preventDefault();
      if(promptContent.length > 25){
          //TODO: Make API call
          // const {data} = await axios.post("http://localhost:3000/covers/genBasicLetter", {description: promptContent});
          // const docData = new DocumentManager(data);
          // console.log(doc);
          // const pdfAsBlob = await pdfExporter.generatePdf(doc); // converts to PDF
          toggleVisibility(false);
      }
      else{
          //Show error message
      }
  }


    return (
    <div className='App-header'>
      <h1>CoverAI Menu</h1>
        <Button onClick={toggleVisibility} ref={buttonRef}>Generate</Button> 
            <form ref={formRef} onSubmit={handleSubmit} hidden>
              <DescriptionInput toggleVisibility={toggleVisibility} value={value} setValue={setValue}/>
                {/* <label>
                    <h2>Input your prompt below:</h2>
                    <textarea style={{width: "60%", height: "100px", fontFamily: "sans-serif"}} id="basic-input"/>
                </label><br/>
                <button onClick={() => toggleVisibility(false)}>
                    Cancel
                </button> */}
              <button type="submit">
                  Submit
              </button>
            </form>
        <Dropdown as={ButtonGroup}>
      <Button onClick={handleOpenPreview}>Open Preview</Button>
        <Dropdown.Toggle split id="dropdown-split-basic" />
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleDownload}>Download</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      </div>
    );
};