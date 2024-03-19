import React, { useState, useEffect, useRef } from 'react';
import { FormControl } from 'react-bootstrap';

function DescriptionInput({ value, setValue, hideThis, ...props}) {
  // State to store the textarea height
  const [scrapeError, setScrapeError] = useState(value.length === 0);
  const [textData, setTextData] = useState(value.length === 0 ? localStorage.getItem('scrapeData') : value);



  function handleCloseError(){
    setTextData("");
    setScrapeError(false);
  }
  
  async function handleCreate(){
    console.log(textData);

    setValue(textData); // Needs to be the last thing, will cause a complete re-render
  }


  return (<div>
    {
      scrapeError ? (
        <div>
            <h3>No job data can be found.</h3>
            <button onClick={() => setScrapeError(false)}>Use previous data</button><button onClick={handleCloseError}>Custom Input</button>
        </div>
      ) : (
        <div>
          <FormControl
          as="textarea"
          id="description-textarea"
          style={{ height: "auto", overflowY: "scroll", resize: "both", width: "400px", height: "350px"}}
          type="text"
          value={textData}
          onChange={(e) => setTextData(e.target.value)}
          placeholder="Enter Job Description"
        />
        <button onClick={handleCreate} style={{marginRight: "1rem"}}>Create</button>
        <button onClick={hideThis}>Cancel</button>
        </div>
      )
    }
    </div>
  );
}

export default DescriptionInput;
