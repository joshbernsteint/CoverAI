import { Form } from "react-bootstrap";


export default function Settings({userSettings, styleSheet, ...props}){

    function SettingEntry({title, inputComponent, ...props}){
        return (
            <trow style={{width: "100%"}}>
                <td style={{textAlign: "left", width: "5%"}}>{title}</td>
                <td style={{textAlign: "right"}}>
                    {inputComponent}
                </td>
            </trow>
        );
    }

    console.log(userSettings);

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

    return (
        <div className="App-Settings">
            <h1>Settings</h1>
            <table style={{width: "100%"}}>
                    <SettingEntry title={"Mode"} inputComponent={
                        <Form.Check 
                            type="switch"

                            defaultChecked={userSettings.useDarkMode}
                            onChange={(s) => {
                                console.log(s.currentTarget.checked);
                            }}
                        />
                    }/>
                    <SettingEntry title={"Suggest Generation"} inputComponent={
                        <Form.Check 
                            type="switch"
                            defaultChecked={userSettings.SuggestCoverLetter}
                            onChange={(s) => {
                                console.log(s.currentTarget.checked);
                            }}
                        />
                    }/>
            </table>
        </div>
    );
};