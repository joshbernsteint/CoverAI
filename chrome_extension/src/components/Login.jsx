import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({settings, ...props}) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(settings ? settings.isDarkMode : true);
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
        // console.log(result);
        await setActive({ session: result.createdSessionId });
        navigate("/home");
      } else {
        console.log(result);
      }
    } catch (err) {
      setLoginError(err.errors[0].longMessage);
    }
  };


  return (
    <div className="p-8 flex items-center justify-center h-auto bg-white flex-col dark:bg-background_dark">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs border-gray-100 dark:backdrop-blur-lg dark:bg-zinc-600/50 dark:border-zinc-500 dark:text-white"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex flex-row justify-center">
          <img
            // src="./iconwhite.png"
            src={isDarkMode ? "./iconwhite.png" : "./iconblack.png"}
            className="self-center mr-2 h-6 sm:h-9"
            alt="Cover.AI Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Cover.AI
          </span>
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-black text-sm font-bold mb-2 dark:text-white"
          >
            Email
          </label>
          <input
            id="email"
            onChange={(e) => setEmailAddress(e.target.value)}
            className="appearance-none border-0 border-t-1 border-b-2 border-black w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:border-black rounded-md dark:bg-zinc-400"
            placeholder="you@example.com"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-black text-sm font-bold mb-2 dark:text-white"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none border-0 border-t-1 border-b-2 border-black w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:border-black dark:bg-zinc-400 rounded-md"
            placeholder="******************"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-blue focus:shadow-outline transition-colors duration-200 ease-in-out"
          >
            Login
          </button>
        </div>
        <div className="justify-center my-2">
          {loginError && <p className="text-red-700">{loginError}</p>}
        </div>
      </form>
      <div className="w-full max-w-xs text-center my-5 dark:text-white">
        <p className="my-2">
          No account?{" "}
          <Link className="text-blue-500" to="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}


export default Login;