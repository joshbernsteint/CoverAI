import React from "react";
import David from "../assets/david.png";
import JoshB from "../assets/joshb.png";
import JoshG from "../assets/joshg.png";
import Ajit from "../assets/ajit.png";
import Sabah from "../assets/sabah.png";
import Sophia from "../assets/sophia.png";
import Annie from "../assets/annie.png";

const About = () => {
  const team = [
    {
      name: "David",
      image: David,
      linkedin: "https://www.linkedin.com/in/david-bajollari/",
      description:
        "I am a senior at Stevens Institute of Technology, finishing up my undergraduate degree in Computer Science. I will be pursuing a Master of Science in Machine Learning and also plan to begin working as a full-time Software Engineer Associate at Chubb this summer. Focusing on the user interface, using React, I ensured an intuitive user experience for CoverAI users. My contributions extended to the user settings functionality, the in-browser text editor, and unit testing. I believe the team spent a lot of time on the application and hopes that many Stevens students find it useful for job hunting and crafting personalized cover letters.",
    },
    {
      name: "Josh B.",
      image: JoshB,
      linkedin: "https://www.linkedin.com/in/joshua-bernstein-9700261b0/",
      description:
        "Hi I'm Josh! I'm a 3rd year Computer Science Major and I am the primary developer for the extension side of the website. Also, I maintain the live production server of our project. I enjoy long walks on the beach and talking about puppies and cats.",
    },
    {
      name: "Josh G.",
      image: JoshG,
      linkedin: "https://www.linkedin.com/in/joshua-gorman/",
      description:
        "Hey, I’m a 3/3 Computer Science major that (whether I like it or not) has been working on various web development projects over the past year. This one in particular I had a hand in the resume parsing and generation. I’ve always been interested in learning new things, so this was a welcome challenge. Overall I am excited about the work we’ve been doing and look forward to expanding it in the future!",
    },
    {
      name: "Ajit",
      image: Ajit,
      linkedin: "https://www.linkedin.com/in/ajit-kandasamy/",
      description:
        "I’m a 3/3.5 CS Major at Stevens, and I was particularly excited to work on this project since it involved generative AI. My role involved working on the authentication pages, such as logging in and signing up. However, I also programmed a few features on the extension as well, such as the web scraper, which scans job postings so users don’t have to manually paste them.",
    },
    {
      name: "Sabah",
      image: Sabah,
      linkedin: "https://www.linkedin.com/in/sabah-naveed/",
      description:
        "I’m a 3/3.5 CS Major at Stevens and am super stoked to work on this wonderful team of computer scientists. I found it very fulfilling to make a tool to help fellow students apply to jobs faster while most of us collectively struggle in this rough job market. My role was to engineer a user-friendly frontend for the Cover.AI website which aims to provide the same functionality as the extension. With an eye for design, I ensure the user has a pleasing experience on the website and aim to maximize returning users. I am excited to see how this project will help students in their job search and am looking forward to working on more projects like this in the future!",
    },
    {
      name: "Sophia",
      image: Sophia,
      linkedin: "https://www.linkedin.com/in/sophia-rodriguez-s04p/",
      description:
        "I am a dedicated Computer Science major, who played a pivotal role in developing the backend of a React/Express application designed to automate the generation of cover letters. My main focus was on enhancing the cover letter creation process using ChatGPT 3.5 and managing user interactions and middleware with Clerk. My contributions were crucial in building a user-friendly platform that simplifies the cover letter writing process, reflecting my strong technical skills and commitment to creating practical solutions in the tech field.",
    },
  ];

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4 text-center ">
        Meet Our Team
      </h1>
      <div className="flex flex-col items-center justify-center mt-6 mb-6">
        <img
          src={Annie}
          alt="Annie"
          className="w-24 h-24 rounded-full mb-2 hover:cursor-pointer hover:border-2 hover:border-[#474CF3] transition-all"
          onClick={() => window.open("https://www.linkedin.com/in/zhongyuan-yu-7955102a/", "_blank")}
        />
        <h2 className="text-lg font-semibold">Prof. Zhongyuan Annie Yu</h2>
        <p className="text-gray-600 text-sm text-center">
          Advisor
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full mb-2 hover:cursor-pointer hover:border-2 hover:border-[#474CF3] transition-all"
              onClick={() => window.open(member.linkedin, "_blank")}
            />
            <h2 className="text-lg font-semibold">{member.name}</h2>
            <p className="text-gray-600 text-sm text-center">
              {member.description}
            </p>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default About;
