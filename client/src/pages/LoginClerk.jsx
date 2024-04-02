import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useAuth,
  SignIn,
} from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";
import {useNavigate} from 'react-router-dom';

const SignUpClerk = () => {
  const navigate = useNavigate();
  const { getToken, isSignedIn, isLoaded } = useAuth();
  useEffect(() => {
    if(isLoaded && isSignedIn){
      navigate("/");
    }
  }, [isLoaded, isSignedIn])
  return (
    <div>
      <SignedIn>
        <button
          onClick={async () => {
            const settings = {
              dark_mode: true,
              suggest_cl: false,
              auto_download_cl: false,
            };
            console.log(await getToken());
            const response = await axios.post(
              "https://cover-ai-server-three.vercel.app/users/settings",
              { settings },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${await getToken()}`,
                },
              }
            );
            console.log(response);
          }}
        >
          Click me{" "}
        </button>
        <p>You are signed in.</p>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
      <SignIn
          afterSignInUrl='/'
          signUpUrl='/sign-up'
        />
      </SignedOut>
    </div>
  );
};

export default SignUpClerk;
