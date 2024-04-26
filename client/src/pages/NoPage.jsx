import Navbar from "../components/Navbar";

import MyFooter from "../components/MyFooter";
import Error from "../assets/error.png"

export default function NoPage() {
  return (
    <>
        <div className="h-screen flex flex-col mt-12 items-center">
            <img src={Error} alt="404" />
            <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
            <p className="text-lg">Uh oh! Looks like you got lost in the sauce!</p>
            <button className="btn mt-4">
                <a href="/" className="text-white">Go back to Home</a>
            </button>
        </div>
    </>
  );
}
