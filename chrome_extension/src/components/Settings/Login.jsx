import { useClerk, useSignIn } from "@clerk/chrome-extension";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();
    const {isLoaded, signIn, setActive} = useSignIn();
    const { signOut } = useClerk();

    const [validate, setValidate] = useState({status: false, msg: ""});

    async function handleSubmit(e){
        const target = e.target;
        const email = target[0].value;
        console.log(email);
        setValidate({...{status: false, msg: "Invalid username"}})
        e.preventDefault();
        e.stopPropagation();
        // const password = target[1].value;
        // try {
        //     const result = await signIn.create({
        //         identifier: email,
        //         password,
        //       });
        //       if (result.status === "complete") {
        //         console.log(result);
        //         await setActive({ session: result.createdSessionId });
        //         navigate("/");
        //       }
        //       else {
        //         console.log(result);
        //       }
        // } catch (error) {
        //     console.log(error.errors[0].longMessage);
        // }
    }

    if(!isLoaded) return;
    
    return (
        <div className="signin-box">
        <h2>Login to CoverAI</h2>
        <form onSubmit={handleSubmit}>
        <label htmlFor=""><span className="signin-field">Enter Email Address:</span>
          <input type="text" placeholder="Username"/>
        </label><br/>
        <label htmlFor=""><span className="signin-field">Enter Password:</span>
          <input type="password" placeholder="Password"/>
        </label><br/>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? Create one <Link to={"/signup"}>here</Link></p>
      <button onClick={() => signOut(() => {console.log("singing out");})}>
            Sign out
        </button>
    </div>
    );
}

export default Login;