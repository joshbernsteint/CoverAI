import Navbar from "../components/Navbar";
import MyFooter from "../components/MyFooter";
import UploadFile from "../components/UploadFile";
import UserForm from "../components/UserForm";

import { FileInput, Label } from "flowbite-react";
import { FloatingLabel } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import { TextInput } from "flowbite-react";

import React from "react";

import Select from "react-select";

import { useState } from "react";

// import { motion as m } from "framer-motion";

export default function EditProfile() {
  const [showForm, setShowForm] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

  const [resumeFile, setResumeFile] = useState(null);

  // Function to handle successful file upload
  const handleUploadSuccess = (file) => {
    setResumeFile(file);
    setUploadSuccess(true);
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="p-12 w-full">
          <div className="flex justify-center text-3xl font-semibold mb-4">
            {uploadSuccess
              ? "Your resume has been successfully uploaded!"
              : "Get started by filling out your profile"}
          </div>

          <div className="flex justify-center items-center">
            {!uploadSuccess && (
              <UploadFile onUploadSuccess={handleUploadSuccess} />
            )}
            {!uploadSuccess && <UserForm />}
            {uploadSuccess && resumeFile && (
              <embed
                src={resumeFile}
                type="application/pdf"
                width="400"
                height="600"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
