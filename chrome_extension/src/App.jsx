import { useEffect, useState } from 'react'
import axios from 'axios';
import './App.css'

import { ClerkProvider, SignUp, useAuth } from '@clerk/chrome-extension';
import { useNavigate, Routes, Route, MemoryRouter, Link, useLoaderData, useLocation, Navigate } from 'react-router-dom';
import Settings from './components/Settings';
import Home from './components/Home';
import { IoFileTrayFullOutline, IoHome, IoSettingsSharp } from "react-icons/io5";
import PastLetters from './components/PastLetters';
import Requester from './services/requests';
import Signup from './components/Signup';
import Login from './components/Login';




function BottomButton({link, label, ...props}){
  const style = props.styleSheet || {};
  return (
    <td className='flex-row items-stretch justify-center w-[160px] text-2xl text-center '>
        <Link to={link} props={{...props}} className='text-blue-500'>
          {label || "Lorem Ipsum"}
        </Link>
    </td>
      );
}

const env = import.meta.env;
const publishableKey = env.VITE_CLERK_PUBLISHABLE_KEY || '';
const APIURL = env.VITE_API_URL || "http://localhost:3000/";

function ProviderBody({ userSettings, handleChangeSettings, ...props}){
  const {isSignedIn, getToken, isLoaded} = useAuth();
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


  function LocationTracker(){
    const {pathname} = useLocation();
    if(isLoaded && !isSignedIn && pathname !== "/signup" && pathname !== "/login"){
      return <Navigate to={'/login'} />
    }
    return <></>;
  }

  return (
    <div className='bg-white dark:bg-background_dark'>
      <LocationTracker />
      <div style={{marginBottom: "2rem"}}>
      <Routes>
<<<<<<< Updated upstream
        <Route path='/signup/*' element={<SignUp signInUrl='/'/>}/>
        <Route path='/' element={<Home env={env} settings={userSettings} requester={requester} scrapeData={activeScrapeData} setScrape={handleSetScrape} activeCL={activeCL} setCL={handleSetCL}/>}/>
=======
        <Route path='/signup/*' element={<CustomSignUp signInUrl='/'/>}/>
        <Route path='/' element={<Home env={env} requester={requester} scrapeData={activeScrapeData} setScrape={handleSetScrape} activeCL={activeCL} setCL={handleSetCL}/>}/>
>>>>>>> Stashed changes
        <Route path='/past' element={<PastLetters env={env} requester={requester}/>}/>
        <Route path='/signup' element={<Signup env={env} requester={requester}/>} settings={userSettings}/>
        <Route path='/login' element={<Login env={env} requester={requester}/>} settings={userSettings}/>
        <Route path='/settings' element={<Settings env={env} requester={requester} settings={userSettings} changeSettings={handleChangeSettings}/>}/>
      </Routes>
      </div>
      <br style={{marginBottom: "5rem"}}/>
      <table style={{position: "fixed", bottom: "0", width: "100%", left: "0%", textAlign: "center"}}>
        <trow>
        <BottomButton label={"Home"} link="/"/>
        <BottomButton label={"History"} link="/past"/>
        <BottomButton label={"Settings"}  link="/settings"/>
        </trow>
      </table>
    </div>
  )
}


function ClerkProviderWithRoutes() {
  const navigate = useNavigate();
  const darkMode = {backgroundColor: "black", color: "white"};
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






  return (
    <div className={userSettings.darkMode ? "dark" : ""}>
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


