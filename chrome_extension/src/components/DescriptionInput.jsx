import React, { useState, useEffect, useRef } from 'react';
import { FormControl, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '@clerk/chrome-extension';
import Requests from '../services/requests';

function DescriptionInput({ value, setValue, hideThis, setCL,...props}) {
  function getFromStorage(key, defaultValue, transformFn=JSON.parse){
    const item = localStorage.getItem(key);
    if(item)
      return transformFn(item);
    else 
      return defaultValue;
  }


  // State to store the textarea height
  const [scrapeError, setScrapeError] = useState(value.raw.length === 0);
  const [textData, setTextData] = useState(value.raw.length === 0 ? getFromStorage("scrapeData", {raw: "", employer: "", jobName: ""}) : value );
  const [loadingAPI, setLoading] = useState(false);
  const myRequester = new Requests();



  function handleCloseError(){
    setTextData("");
    setScrapeError(false);
  }
  
  async function handleCreate(){
    setLoading(true);
    const {data} = await myRequester.post("http://localhost:3000/covers/genCoverLetter", {
      company_name: textData.employer,
      job_title: textData.jobName,
      useScraper: true,
      scrapedData: textData.raw,
    });

    await chrome.downloads.download({method: "GET", url: "http://localhost:3000/covers/makeFileFromLast",  headers: [{name: "Authorization", value: await myRequester.getToken()}]});

    setCL(data);
    setValue(textData); // Needs to be the last thing, will cause a complete re-render

  }

  const labelStyle = {marginRight: ".5rem", fontSize: "12pt", minWidth: "120px", display: "inline-block"};

  if(loadingAPI){
    return (
        <div>
          <div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          <h3>Generating your Cover Letter...</h3>
        </div>
      );
  }


  return (<div>
    {
      scrapeError && (getFromStorage("scrapeData", {raw: ""}).raw.length !== 0) ? (
        <div>
            <h3 className='error'>No job data can be found.</h3>
            <button onClick={() => setScrapeError(false)} style={{fontSize: "14pt", marginRight: ".5rem"}}>Use previous data</button><button style={{fontSize: "14pt"}} onClick={handleCloseError}>Custom Input</button>
        </div>
      ) : (
        <div style={{margin: "0"}}>
          <label>
            <span style={labelStyle}>Employer name:</span>
          <FormControl
            as="input"
            type='text'
            placeholder='Enter Employer'
            style={{marginBottom: ".5rem"}}
            value={textData.employer}
            onChange={(e) => setTextData({...textData, employer: e.currentTarget.value})}
          />
          </label><br/>

          <label>
            <span style={labelStyle}>Job Title:</span>
          <FormControl
            as="input"
            type='text'
            placeholder='Enter Job Title'
            style={{marginBottom: ".5rem"}}
            value={textData.jobName}
            onChange={(e) => setTextData({...textData, jobName: e.currentTarget.value})}
          />
          </label>
          <FormControl
          as="textarea"
          id="description-textarea"
          style={{overflowY: "scroll", resize: "both", width: "400px", height: "295px"}}
          type="text"
          value={textData.raw}
          onChange={(e) => setTextData({...textData, raw: e.currentTarget.value})}
          placeholder="Enter Job Description"
        />
        <button onClick={handleCreate} style={{marginRight: "1rem", fontSize: "12pt"}}>Create</button>
        <button onClick={hideThis} style={{fontSize: "12pt"}}>Cancel</button>
        </div>
      )
    }
    </div>
  );
}

export default DescriptionInput;
