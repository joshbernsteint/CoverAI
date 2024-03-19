import { useState } from "react";
import DescriptionInput from "./DescriptionInput";
import scrapeWebsite from "../services/scrapeWebsite";
import parseScraper from "../services/parseScraper";



function Home({scrapeData, setScrape, activeCL, setCL, ...props}){


    const [showScanner, setShowScanner] = useState(false);
    const enableScannerInput = async () => {  
        setScrape({raw: parseScraper(await scrapeWebsite()), 
            jobName: "",
            employer: "",
        }); 
        setShowScanner(true);
    };
    const disableScannerInput = () => setShowScanner(false);

    function returnToDefault(){
        setCL(undefined);
        disableScannerInput();
    }

    return (
        <div>
            <h1 style={{margin: ".1rem"}}>CoverAI Chrome</h1>
            {/* TODO: Change link */}
            <h4>Visit our <a href="https://www.youtube.com/watch?v=OfOA4RKgIlA" target="_blank">Website</a> for even more features!</h4>
            <div>
                {
                    activeCL ? (
                        <div>
                            <h3>
                                Your Cover Letter has been generated! If you don't get a popup window, click <a style={{cursor: "pointer"}} onClick={async () => await chrome.downloads.download({method: "GET", url: "http://localhost:3000/covers/makeFileFromLast", saveAs: true})}>Here</a>
                            </h3>
                            <button onClick={returnToDefault}>Return to Home</button>
                        </div>
                    ) : ( 
                        showScanner ? (
                            <div>
                                <DescriptionInput toggleVisibility={showScanner} value={scrapeData} setValue={setScrape} hideThis={disableScannerInput} showThis={enableScannerInput} setCL={setCL}/>
                            </div>
                        ) : (
                            <button onClick={enableScannerInput} style={{fontSize: "16pt"}}>Detect Job Posting</button>
                        )   
                    )
                }
            </div>            
        </div>
    );
}

export default Home;