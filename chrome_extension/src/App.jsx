import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { SignUp, ClerkProvider } from '@clerk/chrome-extension';
import { useNavigate, Routes, Route, MemoryRouter, Link } from 'react-router-dom';
import Settings from './components/Settings';
import Home from './components/Home';
import { IoFileTrayFullOutline, IoHome, IoSettingsSharp } from "react-icons/io5";



function BottomButton({link, label, ...props}){
  const style = props.styleSheet || {};
  return (
    <td style={{width: "90px", textAlign: "center", fontSize: "larger", ...style}}>
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
  const [activeScrapeData, setActiveScrapeData] = useState(localStorage.getItem("scrapeData"));

  function handleSetScrape(newVal){
    if(newVal.length !== 0) localStorage.setItem('scrapeData', newVal);
    setActiveScrapeData(newVal);
  }


  return (
    <ClerkProvider
      publishableKey={publishableKey}
      navigate={to => navigate(to)}
    >
      <Routes>
        <Route
          path='/sign-up/*'
          element={<SignUp signInUrl='/' />}
        />
        <Route path='/' element={<Home scrapeData={activeScrapeData} setScrape={handleSetScrape}/>}/>
        <Route path='/past' element={<>Past stuff</>}/>
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


