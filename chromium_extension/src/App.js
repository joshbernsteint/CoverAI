// import {
//   MemoryRouter as Router,
//   Routes,
//   Route,
//   Link,
//   useNavigate,
// } from "react-router-dom";

import {
  Link,
  Router,
} from 'react-chrome-extension-router';
import './App.css';
import { IoFileTrayFullOutline, IoHome, IoSettingsSharp } from "react-icons/io5";
import Home from './components/home';
import Resumes from './components/resumes';
import Settings from './components/settings';
import { useState } from 'react';

function App() {

function BottomButton({onClick, label, id, component, ...props}){
    return (
      <td style={{width: "10%", textAlign: "center", fontSize: "larger", ...props.styleSheet}}>
          <Link component={component} props={{...props}}>
            {label || "Lorem Ipsum"}
          </Link>
      </td>
        );
  }

  // These will be changed to actual stylesheet objects
  const lightMode = {};
  const darkMode = {};


  let style = {};



  let localStorageSettings = JSON.parse(localStorage.getItem('settings'));
  if(!localStorageSettings){
    localStorageSettings = {
      useDarkMode: true, // Or false
      SuggestCoverLetter: true, // Or false
      autoDownloadCoverLetter: false, //Or true
      savePastResumes: true, //Or false
      savePastCoverLetters: true, //Or false
    };
    localStorage.setItem('settings', JSON.stringify(localStorageSettings));
  }
  style = localStorageSettings.useDarkMode ? {...darkMode} : {...lightMode};
  const [userSettings, setUserSettings] = useState(localStorageSettings);
  const [styleSheet, setStyleSheet] = useState(style);

  return (
    <div className="App">
      <Router>
        <Home/>
      </Router>
      <table style={{position: "fixed", bottom: "0", width: "100%", textAlign: "center",...styleSheet}}>
        <trow>
        <BottomButton label={<IoHome />} component={Home} styleSheet={styleSheet} userSettings={userSettings}/>
        <BottomButton label={<IoFileTrayFullOutline />} component={Resumes} styleSheet={styleSheet} userSettings={userSettings}/>
        <BottomButton label={<IoSettingsSharp />} component={Settings} styleSheet={styleSheet} userSettings={userSettings} setFunctions={
          {settings: setUserSettings, styleSheet: setStyleSheet}}/>
        </trow>
      </table>
    </div>
  );
}

export default App;
