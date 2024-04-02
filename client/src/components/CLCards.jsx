import React from "react";
import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Requests from "../services/requests";
import { useAuth } from "@clerk/clerk-react";

const CLCards = () => {
  const myRequester = new Requests();
  const { getToken } = useAuth();
  //console.log(myRequester);
  //get cover letters from api
  const [coverLetters, setCoverLetters] = useState([]);
  useEffect(() => {
    const fetchCoverLetters = async () => {
      try {
        console.log(await getToken());
        const response = await axios.get(
          "https://cover-ai-server-three.vercel.app/covers/getAllCoverLetters",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );
        console.log("response data", response.data);
        setCoverLetters(response.data.reverse());
      } catch (error) {
        console.error(error);
      }
      console.log(coverLetters);
    };
    fetchCoverLetters();
  }, []);

  return (
    <div className="md:px-14 px-4 py-16 max-w-screen-2xl mx-auto text-center mt-11">
      <h1 className="font-bold text-3xl"> Your Past Cover Letters </h1>
      {coverLetters.length > 0 && (
        <div className="mt-4">
          {coverLetters.map((cover, i) => (
            <Card
              href={`text-editor/${cover._id}`}
              className="max-w px-4 mt-4"
              key={i}
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {cover.company_name}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Created: {cover.date}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CLCards;
