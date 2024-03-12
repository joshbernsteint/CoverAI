import Navbar from "../components/Navbar";
import MyFooter from "../components/MyFooter";

import { FileInput, Label } from "flowbite-react";
import { FloatingLabel } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import { TextInput } from "flowbite-react";

import React from "react";

import Select from "react-select";

import { useState } from "react";

export default function EditProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [major, setMajor] = useState("");
  const [graduationDate, setGraduationDate] = useState("");
  const [skills, setSkills] = useState([]);
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    //set grad date and skills
    const gradDate = document.getElementById("gradDate").value;
    console.log("grad date:", gradDate);
    setGraduationDate(gradDate);
    const selectedSkills = document.getElementById("skills").value;
    console.log("selected skills:", selectedSkills);
    setSkills(selectedSkills);

    if (firstName === "") {
      alert("First name is required");
      return;
    }
    if (lastName === "") {
      alert("Last name is required");
      return;
    }
    if (email === "") {
      alert("Email is required");
      return;
    }
    if (phoneNumber === "") {
      alert("Phone number is required");
      return;
    }
    if (schoolName === "") {
      alert("School name is required");
      return;
    }
    if (major === "") {
      alert("Major is required");
      return;
    }
    if (gradDate === "") {
      alert("Graduation date is required");
      return;
    }
    if (skills.length === 0) {
      alert("Skills are required");
      return;
    }
    if (description === "") {
      alert("Description is required");
      return;
    }

    console.log(
      firstName,
      lastName,
      email,
      phoneNumber,
      schoolName,
      major,
      graduationDate,
      skills,
      description
    );
  };

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

  const today = new Date();

  return (
    <>
      <Navbar />
      <div className="mt-20 flex-row justify-center items-center container mx-auto">
        <div className="flex w-full items-center justify-center">
          <Label
            htmlFor="dropzone-file"
            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
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
                <span className="font-semibold">Click to upload</span> or drag
                and drop
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

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <label>
            Title:
            <input type="text" id="title" required />
          </label>

          <FloatingLabel
            variant="standard"
            label="First Name"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <FloatingLabel
            variant="standard"
            label="Last Name"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <FloatingLabel
            variant="standard"
            label="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FloatingLabel
            variant="standard"
            label="Phone Number"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <FloatingLabel
            variant="standard"
            label="School Name"
            id="schoolName"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
          />

          <FloatingLabel
            variant="standard"
            label="Major"
            id="major"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          />

          <label>
            Expected Graduation Date:
            <Datepicker
              placeholder="Select date"
              minDate={new Date(2020, 1, 1)}
              maxDate={new Date(2050, 1, 1)}
              id="gradDate"
            />
          </label>

          <label>
            Select your skills:
            <Select
              options={skillsOptions}
              isMulti={true}
              placeholder="Select your skills"
              id="skills"
            />
          </label>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="large" value="Tell us more about you!" />
            </div>
            <TextInput
              type="text"
              sizing="lg"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <input type="submit" value="Submit" id="submit" />
        </form>
      </div>
      <MyFooter />
    </>
  );
}
