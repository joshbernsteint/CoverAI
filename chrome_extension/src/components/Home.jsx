import { useState } from "react";
import DescriptionInput from "./DescriptionInput";
import scrapeWebsite from "../services/scrapeWebsite";
import parseScraper from "../services/parseScraper";


function Home({settings, requester, scrapeData, setScrape, activeCL, setCL, ...props}){

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

    if(activeCL && settings.autoDownloadCL){
        requester.downloadById(activeCL._id);
    }

    const webUrl = import.meta.env.VITE_WEBSITE_URL;

    return (
        <div className="p-1 dark:text-white ">
            <h1 className="p-1 dark:text-white">CoverAI Chrome</h1>
            <h4>Visit our <a href={webUrl} target="_blank">Website</a> for even more features!</h4>
            <br/>
            <div>
                {
                    activeCL ? (
                        <div>
                            <h3>
                                Your Cover Letter has been generated! If you don't get a popup window, click <a style={{cursor: "pointer"}} onClick={async () => requester.downloadById(activeCL._id)}>Here</a>
                            </h3>
                            <button onClick={returnToDefault}>Return to Home</button>
                        </div>
                    ) : ( 
                        showScanner ? (
                            <div>
                                <DescriptionInput settings={settings} requester={requester} toggleVisibility={showScanner} value={scrapeData} setValue={setScrape} hideThis={disableScannerInput} showThis={enableScannerInput} setCL={setCL}/>
                            </div>
                        ) : (
                            <button onClick={enableScannerInput} style={{fontSize: "16pt"}} className="bg-transparent dark:bg-[#1a1a1a] text-midPurple border-midPurple border-2 dark:text-white">Detect Job Posting</button>
                        )   
                    )
                }
            </div>         
        </div>
    );
}

export default Home;