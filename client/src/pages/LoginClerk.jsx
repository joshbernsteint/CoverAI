import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useAuth,
} from "@clerk/clerk-react";
import axios from "axios";

const SignUpClerk = () => {
  const { getToken } = useAuth();
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
        <p>You are not signed in.</p>
        <SignInButton />
      </SignedOut>
    </div>
  );
};

export default SignUpClerk;
