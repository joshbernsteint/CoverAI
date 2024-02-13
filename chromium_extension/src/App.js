import {
  Link,
  Router,
} from 'react-chrome-extension-router';
import './App.css';
import { IoFileTrayFullOutline, IoHome, IoSettingsSharp } from "react-icons/io5";
import Home from './components/home';
import Resumes from './components/resumes';
import Settings from './components/settings';
import { defaultUserSettings, darkModeStylesheet, lightModeStylesheet } from './defaults.js';
import { useEffect, useRef, useState } from 'react';

function App() {

function BottomButton({onClick, label, id, component, ...props}){
    return (
      <td style={{width: "90px", textAlign: "center", fontSize: "larger", ...props.styleSheet}}>
          <Link component={component} props={{...props}}>
            {label || "Lorem Ipsum"}
          </Link>
      </td>
        );
  }
  let localStorageSettings = JSON.parse(localStorage.getItem('settings'));
  if(!localStorageSettings){
    localStorageSettings = {...defaultUserSettings};
    localStorage.setItem('settings', JSON.stringify(localStorageSettings));
  }
  const userSettings = useRef(localStorageSettings);
  const style = localStorageSettings.useDarkMode ? {...darkModeStylesheet} : {...lightModeStylesheet};
  const [styleSheet, setStyleSheet] = useState(style);


  function RepeatHome(){
    return (
      <Home userSettings={userSettings} styleSheet={styleSheet}/>
    );
  }
  
  async function saveSettings(newSettings){
    userSettings.current = {...newSettings};
    localStorage.setItem('settings', JSON.stringify(newSettings));
    //TODO: Handle updating backend settings
  }
  return (
    <div className="App">
      <Router>
        <RepeatHome/>
      </Router>
      <table style={{position: "fixed", bottom: "0", width: "100%", textAlign: "center", ...styleSheet}}>
        <trow>
        <BottomButton label={<IoHome />} component={RepeatHome}/>
        <BottomButton label={<IoFileTrayFullOutline />} component={Resumes} styleSheet={styleSheet} userSettings={userSettings}/>
        <BottomButton label={<IoSettingsSharp />} component={Settings} styleSheet={styleSheet} userSettings={userSettings} setSettings={(s) => saveSettings(s)}/>
        </trow>
      </table>
    </div>
  );
}

export default App;
