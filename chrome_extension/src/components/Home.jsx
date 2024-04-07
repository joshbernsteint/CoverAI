import { useState } from "react";
import DescriptionInput from "./DescriptionInput";
import scrapeWebsite from "../services/scrapeWebsite";
import parseScraper from "../services/parseScraper";
import {SignedIn, SignedOut} from '@clerk/chrome-extension';
import {Navigate} from 'react-router-dom';



function Home({requester, scrapeData, setScrape, activeCL, setCL, ...props}){

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

    const webUrl = import.meta.env.VITE_WEBSITE_URL;

    return (
        <div>
            <h1 style={{margin: ".1rem"}}>CoverAI Chrome</h1>
            <h4>Visit our <a href={webUrl} target="_blank">Website</a> for even more features!</h4>
            <SignedIn>
            <div>
                {
                    activeCL ? (
                        <div>
                            <h3>
                                Your Cover Letter has been generated! If you don't get a popup window, click <a style={{cursor: "pointer"}} onClick={async () => await chrome.downloads.download({method: "GET", url: requester.baseUrl+"/covers/makeFileFromLast", saveAs: true})}>Here</a>
                            </h3>
                            <button onClick={returnToDefault}>Return to Home</button>
                        </div>
                    ) : ( 
                        showScanner ? (
                            <div>
                                <DescriptionInput requester={requester} toggleVisibility={showScanner} value={scrapeData} setValue={setScrape} hideThis={disableScannerInput} showThis={enableScannerInput} setCL={setCL}/>
                            </div>
                        ) : (
                            <button onClick={enableScannerInput} style={{fontSize: "16pt"}}>Detect Job Posting</button>
                        )   
                    )
                }
            </div>         
            </SignedIn> 
            <SignedOut>
                <Navigate to={'/settings'} />
            </SignedOut>  
        </div>
    );
}

export default Home;