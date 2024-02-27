import { useContext, useRef, useState } from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import CLContext from "../CLContext";
import DocumentManager from "../services/documentManager";

function CLForm(props){
    const buttonRef = useRef(null);
    const formRef = useRef(null);
    const navigate = useNavigate();
    const {activeCL, setActiveCL} = useContext(CLContext);
    const test = {
        "first_name": "Joshua",
        "last_name": "Bernstein",
        "email": "jbernstein@example.com",
        "date": "2023-09-15",
        "employer_name": "Google",
        "greeting": "Dear Hiring Manager,",
        "first_paragraph": "I am writing to express my interest in the Software Engineer position at Google as advertised. With a strong background in computer science and a passion for innovative technology, I am excited about the opportunity to contribute to Google's cutting-edge projects that impact millions of users worldwide.",
        "second_paragraph": "During my previous roles at tech companies, I have honed my skills in software development, problem-solving, and collaboration. I have experience working on diverse projects that have equipped me with a deep understanding of programming languages and frameworks. I am particularly drawn to Google's commitment to pushing the boundaries of technology and creating products that shape the future.",
        "third_paragraph": "I am confident that my technical expertise, combined with my adaptability and eagerness to learn, make me a strong candidate for this position. I am excited about the prospect of joining a talented team of engineers at Google and contributing to the company's mission of making information accessible and useful to everyone.",
        "closing_statement": "Thank you for considering my application. I am looking forward to the possibility of discussing how my skills and experiences align with the needs of Google. I am eager to bring my enthusiasm and dedication to the team and help contribute to Google's success.",
        "signature": "Sincerely, Joshua Bernstein"
        };
    
    const toggleVisibility = (newValue=undefined) => {
        buttonRef.current.hidden = typeof newValue === "undefined" ? !buttonRef.current.hidden : newValue;
        formRef.current.hidden = typeof newValue === "undefined" ? !buttonRef.current.hidden : !newValue;
        formRef.current.reset();
    };

    async function handleSubmit(event){
        const target = event.currentTarget;
        const promptContent = target[0].value.trim();
        event.preventDefault();
        if(promptContent.length > 25){
            //TODO: Make API call
            const {data} = await axios.post("http://localhost:3000/covers/genBasicLetter", {description: promptContent});
            const doc = DocumentManager.toDeltaObject(data);
            // console.log(doc);
            setActiveCL(doc);
            navigate("/text-editor/1");
            toggleVisibility(false);
        }
        else{
            //Show error message
        }
    }


    return (
        <div className="md:px-14 px-4 py-16 max-w-screen-2xl mx-auto text-center mt-11">
            <button ref={buttonRef} className="bg-primary text-white py-2 px-4 transition-all duration-300 rounded text-2xl hover:bg-greyishPurple" onClick={toggleVisibility}>
              Make a new Cover Letter
            </button>
            <form ref={formRef} onSubmit={handleSubmit} hidden>
                <label>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Input your prompt below:</h2>
                    <textarea className="max-w-screen-2xl mx-auto mt-5 mb-5" style={{width: "60%", height: "200px"}} id="basic-input"/>
                </label><br/>
                <button className="bg-primary text-white py-2 px-4 transition-all duration-300 rounded text-2xl hover:bg-greyishPurple mr-5" onClick={() => toggleVisibility(false)}>
                    Cancel
                </button>
                <button type="submit" className="bg-primary text-white py-2 px-4 transition-all duration-300 rounded text-2xl hover:bg-greyishPurple">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default CLForm;