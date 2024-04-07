import {
  SignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const LoginClerk = () => {
  return (
    <div style={{display: "flex", justifyContent: "center"}}>
      <SignedIn>
        <Navigate to={'/home'} />
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

export default LoginClerk;
