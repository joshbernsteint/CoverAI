import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, ClerkProvider, SignOutButton, useAuth } from '@clerk/chrome-extension';
import axios from 'axios';
import Requests from "../../services/requests";
 
export default function Settings({changeSettings, settings, ...props}) {


  const myRequester = new Requests();

  async function handleChange(e){
    console.log(e);
    const target = e.target;
    switch (target.id) {
      case "dark_mode_check":
        changeSettings({...settings, darkMode: target.checked});
        break;
      case "auto_download_cl":
        changeSettings({...settings, autoDownloadCL: target.checked});
      default:
        break;
    }
    const settingsCopy = {...settings};
    delete settingsCopy.styleSheet;
    console.log(settingsCopy);
    await myRequester.post("http://localhost:3000/users/settings", {settings: settingsCopy});
  }

  async function handleSubmit(){
    const settingsCopy = {...settings};
    delete settingsCopy.styleSheet;
    const {data} = await myRequester.post("http://localhost:3000/users/settings", {settings: settingsCopy});
    console.log('here', data);


  }

  return (
    <div>
    <SignedIn>
        <div>
          <h2>Settings</h2>
            <form onChange={handleChange}>
              <label>
                <span className="setting_label">Dark Mode: </span>
                <input type="checkbox" defaultChecked={settings.darkMode} id="dark_mode_check"/>
              </label><br/>
              <label>
                <span className="setting_label">Auto Download Letter: </span>
                <input type="checkbox" defaultChecked={settings.autoDownloadCL} id="auto_download_cl"/>
              </label><br/>
            </form>
            <button onClick={handleSubmit}>Save changes</button>
            <br/>
            
            <div style={{position: "fixed", "bottom": "100px", textAlign: "center", left: "40%"}}>
            <SignOutButton>
                    Sign Out
            </SignOutButton>
            </div>
        </div>
      </SignedIn>
      <SignedOut>
        <SignIn
          afterSignInUrl='/'
          signUpUrl='/signup'
        />
      </SignedOut>
</div>
  );
}