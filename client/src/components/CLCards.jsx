import React from "react";
import { Card } from "flowbite-react";
import { Link } from "react-router-dom";

const CLCards = () => {
  const coverLetters = [
    {
      id: 1,
      title: "Figma Software Engineer Intern",
      date: "01/01/2024",
    },
    {
      id: 2,
      title: "Google Software Engineer Intern",
      date: "02/02/2024",
    },
    {
      id: 3,
      title: "Microsoft Software Engineer Intern",
      date: "03/03/2024",
    },
    {
      id: 4,
      title: "Facebook Software Engineer Intern",
      date: "04/04/2024",
    },
    {
      id: 5,
      title: "Apple Software Engineer Intern",
      date: "05/05/2024",
    },
    {
      id: 6,
      title: "Amazon Software Engineer Intern",
      date: "06/06/2024",
    },
    {
      id: 7,
      title: "Netflix Software Engineer Intern",
      date: "07/07/2024",
    },
    {
      id: 8,
      title: "Spotify Software Engineer Intern",
      date: "08/08/2024",
    },
    {
      id: 9,
      title: "Tesla Software Engineer Intern",
      date: "09/09/2024",
    },
    {
      id: 10,
      title: "Twitter Software Engineer Intern",
      date: "10/10/2024",
    },
  ];
  return (
    <div className="md:px-14 px-4 py-16 max-w-screen-2xl mx-auto text-center mt-11">
      <h1 className="font-bold text-3xl"> Your Cover Letters </h1>
      <div className="mt-4">
        {coverLetters.map((cover) => (
          <Card href={`cover-letters/${cover.id}`} className="max-w px-4 mt-4">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {cover.title}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Created: {cover.date}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CLCards;
