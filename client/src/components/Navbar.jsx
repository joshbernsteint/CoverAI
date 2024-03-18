import React, { useEffect, useState } from "react";
import logo from "../assets/iconblack.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenu] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const toggleMenu = () => {
    setIsMenu(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const navItems = [
    { key: "1", name: "Home", href: "/home" },
    { key: "2", name: "Profile", href: "/edit-profile" },
    { key: "3", name: "Cover Letters", href: "/cover-letters" },
    { key: "4", name: "Cover Letter Editor", href: "/text-editor/1" },
    { key: "5", name: "About", href: "/about" },
    { key: "6", name: "Settings", href: "/settings" },
  ];
  return (
    <header className="w-full bg-white fixed top-0 left-0 right-0">
      <nav className={`py-4 lg:px-14 px-4`}>
        <div className="flex justify-between items-center gap-8 text-base">
          <a className="flex items-center text-primary">
            <img src={logo} alt="logo" className="w-10" />
            Cover.AI
          </a>
          <ul className="md:flex items-center space-x-12 hidden">
            {navItems.map(({ name, href }) => (
              <Link to={href} className="block text-base text-secondary hover:text-greyishPurple" key={name}>{name}</Link>
            ))}
          </ul>

          <div className="space-x-12 hidden lg:flex items-center">
            <button className="hidden lg:flex items-center text-primary hover:text-greyishPurple text-base">
              <Link to='/login'>Login</Link>
            </button>
            {/* <Link to="/sign-up" className="bg-primary text-white py-2 px-4 transition-all duration-300 rounded text-base hover:bg-greyishPurple"/> */}
            <button className="bg-primary text-white py-2 px-4 transition-all duration-300 rounded text-base hover:bg-greyishPurple">
              <Link to="/sign-up">Sign Up</Link>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
