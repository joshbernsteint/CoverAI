import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, ClerkProvider, SignOutButton, useAuth } from '@clerk/chrome-extension';


const BUTTON_CLASS = 'w-[25%] m-1 text-midPurple bg-transparent border-2 border-midPurple dark:bg-[#1a1a1a] dark:text-white';
 
export default function Settings({env,changeSettings, settings, requester, ...props}) {

  async function handleChange(e){
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
  }

  async function handleSubmit(){
    const settingsCopy = {...settings};
    delete settingsCopy.styleSheet;
    const {data} = await requester.post("/users/settings", {settings: settingsCopy});
    changeSettings(data.settings);
  }

  return (
    <div className="dark:text-white">
        <div>
          <h1 className="text-3xl" style={{color: settings.darkMode ? "white" : "black"}}>Settings</h1>
          <br/>
            <form onChange={handleChange} className="text-left ml-[30%]">

              <label class="inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={settings.darkMode} id="dark_mode_check" className="sr-only peer"/>
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark Mode</span>
              </label><br/>

              <label class="inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={settings.autoDownloadCL} id="auto_download_cl" className="sr-only peer"/>
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Auto Download Cover Letter</span>
              </label><br/>
            </form>
          <button onClick={() => window.open(`${env.VITE_WEBSITE_URL}/edit-profile`)} className="m-1 text-midPurple bg-transparent border-2 border-midPurple dark:bg-[#1a1a1a] dark:text-white">Fill out your Profile</button><br/>
          <div className="m-4">
            <button onClick={handleSubmit} className={BUTTON_CLASS}>Save</button>
              <SignOutButton className={BUTTON_CLASS}>
                      Sign Out
              </SignOutButton>
          </div>
        </div>
</div>
  );
}