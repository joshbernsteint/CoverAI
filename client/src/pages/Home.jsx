import NavbarComp from "../components/Navbar";
import Home from "../components/Home";
import Services from "../components/Services";
import MyFooter from "../components/MyFooter";

import axios from "axios";
import { useEffect, useState } from "react";

export default function HomePage() {
  return (
    <div className="">
      <Home />
      <Services />
    </div>
  );
}
