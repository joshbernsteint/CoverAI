import React from "react";
import Poster from "../assets/poster.png";


export default function PosterPage() {
  

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4 text-center ">
        Here's our poster!
      </h1>
      {/* show img */}
      <img src={Poster}></img>
      
      
    </div>
  );
};

