// import {
//   MemoryRouter as Router,
//   Routes,
//   Route,
//   Link,
//   useNavigate,
// } from "react-router-dom";

import {
  goBack,
  goTo,
  popToTop,
  Link,
  Router,
  getCurrent,
  getComponentStack,
} from 'react-chrome-extension-router';
import { createMemoryHistory } from "history";
import './App.css';
import { IoFileTrayFullOutline, IoHome, IoSettingsSharp } from "react-icons/io5";
import Home from './components/home';
import Resumes from './components/resumes';
import Settings from './components/settings';

function App() {

function BottomButton({onClick, label, id, component, ...props}){
    return (
        // <button style={{width: "33%", textAlign: "center"}} id={id || ""} onClick={onClick || (() => {})} {...props}>{label || "Lorem Ipsum"}</button>
      <button style={{width: "33%", textAlign: "center"}} onClick={() => goTo(component)}>{label || "Lorem Ipsum"}</button>
        );
  }

  console.log(window.location.pathname);

  function Test(){
    return (<>
    
    I hate this.</>)
  }

  return (
    <div className="App">
      <Router>
        <Home/>
      </Router>
      <div style={{position: "fixed", bottom: "0", width: "100%"}}>
        <BottomButton label={<IoHome />} component={Home}/>
        <BottomButton label={<IoFileTrayFullOutline />} component={Resumes}/>
        <BottomButton label={<IoSettingsSharp />} component={Settings}/>
      </div>
    </div>
  );
}

export default App;
