import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import apiClient from "../services/apiClient";
import { useEffect } from "react";

const SignUpClerk = () => {

//   useEffect(() => {
//     async function signUpUser() {
//       apiClient.setTokenRetrievalMethod(() =>
//         getToken().then((token) => token)
//       );
//       if (isSignedIn && user) {
//         const payload = {
//           firstName: user.firstName,
//           lastName: user.lastName,
//         };

//         // Theres a way to sync Clerk with the backend but I have to figure that out later. I only saw it with prisma but im using mongo so idk.
//         // Pray for me
//         apiClient.signUpUser(payload).then((res) => {
//           console.log(res);
//         });
//       }
//     }
//     signUpUser();
//   }, [isSignedIn, user]);
  return (
    <div>
      <SignedIn>
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
