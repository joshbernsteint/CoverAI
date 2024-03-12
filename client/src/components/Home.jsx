import React from "react";
import { Carousel } from "flowbite-react";
import hero from "../assets/hero.png";

const Home = () => {
  const handleClick = () => {
    window.location.href = "/edit-profile";
  };




  return (
    <div className="bg-lightGray max-w-screen2xl min-h-screen h-screen py-48 flex justify-center">
      <div className="md:w-1/2 ml-4">
        <h1 className="text-5xl font-semibold mb-4 leading-snug">
          Automate cover letters with Cover.AI
        </h1>
        <button className="px-7 py-2 bg-coverLetterBlue text-white rounded hover:bg-secondary transition-all duration-300 hover:-translate-y-2" onClick={handleClick}>
          Get Started
        </button>
      </div>
      <div>
        <img src={hero} alt="img" className="w-64 mr-20" />
      </div>
    </div>
  );
};

export default Home;
