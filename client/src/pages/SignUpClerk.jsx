import {
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useAuth,
  SignUp,
  useUser,
} from "@clerk/clerk-react";
import apiClient from "../services/apiClient";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

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
const navigate = useNavigate();
const {isLoaded, isSignedIn} = useAuth();


  useEffect(() => {
    if(isLoaded && isSignedIn){
      navigate("/")
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div style={{display: "flex", justifyContent: "center"}}>
      <SignedIn>
        <Navigate to={'/home'} />
      </SignedIn>
      <SignedOut>
        <SignUp signInUrl='/'/>
      </SignedOut>
    </div>
  );
};

export default SignUpClerk;
