import React, { useState, useEffect, useRef } from 'react';
import { FormControl } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

function DescriptionInput({toggleVisibility, value, setValue}) {
  // State to store the textarea height
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const [scrapeError, setScrapeError] = useState(true);
  const textareaRef = useRef(null);

  async function scrapeJobPosting() {
    const [tab] = await window.chrome.tabs.query({active: true, lastFocusedWindow: true});
    const {status, content} = await window.chrome.tabs.sendMessage(tab.id, {action: "scrape"});
    if (status === "Not Found") {
      //setScrapeError(false);
    } else {
      setValue(content.trim());
    }
  }

  function updateResponse(newValue) {
    setScrapeError(true);
    setValue(newValue);
  }

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

  return (<div>
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
      <Button onClick={() => toggleVisibility(false)}>cancel</Button>
      <p hidden={scrapeError}>Error: could not find job description</p>
    </div>
  );
}

export default DescriptionInput;
