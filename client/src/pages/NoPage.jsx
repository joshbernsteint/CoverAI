import Navbar from "../components/Navbar";

import MyFooter from "../components/MyFooter";

export default function NoPage() {
  return (
    <>
        <Navbar />
        <div className="h-screen flex justify-center items-center">
            <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
        </div>
        <MyFooter />
    </>
  );
}
