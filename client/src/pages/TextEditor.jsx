import Navbar from "../components/Navbar";
import MyFooter from "../components/MyFooter";
import TextEdit from "../components/TextEdit";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import NoPage from "./NoPage";

export default function TextEditor() {
  let { id } = useParams();
  console.log(id);

  // if (
  //   !id ||
  //   Number(id) <= 0 ||
  //   typeof Number(id) !== "number" ||
  //   !Number.isInteger(Number(id))
  // ) {
  //   console.log("Invalid ID");
  //   return <NoPage></NoPage>;
  // }

  return (
    <div className="md:px-14 px-4 py-8 max-w-screen-2xl min-h-screen mx-auto text-center dark:bg-background_dark">

      <h1 className="font-bold text-3xl mt-11">Your Cover Letter</h1>

      <TextEdit id={id}></TextEdit>

    </div>
  );
}
