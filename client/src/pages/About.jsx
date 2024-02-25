import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import {
  SignOutButton,
  SignInButton,
  SignedIn,
  SignedOut,
  UserProfile,
} from "@clerk/clerk-react";

export default function About() {
  

  return (
    <>
      <div>
        <button onClick={() => console.log("clicked")}>Click me About</button>
      </div>
    </>
  );
}
