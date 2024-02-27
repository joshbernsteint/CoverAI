import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";

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
    <form onSubmit={submit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button>Sign up</button>
      </div>
    </form>
  );
}
