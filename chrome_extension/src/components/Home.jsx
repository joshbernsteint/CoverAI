import { useState } from "react";
import DescriptionInput from "./DescriptionInput";
import scrapeWebsite from "../services/scrapeWebsite";
import parseScraper from "../services/parseScraper";



function Home({scrapeData, setScrape, ...props}){


    const [showScanner, setShowScanner] = useState(false);
    const enableScannerInput = async () => {  
        setScrape(parseScraper(await scrapeWebsite())); 
        setShowScanner(true);
    };
    const disableScannerInput = () => setShowScanner(false);





    return (
        <div>
            <h1 style={{margin: ".1rem"}}>CoverAI Chrome</h1>
            {/* TODO: Change link */}
            <h4>Visit our <a href="https://www.youtube.com/watch?v=OfOA4RKgIlA" target="_blank">Website</a> for even more features!</h4>
            <div>
                {
                    showScanner ? (
                        <div>
                            <DescriptionInput toggleVisibility={showScanner} value={scrapeData} setValue={setScrape} hideThis={disableScannerInput} showThis={enableScannerInput}/>
                        </div>
                    ) : (
                        <button onClick={enableScannerInput}>Detect Job Posting</button>
                    )
                }
            </div>            
        </div>
    );
}

export default Home;