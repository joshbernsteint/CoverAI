import Navbar from "../components/Navbar";
import MyFooter from "../components/MyFooter";
import SettingForm from "../components/SettingsForm";
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import NoPage from "./NoPage";


export default function SettingsPage() {

  return (
    <>
        <Navbar />
        <div className="md:px-14 px-4 py-16 max-w-screen-2xl mx-auto text-center mt-11">
            <h1 className="font-bold text-3xl"> Settings Page</h1>
            <br />
            <SettingForm></SettingForm>
        </div>
        <MyFooter />
    </>
  );
}