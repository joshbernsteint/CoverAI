import React, { useState, useEffect, useRef } from 'react';
import { FormControl, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';




const formStyle = 'p-2 dark:bg-midGrey text-black dark:text-white rounded-md border-2';
const buttonStyle ="bg-transparent border-2 border-midPurple dark:bg-[#1a1a1a] text-midPurple dark:text-white";


function DescriptionInput({settings, requester, value, setValue, hideThis, setCL,...props}) {
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
  const [resumeData, setResumeData] = useState([]);
  const [selectedResume, setSelectedResume] = useState(undefined);
  const navigate = useNavigate();


  useEffect(() => {
    async function getResumeData(){
      const {data} = await requester.get('/resumes/all');
      setResumeData(data);
      setSelectedResume(data.length > 0 ? data[0]._id : undefined);
    }
    getResumeData();
  }, []);

  function handleCloseError(){
    setTextData("");
    setScrapeError(false);
  }
  
  async function handleCreate(){
    setLoading(true);
    console.log(selectedResume);
    try {
      const {data} = await requester.post("/covers/", {
        company_name: textData.employer,
        job_title: textData.jobName,
        useResume: selectedResume !== "none",
        resume_id: selectedResume,
        useScraper: true,
        scrapedData: textData.raw,
      });

      setCL(data);
      setValue(textData);
    } catch (error) {
      setLoading(false);
    }

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
            <h3 className='text-fullRed text-xl'>No job data can be found.</h3>
            <button onClick={() => setScrapeError(false)} style={{fontSize: "14pt", marginRight: ".5rem"}} className={buttonStyle}>Use previous data</button>
            <button style={{fontSize: "14pt"}} onClick={handleCloseError} className={buttonStyle}>Custom Input</button>
        </div>
      ) : (
        <div style={{margin: "0"}}>
          <label className='m-4'>
            <span style={labelStyle}>Employer name:</span>
          <FormControl
            as="input"
            type='text'
            placeholder='Enter Employer'
            className={formStyle}
            value={textData.employer}
            onChange={(e) => setTextData({...textData, employer: e.currentTarget.value})}
          />
          </label><br/><br/>

          <label className='m-4'>
            <span style={labelStyle}>Job Title:</span>
          <FormControl
            as="input"
            type='text'
            className={formStyle}
            placeholder='Enter Job Title'
            value={textData.jobName}
            onChange={(e) => setTextData({...textData, jobName: e.currentTarget.value})}
          />
          </label><br/>
          <FormControl
          as="textarea"
          id="description-textarea"
          className={`p-2 m-4 w-[400px] h-[200px] ${formStyle}`}
          type="text"
          value={textData.raw}
          onChange={(e) => setTextData({...textData, raw: e.currentTarget.value})}
          placeholder="Enter Job Description"
        /><br/>
        <button onClick={handleCreate} style={{fontSize: "12pt"}} className={buttonStyle}>Create</button>
        {
          resumeData.length === 0 ? <button className={buttonStyle} style={{fontSize: "12pt", color: "red", margin: "1rem"}} onClick={() => navigate('/settings')}>No Resumes Found</button> : (
            <select
            className="max-w-[100%] mx-auto m-2 rounded-md border-2 p-3 dark:text-white dark:bg-background_dark/20"
            style={{ width: "auto" }}
            value={selectedResume}
            onChange={(e) => setSelectedResume(e.target.value)}
            >
                <option value={"none"} className=" text-black dark:text-white dark:bg-background_dark/20" >None</option>
                {
                  resumeData.map((resume) => {
                    if (resume.resumeType === "pdf") {
                      return (
                        <option
                          className=" text-black dark:text-white dark:bg-background_dark/20"
                          key={resume._id}
                          value={resume._id}
                        >
                          {resume.pdfName}
                        </option>
                      );
                    } else {
                      return (
                        <option
                          className=" text-black dark:text-white dark:bg-background_dark/20"
                          key={resume._id}
                          value={resume._id}
                        >
                          {`Resume_${resume.created}`}
                        </option>
                      );
                    }
                  })
                }
            </select>
          )
        }
        <button onClick={hideThis} style={{fontSize: "12pt"}} className={buttonStyle}>Cancel</button>
        </div>
      )
    }
    </div>
  );
}

export default DescriptionInput;
