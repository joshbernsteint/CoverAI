import Navbar from "../components/Navbar";
import MyFooter from "../components/MyFooter";

import { FileInput, Label } from "flowbite-react";
import { FloatingLabel } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import { TextInput } from "flowbite-react";

import React from "react";

import Select from "react-select";

import { useState } from "react";

import { motion as m } from "framer-motion";

export default function EditProfile() {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    schoolName: "",
    major: "",
    graduationDate: "",
    skills: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    console.log("Form submitted:", formData);
    e.preventDefault();

    //REAL API CALL GOES HERE THIS IS JUST A MOCK
    try {
      const response = await fetch("/createProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Profile created successfully");
        // You can perform additional actions here, such as redirecting the user or showing a success message
      } else {
        console.error("Failed to create profile");
        // Handle error appropriately
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      // Handle error appropriately
    }
  };

  const handleButtonClick = () => {
    setShowForm(true);
  };

  //will be used for dropdown menu later
  const skillsOptions = [
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "c++", label: "C++" },
    { value: "c#", label: "C#" },
    { value: "javascript", label: "JavaScript" },
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
    { value: "node.js", label: "Node.js" },
    { value: "express", label: "Express" },
    { value: "mongodb", label: "MongoDB" },
    { value: "sql", label: "SQL" },
    { value: "postgresql", label: "PostgreSQL" },
    { value: "graphql", label: "GraphQL" },
    { value: "rest", label: "REST" },
    { value: "django", label: "Django" },
    { value: "flask", label: "Flask" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "sass", label: "SASS" },
    { value: "bootstrap", label: "Bootstrap" },
    { value: "tailwind", label: "Tailwind" },
    { value: "material-ui", label: "Material-UI" },
    { value: "chakra-ui", label: "Chakra-UI" },
    { value: "ant-design", label: "Ant-Design" },
    { value: "figma", label: "Figma" },
    { value: "adobe-xd", label: "Adobe XD" },
    { value: "sketch", label: "Sketch" },
    { value: "invision", label: "InVision" },
    { value: "zeplin", label: "Zeplin" },
    { value: "git", label: "Git" },
    { value: "github", label: "GitHub" },
    { value: "gitlab", label: "GitLab" },
    { value: "bitbucket", label: "Bitbucket" },
    { value: "jenkins", label: "Jenkins" },
    { value: "travis-ci", label: "Travis CI" },
    { value: "docker", label: "Docker" },
    { value: "kubernetes", label: "Kubernetes" },
    { value: "aws", label: "AWS" },
    { value: "gcp", label: "GCP" },
    { value: "azure", label: "Azure" },
    { value: "heroku", label: "Heroku" },
    { value: "netlify", label: "Netlify" },
    { value: "vercel", label: "Vercel" },
    { value: "firebase", label: "Firebase" },
    { value: "twilio", label: "Twilio" },
    { value: "stripe", label: "Stripe" },
    { value: "paypal", label: "PayPal" },
    { value: "square", label: "Square" },
    { value: "shopify", label: "Shopify" },
    { value: "woocommerce", label: "WooCommerce" },
    { value: "magento", label: "Magento" },
    { value: "bigcommerce", label: "BigCommerce" },
    { value: "salesforce", label: "Salesforce" },
    { value: "sap", label: "SAP" },
    { value: "oracle", label: "Oracle" },
    { value: "mysql", label: "MySQL" },
    { value: "mariadb", label: "MariaDB" },
    { value: "sqlite", label: "SQLite" },
    { value: "cassandra", label: "Cassandra" },
    { value: "redis", label: "Redis" },
    { value: "elasticsearch", label: "Elasticsearch" },
    { value: "kibana", label: "Kibana" },
    { value: "logstash", label: "Logstash" },
    { value: "kafka", label: "Kafka" },
    { value: "rabbitmq", label: "RabbitMQ" },
    { value: "activemq", label: "ActiveMQ" },
    { value: "zeromq", label: "ZeroMQ" },
    { value: "websockets", label: "WebSockets" },
    { value: "grpc", label: "gRPC" },
    { value: "thrift", label: "Thrift" },
    { value: "avro", label: "Avro" },
    { value: "protocol-buffers", label: "Protocol Buffers" },
  ];

  return (
    <>
      <Navbar />
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="School Name"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              placeholder="Major"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="date"
              name="graduationDate"
              value={formData.graduationDate}
              onChange={handleChange}
              placeholder="Graduation Date"
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Skills (comma-separated)"
              className="px-4 py-2 border rounded-md"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="px-4 py-2 border rounded-md"
              rows="4"
            ></textarea>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>

              <button
                onClick={handleSubmit}
                type="submit"
                className="px-7 py-2 bg-coverLetterBlue text-white rounded hover:bg-secondary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center">
        <div className="p-12 w-full">
          <div className="flex justify-center text-3xl font-semibold mb-4">
            Get started by filling out your profile
          </div>
          <div className="flex justify-center items-center">
            <div
              id="left-resume"
              className="w-2/4 flex justify-center items-center border-r-2"
            >
              <div className="text-center">
                <div className="flex w-full items-center justify-center">
                  <Label
                    htmlFor="dropzone-file"
                    className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pb-6 pt-5 px-4">
                      <svg
                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLineJoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF, DOCX, DOC, TXT
                      </p>
                    </div>
                    <FileInput
                      id="dropzone-file"
                      accept=".pdf,.docs,.doc"
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>
            </div>

            <div
              id="right-form"
              className="w-2/4 flex justify-center items-center"
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className="text-2xl">Fill out this form</div>
                <div>
                  <button
                    onClick={handleButtonClick}
                    className="px-7 py-2 bg-coverLetterBlue text-white rounded hover:bg-secondary"
                  >
                    Take me there
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyFooter />
    </>
  );
}
