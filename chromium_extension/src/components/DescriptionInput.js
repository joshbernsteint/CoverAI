import React, { useState, useEffect, useRef } from 'react';
import { FormControl } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

function DescriptionInput({hidden, displayTextbox}) {
  // State to store the textarea height
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const [scrapeError, setScrapeError] = useState(true);
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);
  
  async function scrapeJobPosting() {
    const [tab] = await window.chrome.tabs.query({active: true, lastFocusedWindow: true});
    const {status, content} = await window.chrome.tabs.sendMessage(tab.id, {action: "scrape"});
    if (status === "Not Found") {
      setScrapeError(false);
    } else {
      setValue(content);
    }
  }

  function updateResponse(newValue) {
    setScrapeError(true);
    setValue(newValue);
  }
  
  // Adjust the height of the textarea based on its scroll height
  // const adjustHeight = (textArea) => {
  //   setTextareaHeight("auto");
  //   setTextareaHeight(`${textArea.scrollHeight}px`);
  // };

  useEffect(() => {
    // This function adjusts the textarea height
    function adjustHeight() {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Temporarily shrink to fit content
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height based on scroll height
      }
    }
    adjustHeight();
  }, [value]);

  return (<div hidden={hidden}>
      <FormControl
        as="textarea"
        id="description-textarea"
        ref={textareaRef}
        style={{ height: textareaHeight, overflow: "hidden", resize: "both"}}
        type="text"
        value={value}
        onChange={(e) => updateResponse(e.target.value)}
        placeholder="Enter Job Description"
      />
      <Button onClick={scrapeJobPosting}>scan webpage</Button>
      <Button onClick={displayTextbox}>close</Button>
      <p hidden={scrapeError}>Error: could not find job description</p>
    </div>
  );
}

export default DescriptionInput;
