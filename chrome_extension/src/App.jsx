import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';
import './App.css'

import { ClerkProvider, SignUp, useAuth } from '@clerk/chrome-extension';
import { useNavigate, Routes, Route, MemoryRouter, Link } from 'react-router-dom';
import Settings from './components/Settings/Settings';
import Home from './components/Home';
import { IoFileTrayFullOutline, IoHome, IoSettingsSharp } from "react-icons/io5";
import PastLetters from './components/PastLetters';
import Requester from './services/requests';




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
const APIURL = env.VITE_API_URL || "http://localhost:3000/";

function ProviderBody({ userSettings, handleChangeSettings, ...props}){
  const {isSignedIn, getToken} = useAuth();
  const [prevLogin, setPrevLogin] = useState(-1);
  const [requester, setRequester] = useState(undefined);
  const [activeScrapeData, setActiveScrapeData] = useState(JSON.parse(localStorage.getItem("scrapeData")));
  const [activeCL, setActiveCL] = useState(undefined);


  function handleSetScrape(newVal){
    if(newVal.raw.length !== 0) localStorage.setItem('scrapeData', JSON.stringify(newVal));
    setActiveScrapeData(newVal);
  }

  function handleSetCL(newCL){
    setActiveCL(newCL);
  }

  useEffect(() => {
    async function isLoggedIn(){
      try {
        const requestMaker = new Requester(APIURL, await getToken(), getToken);
        const {data} = await requestMaker.get('/users/settings');
        handleChangeSettings(data.settings);
        setRequester(requestMaker);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    if(prevLogin === -1 && isSignedIn){
      setPrevLogin(true);
      isLoggedIn();
    }
    else if(prevLogin !== -1 && isSignedIn){
      window.close();
    }
  }, [isSignedIn]);

  return (
    <div>
      <Routes>
        <Route path='/signup/*' element={<SignUp signInUrl='/'/>}/>
        <Route path='/' element={<Home env={env} requester={requester} scrapeData={activeScrapeData} setScrape={handleSetScrape} activeCL={activeCL} setCL={handleSetCL}/>}/>
        <Route path='/past' element={<PastLetters env={env} requester={requester}/>}/>
        <Route path='/settings' element={<Settings env={env} requester={requester} settings={userSettings} changeSettings={handleChangeSettings}/>}/>
      </Routes><br/>
      <table style={{position: "fixed", bottom: "0", width: "100%", left: "0%", textAlign: "center"}}>
        <trow>
        <BottomButton label={<IoHome/>} link="/"/>
        <BottomButton label={<IoFileTrayFullOutline />} link="/past"/>
        <BottomButton label={<IoSettingsSharp />}  link="/settings"/>
        </trow>
      </table>
    </div>
  )
}


function ClerkProviderWithRoutes() {
  const navigate = useNavigate();
  const darkMode = {backgroundColor: "#242424", color: "rgba(255, 255, 255, 0.87)"};
  const lightMode = {backgroundColor: "white", color: "black"};

  const [userSettings, setUserSettings] = useState({
    darkMode: true,
    styleSheet: darkMode,
    autoDownloadCL: true,
  });



  function handleChangeSettings(newSettings){
    setUserSettings({
      ...newSettings,
      styleSheet: newSettings.darkMode ? darkMode : lightMode,
    });
  }

  console.log(userSettings);




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
      <ProviderBody userSettings={userSettings} handleChangeSettings={handleChangeSettings}/>
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


