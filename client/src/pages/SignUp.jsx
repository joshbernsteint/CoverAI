import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
const logoURL = '../assets/iconblack.png';
import { FcGoogle } from "react-icons/fc";

export default function SignUp(e) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const { isLoaded, signUp, setActive } = useSignUp();

  if (!isLoaded) {
    // handle loading state
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    // Check the sign up response to
    // decide what to do next.
    await signUp
      .create({
        emailAddress,
        password,
      })
      .then((result) => {
        if (result.status === "complete") {
          console.log(result);
          setActive({ session: result.createdSessionId });
        } else {
          console.log(result);
        }
      })
      .catch((err) => console.error("error", err.errors[0].longMessage));
  }

  async function SignUpWithGoogle(e) {
    e.preventDefault();
    try {
      // You might need to provide additional options depending on your setup
      await signUp.create({ strategy: 'oauth_google' });
      // Navigate the user or show a success message
    } catch (error) {
      console.error('Error signing up with Google:', error);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-white flex-col">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs border-gray-100">
        <div className="flex-row">
          <img src={logoURL}/>
          <h2>Cover AI</h2>
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-black text-sm font-bold mb-2">Email</label>
          <input 
            type="email" 
            id="email" 
            onChange={(e) => setEmailAddress(e)}
            className="appearance-none border-0 border-t-1 border-b-2 border-black w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:border-black"
            placeholder="you@example.com"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-black text-sm font-bold mb-2">Password</label>
          <input 
            type="password" 
            id="password" 
            onChange={(e) => setPassword(e)}
            className="appearance-none border-0 border-t-1 border-b-2 border-black w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:border-black"
            placeholder="******************"
          />
        </div>
        <div>
          <button 
            type="submit" 
            className="w-full bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-blue focus:shadow-outline"
            onSubmit={(e) => submit(e)}
          >
            Sign up
          </button>
        </div>
      </form>
      <p className="my-2">or, sign up with</p>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs border-gray-100">
        <button
          type="button"
          className="shadow appearance-none border rounded w-full bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
          onClick={(e) => SignUpWithGoogle(e)}
        >
          <FcGoogle className="mr-4 w-2/12" /> Google
        </button>
      </div>
    </div>
  );
}
