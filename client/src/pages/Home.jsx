import NavbarComp from "../components/Navbar";
import Home from "../components/Home";
import Services from "../components/Services";
import MyFooter from "../components/MyFooter";

export default function HomePage() {
  return (
    <>
      <NavbarComp />
      <Home />
      <Services />
      <MyFooter />
    </>
  );
}
