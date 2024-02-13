import { useEffect } from 'react';
import {Button, ButtonGroup, Dropdown} from 'react-bootstrap';


export default function Home({styleSheet, userSettings, ...props}){

    const settings = userSettings.current;

    async function handleOpenPreview(){
        console.log("Handling opening preview");
    }
    
    async function handleDownload(){
        console.log("Downloading pdf");
    }



    return (
    <div className='App-header'>
      <h1>CoverAI Menu</h1>
        <Button>Generate</Button>
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