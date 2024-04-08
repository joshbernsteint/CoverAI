import React from "react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from '@clerk/clerk-react';

export default function UserForm() {
  const [showForm, setShowForm] = useState(false);
  const { getToken } = useAuth();

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

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    const token = await getToken();

    //REAL API CALL GOES HERE THIS IS JUST A MOCK
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.put("http://localhost:3000/users/profile", formData, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
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
                  className="px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="px-4 py-2 border rounded-md"
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
                className="px-4 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="px-4 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                placeholder="School Name"
                className="px-4 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="Major"
                className="px-4 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <input
                type="date"
                name="graduationDate"
                value={formData.graduationDate}
                onChange={handleChange}
                placeholder="Graduation Date"
                className="px-4 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Skills (comma-separated)"
                className="px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="px-4 py-2 border rounded-md"
                rows="4"
              ></textarea>
            </div>

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

      <div id="right-form" className="w-2/4 flex justify-center items-center">
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
    </>
  );
}
