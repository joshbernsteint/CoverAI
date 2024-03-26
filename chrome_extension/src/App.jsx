import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';
import './App.css'

import { ClerkProvider, SignUp } from '@clerk/chrome-extension';
import { useNavigate, Routes, Route, MemoryRouter, Link } from 'react-router-dom';
import Settings from './components/Settings/Settings';
import Home from './components/Home';
import { IoFileTrayFullOutline, IoHome, IoSettingsSharp } from "react-icons/io5";
import PastLetters from './components/PastLetters';



function BottomButton({link, label, ...props}){
  const style = props.styleSheet || {};
  return (
    <td style={{width: "120px", textAlign: "center", fontSize: "24pt", ...style}}>
        <Link to={link} props={{...props}}>
          {label || "Lorem Ipsum"}
        </Link>
    </td>
      );
}

const env = import.meta.env;
const publishableKey = env.VITE_CLERK_PUBLISHABLE_KEY || '';

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();
  const darkMode = {backgroundColor: "#242424", color: "rgba(255, 255, 255, 0.87)"};
  const lightMode = {backgroundColor: "white", color: "black"};

  const [userSettings, setUserSettings] = useState({
    darkMode: true,
    styleSheet: darkMode,
    autoDownloadCL: true,
  });

  const [activeScrapeData, setActiveScrapeData] = useState(JSON.parse(localStorage.getItem("scrapeData")));
  const [activeCL, setActiveCL] = useState(undefined);
  const [loginStatus, setLoginStatus] = useState(false);

  function handleSetScrape(newVal){
    if(newVal.raw.length !== 0) localStorage.setItem('scrapeData', JSON.stringify(newVal));
    setActiveScrapeData(newVal);
  }

  function handleSetCL(newCL){
    setActiveCL(newCL);
  }

  function handleChangeSettings(newSettings){
    setUserSettings({
      ...newSettings,
      styleSheet: newSettings.darkMode ? darkMode : lightMode,
    });
  }

  useEffect(() => {
    async function isLoggedIn(){
      try {
        await axios.get("http://localhost:3000/users/settings");
        setLoginStatus(true);
        return true;
      } catch (error) {
        return false;
      }
    }
    isLoggedIn();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = userSettings.styleSheet.backgroundColor;
    document.body.style.color = userSettings.styleSheet.color;
  }, [userSettings]);

  return (
    <div style={userSettings.styleSheet}>
      <ClerkProvider
      publishableKey={publishableKey}
      navigate={to => navigate(to)}
    >
      <Routes>
        <Route
          path='/signup/*'
          element={<SignUp signInUrl='/'/>}
        />
        <Route path='/' element={<Home scrapeData={activeScrapeData} setScrape={handleSetScrape} activeCL={activeCL} setCL={handleSetCL}/>}/>
        <Route path='/past' element={<PastLetters loginStatus={loginStatus}/>}/>
        <Route path='/settings' element={<Settings loginStatus={loginStatus} settings={userSettings} changeSettings={handleChangeSettings}/>}/>
      </Routes><br/>
      <table style={{position: "fixed", bottom: "0", width: "100%", left: "0%", textAlign: "center"}}>
        <trow>
        <BottomButton label={<IoHome/>} link="/"/>
        <BottomButton label={<IoFileTrayFullOutline />} link="/past"/>
        <BottomButton label={<IoSettingsSharp />}  link="/settings"/>
        </trow>
      </table>
    </ClerkProvider>
    </div>
  );
}

function App() {
  return (
    <MemoryRouter>
      <ClerkProviderWithRoutes />
    </MemoryRouter>
  );
}

export default App;


