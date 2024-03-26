import { useEffect, useState } from "react";
import { useSignUp, useSignIn } from "@clerk/chrome-extension";
import { useNavigate } from "react-router-dom";
 
export default function Settings() {
  const {isLoaded, signIn} = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();



  useEffect(() => {
    if(!isLoaded) return;
    else if(signIn.status !== "complete") navigate("/login");
  }, [isLoaded]);

  return (
    <div>
      Settings
    </div>
  );
}