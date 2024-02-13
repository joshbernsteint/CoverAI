import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { defaultUserSettings } from "../defaults.js";


export default function Settings({userSettings, styleSheet, setSettings, ...props}){

    const [tempSettings, setTempSettings] = useState(userSettings.current);
    useEffect(() => {
        setTempSettings(userSettings.current);
    }, [userSettings.current]);

    function FlipSettingEntry({title, valueKey, ...props}){
        return (
            <trow style={{width: "100%", paddingBottom: "2rem"}}>
                <td style={{textAlign: "left"}}>{title}</td>
                <td style={{textAlign: "right", width: "10%"}}>
                    <Form.Check 
                            type="switch"
                            defaultChecked={tempSettings[valueKey]}
                            aria-label={title}
                    />
                </td>
            </trow>
        );
    }

    /**
     * {
      useDarkMode: true, // Or false
      SuggestCoverLetter: true, // Or false
      autoDownloadCoverLetter: false, //Or true
      savePastResumes: true, //Or false
      savePastCoverLetters: true, //Or false
        };
     * 
     */

    function handleResetSettings(){
        setSettings({...defaultUserSettings});
        setTempSettings({...defaultUserSettings});
    }

    function handleSubmit(e){
        const newSettings = {};
        const settingsInputs = Array.from(e.target).slice(0,-2);
        const settingsKeys = Object.keys(tempSettings);
        for (let i = 0; i < settingsKeys.length; i++) {
            newSettings[settingsKeys[i]] = settingsInputs[i].checked;
        }
        setSettings({...newSettings});
        e.preventDefault();
    }

    return (
        <div className="App-Settings">
            <h1>Settings</h1>
            <Form onSubmit={handleSubmit}>
                <table style={{width: "100%"}}>
                    <FlipSettingEntry title={"Dark Mode"} valueKey={"useDarkMode"}/>
                    <FlipSettingEntry title={"Suggest CL"} valueKey={"SuggestCoverLetter"}/>
                    <FlipSettingEntry title={"Auto Download CL"} valueKey={"autoDownloadCoverLetter"}/>
                    <FlipSettingEntry title={"Save Resumes"} valueKey={"savePastResumes"}/>
                    <FlipSettingEntry title={"Save CL's"} valueKey={"savePastCoverLetters"}/>
                </table>
                <div style={{textAlign: "right", width: "100%", marginTop: "2rem"}}>
                    <Button onClick={handleResetSettings} variant="danger">Reset</Button>
                    <Button type="submit" variant="success">Save</Button>
                </div>
            </Form>
        </div>
    );
};