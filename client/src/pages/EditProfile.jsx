import Navbar from "../components/Navbar";
import MyFooter from "../components/MyFooter";

import { FileInput, Label } from "flowbite-react";
import { FloatingLabel } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import { TextInput } from "flowbite-react";

import React from "react";

import Select from "react-select";

export default function EditProfile() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const due = e.target.due.value;
    const file = e.target.file.files[0];

    console.log(title, description, due, file);
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
          action=""
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FloatingLabel variant="standard" label="First Name" />

          <FloatingLabel variant="standard" label="Last Name" />

          <FloatingLabel variant="standard" label="Email" />

          <FloatingLabel variant="standard" label="Phone Number" />

          <FloatingLabel variant="standard" label="School Name" />

          <FloatingLabel variant="standard" label="Major" />

          <label>
            Expected Graduation Date:
            <Datepicker
              minDate={new Date(2023, 0, 1)}
              maxDate={new Date(2023, 3, 30)}
            />
          </label>

          <label htmlFor="">
            Select your skills:
            <Select
              options={skillsOptions}
              isMulti={true}
              placeholder="Select your skills"
            />
          </label>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="large" value="Tell us more about you!" />
            </div>
            <TextInput id="large" type="text" sizing="lg" />
          </div>

          <input type="submit" value="Submit" />
        </form>
      </div>
      <MyFooter />
    </>
  );
}
