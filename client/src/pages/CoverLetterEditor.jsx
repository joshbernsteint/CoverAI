import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import {
  SignOutButton,
  SignInButton,
  SignedIn,
  SignedOut,
  UserProfile,
} from "@clerk/clerk-react";

export default function CoverLetterEditor() {
  

  return (
    <>
      <div>
        <button onClick={() => console.log("clicked")}>Click me Cover Letter Editor</button>
      </div>
    </>
  );
}
