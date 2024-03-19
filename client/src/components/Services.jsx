import React from "react";
import { AiOutlineFolderView } from "react-icons/ai";
import { AiOutlineCopy } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Resume Parser",
      description:
        "Don't want to fill out forms? No problem! Just upload your resume and we'll do the rest.",
      image: <AiOutlineFolderView/>,
      link: "/edit-profile",
    },
    {
      id: 2,
      title: "Cover Letter Generator",
      description:
        "We'll generate a cover letter for you based on your resume and the job description.",
      image: <AiOutlineCopy/>,
      link: "/cover-letters",
    },
    {
      id: 3,
      title: "Essay Questions",
      description:
        "Tired of writing the same essay questions over and over? We'll help you automate that too.",
      image: <AiOutlineEdit/>,
      link: "/coming-soon"
    },
  ];
  return (
    <div className="md:px-14 px-4 py-16 max-w-screen-2xl mx-auto text-center">
      {/* services card */}
      <div className="mt-20 md:w-1/2 mx-auto">
        <h2 className="text-4xl font-semibold mb-2">Our Services</h2>
        <p>We provide the following services:</p>
      </div>

      {/* cards */}
      <div className="mt-14 grid lg:grid-cols-3 ">
        {services.map((service) => (
          <div
            key={service.id}
            className="px-4 py-8 text-center md:w-[300px] mx-auto md:h-80 rounded-md shadow cursor-pointer hover:-translate-y-5 hover:border-b-4 transition-all duration-300 flex items-center justify-center h-full "
            onClick={() => window.location.replace(service.link)}
          >
            <div>
              <div className="flex justify-center items-center h-20 w-20 bg-primary text-white rounded-full mx-auto">
                {React.cloneElement(service.image, { className: "text-3xl" })} 
              </div>
              <h3 className="text-2xl font-semibold mt-4">{service.title}</h3>
              <p className="text-greyishPurple mt-2">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
