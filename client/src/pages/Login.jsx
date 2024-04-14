import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import CoverAI from '../assets/iconblack.png';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();

    const { signIn, setActive, isLoaded } = useSignIn();

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!emailAddress || !password) {
        setLoginError("Fill in all fields");
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(emailAddress)) {
        setLoginError("Invalid Email Input");
        return;
      }

      if (!isLoaded) {
        return;
      }
   
      try {
        const result = await signIn.create({
          identifier: emailAddress,
          password,
        });
   
        if (result.status === "complete") {
          console.log(result);
          await setActive({ session: result.createdSessionId });
          navigate("/home");
        }
        else {
          console.log(result);
        }
   
      } catch (err) {
        setLoginError(err.errors[0].longMessage);
      }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-white flex-col">
          <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs border-gray-100" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-row justify-center">
              <img src={CoverAI} className="mr-3 h-6 sm:h-9" alt="Cover.AI Logo" />
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                Cover.AI
              </span>
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-black text-sm font-bold mb-2">Email</label>
              <input 
                id="email" 
                onChange={(e) => setEmailAddress(e.target.value)} 
                className="appearance-none border-0 border-t-1 border-b-2 border-black w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:border-black"
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-black text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)} 
                className="appearance-none border-0 border-t-1 border-b-2 border-black w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:border-black"
                placeholder="******************"
              />
            </div>
            <div>
              <button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-blue focus:shadow-outline"
              >
                Login
              </button>
            </div>
            <div className="justify-center my-2">
              {loginError && <p className="text-red-700">{loginError}</p>}
            </div>
          </form>
          <div className="w-full max-w-xs text-center my-5">
            <p className="my-2">No account? <Link className="text-blue-500" to="/sign-up">Sign Up</Link></p>
          </div>
        </div>
    );

}