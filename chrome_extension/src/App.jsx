import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import { ClerkProvider } from '@clerk/chrome-extension';
import { useNavigate, Routes, Route, MemoryRouter, Link } from 'react-router-dom';
import Settings from './components/Settings/Settings';
import Home from './components/Home';
import { IoFileTrayFullOutline, IoHome, IoSettingsSharp } from "react-icons/io5";
import PastLetters from './components/PastLetters';
import SignUp from './components/Settings/SignUp';
import Login from './components/Settings/Login';



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
  const stylesheet = {};
  const [userSettings, setUserSettings] = useState({});
  const [activeScrapeData, setActiveScrapeData] = useState(JSON.parse(localStorage.getItem("scrapeData")));
  const [activeCL, setActiveCL] = useState(undefined);

  function handleSetScrape(newVal){
    if(newVal.raw.length !== 0) localStorage.setItem('scrapeData', JSON.stringify(newVal));
    setActiveScrapeData(newVal);
  }

  function handleSetCL(newCL){
    setActiveCL(newCL);
  }


  return (
    <ClerkProvider
      publishableKey={publishableKey}
      navigate={to => navigate(to)}
    >
      <Routes>
        <Route path='/signup' element={<SignUp />}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<Home scrapeData={activeScrapeData} setScrape={handleSetScrape} activeCL={activeCL} setCL={handleSetCL}/>}/>
        <Route path='/past' element={<PastLetters/>}/>
        <Route path='/settings' element={<Settings/>}/>
      </Routes><br/>
      <table style={{position: "fixed", bottom: "0", width: "100%", left: "0%", textAlign: "center"}}>
        <trow>
        <BottomButton label={<IoHome/>} link="/"/>
        <BottomButton label={<IoFileTrayFullOutline />} link="/past"/>
        <BottomButton label={<IoSettingsSharp />}  link="/settings"/>
        </trow>
      </table>
    </ClerkProvider>
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


