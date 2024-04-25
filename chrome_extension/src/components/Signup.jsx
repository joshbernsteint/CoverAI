import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp({settings, ...props}) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(settings ? settings.isDarkMode : true);
  const navigate = useNavigate();

  const { isLoaded, signUp, setActive } = useSignUp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignUpError("");
    if (!isLoaded) {
      return;
    }

    if (!emailAddress || !password) {
      setSignUpError("Fill in all fields");
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // sends the email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      setSignUpError(err.errors[0].longMessage);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        navigate("/");
      }
    } catch (err) {
      setSignUpError(err.errors[0].longMessage);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="p-8 flex items-center justify-center bg-white flex-col dark:bg-background_dark">
      {!pendingVerification && (
        <>
          <form
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs border-gray-100 dark:backdrop-blur-lg dark:bg-zinc-600/50 dark:border-zinc-500 dark:text-white"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="flex flex-row justify-center items-center">
              <img
                src={isDarkMode ? "./iconblack.png" : "./iconwhite.png"}
                className="mr-2 h-6 sm:h-9"
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
                className="appearance-none border-0 border-t-1 border-b-2 border-black w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:border-black rounded-md dark:bg-zinc-400"
                placeholder="******************"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-blue focus:shadow-outline transition-color duration-200 ease-in-out"
              >
                Sign up
              </button>
            </div>
            <div className="justify-center my-2">
              {signUpError !== "" && (
                <p className="text-red-700">{signUpError}</p>
              )}
            </div>
          </form>
          <div className="w-full max-w-xs text-center my-5">
            <p className="my-2 dark:text-white">
              Already have an account?{" "}
              <Link className="text-blue-500" to="/login">
                Login
              </Link>
            </p>
          </div>
        </>
      )}
      {pendingVerification && (
        <>
          <div className="flex items-center justify-center h-screen bg-white">
            <form className="p-8 max-w-sm bg-white rounded-lg border border-gray-100 shadow-md w-full max-w-xs">
              <button
                onClick={() => {
                  setPendingVerification(false);
                  setSignUpError("");
                }}
                className="top-2 left-2 text-3xl font-semibold text-black-700 hover:text-gray-900"
              >
                &#8592;
              </button>
              <p>Enter the verification code sent to your email address</p>
              <div className="mb-6 flex justify-between gap-2">
                <input
                  id="code"
                  onChange={(e) => setCode(e.target.value)}
                  className="appearance-none border-0 border-t-1 border-b-2 border-black w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:border-black"
                />
              </div>
              <button
                type="button"
                onClick={onPressVerify}
                className="w-full bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-blue focus:shadow-outline"
              >
                Verify Email
              </button>
              <div className="justify-center my-2">
                {signUpError !== "" && (
                  <p className="text-red-700">{signUpError}</p>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default SignUp;