import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from '@clerk/clerk-react';
import Select from 'react-select/creatable';
import {validate} from "email-validator";
import {phone} from 'phone';

const toUpperFirst = (s) => (s.charAt(0).toUpperCase() + s.slice(1));

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

export default function UserForm() {
  const [showForm, setShowForm] = useState(false);
  const { getToken } = useAuth();

  const [failStatus, setStatus] = useState({
    firstName: true,
    lastName: true,
    email: true,
    phoneNumber: true,
    schoolName: true,
    major: true,
    graduationDate: true,
    skills: true,
    description: true,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    schoolName: "",
    major: "",
    graduationDate: "",
    skills: [],
    description: "",
  });

  useEffect(() => {
    async function prePopulate(){
      const token = await getToken();

      //REAL API CALL GOES HERE THIS IS JUST A MOCK
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const {data} = await axios.get(import.meta.env.VITE_API_URL+"/users/profile", {
          headers: {
            ...headers,
          },
        });
        const preForm = {...formData};
        preForm.firstName = data.first_name ? data.first_name : "";
        preForm.lastName = data.last_name ? data.last_name : "";
        preForm.email = data.email ? data.email : "";
        preForm.phoneNumber = data.phone_number ? data.phone_number : "";
        preForm.description = data.description ? data.description : "";
        preForm.major = data.major ? data.major : "";
        preForm.schoolName = data.school_name ? data.school_name : "";
        preForm.graduationDate = data.graduation_date ? data.graduation_date : "";
        preForm.skills = data.skills.map(e => ({label: toUpperFirst(e), value: e}));
        setFormData({...preForm});
      } catch (error) {
        // console.error("Error occurred:", error);
        console.log("Server error occurred.", error.toString());
      }
    };
    if(!showForm) prePopulate();
  }, [showForm]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.trimStart(),
    });
  };

  function handleSkillChange(e){
    setFormData({
      ...formData,
      skills: e,
    });
  }


  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Error-checking
    const statusCopy = {...failStatus};
    statusCopy.firstName = formData.firstName.length > 0;
    statusCopy.lastName = formData.lastName.length > 0;
    statusCopy.email = validate(formData.email);
    statusCopy.phoneNumber = phone(formData.phoneNumber).isValid;
    statusCopy.schoolName = formData.schoolName.length > 2;
    statusCopy.major = formData.major.length > 0;
    statusCopy.graduationDate = new Date(formData.graduationDate).toString() !== "Invalid Date";

    setStatus({...statusCopy});
    if(!(statusCopy.firstName && statusCopy.lastName && statusCopy.email && statusCopy.phoneNumber && statusCopy.schoolName && statusCopy.graduationDate)){
      return;
    }

    formData.skills = formData.skills.map(e => e.value);

    const token = await getToken();

    //REAL API CALL GOES HERE THIS IS JUST A MOCK
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.put(import.meta.env.VITE_API_URL+"/users/profile", formData, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
      setShowForm(false);
    } catch (error) {
      // console.error("Error occurred:", error);
      console.log("Server error occurred.");
    }
  };


  return (
    <>
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg">
            <div className="mb-4 flex gap-2">
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={failStatus.firstName ? "px-4 py-2 border rounded-md" : "px-4 py-2 border-red-500 rounded-md"}
                />
              </div>

              <div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={failStatus.lastName ? "px-4 py-2 border rounded-md" : "px-4 py-2 border-red-500 rounded-md"}
                />
              </div>
            </div>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={failStatus.email ? "px-4 py-2 border rounded-md" : "px-4 py-2 border-red-500 rounded-md"}
              />
            </div>

            <div className="mb-4">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className={failStatus.phoneNumber ? "px-4 py-2 border rounded-md" : "px-4 py-2 border-red-500 rounded-md"}
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                placeholder="School Name"
                className={failStatus.schoolName ? "px-4 py-2 border rounded-md" : "px-4 py-2 border-red-500 rounded-md"}
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="Major"
                className={failStatus.major ? "px-4 py-2 border rounded-md" : "px-4 py-2 border-red-500 rounded-md"}
              />
            </div>

            <div className="mb-4">
              <input
                type="date"
                name="graduationDate"
                value={formData.graduationDate}
                onChange={handleChange}
                placeholder="Graduation Date"
                className={failStatus.graduationDate ? "px-4 py-2 border rounded-md" : "px-4 py-2 border-red-500 rounded-md"}
              />
            </div>

            <div className="mb-4 w-[50%] border rounded-md">
              <Select
                isMulti
                isClearable
                name="skills"
                onChange={handleSkillChange}
                placeholder="Put your skills here"
                options={skillsOptions}
                defaultValue={formData.skills}
                classNames={{
                  control: state => "px-0 py-0 border rounded-md",
                  menu: state => "px-0 py-0 border rounded-md",
                }}
              />
            </div>

            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className={failStatus.description ? "px-4 py-2 border rounded-md w-[50%]" : "px-4 py-2 border-red-500 rounded-md w-[50%]"}
                rows="4"
              ></textarea>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 btn-outline"
              >
                Close
              </button>

              <button
                onClick={handleSubmit}
                type="submit"
                className="px-8 py-2 btn"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div id="right-form" className="w-2/4 flex justify-center items-center">
        <div className="flex flex-col items-center text-center gap-2">
          {/* <div className="text-2xl">Fill out this form</div> */}
          <div>
            <button
              onClick={handleButtonClick}
              className="px-7 py-6 btn"
            >
              Fill out this form
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
