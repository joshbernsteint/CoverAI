import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import {
  SignOutButton,
  SignInButton,
  SignedIn,
  SignedOut,
  UserProfile,
} from "@clerk/clerk-react";

export default function SignUp() {
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

  return (
    <>
      <div>
        <SignedOut>
          <SignInButton />
          <p>
            This content is public. Only signed out users can see the
            SignInButton above this text.
          </p>
        </SignedOut>
        <SignedIn>
          <SignOutButton afterSignOutUrl="/" />
          <p>
            This content is private. Only signed in users can see the
            SignOutButton above this text.
          </p>
        </SignedIn>
      </div>
    </>
  );
}
