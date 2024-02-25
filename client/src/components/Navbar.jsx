fimport React from "react";
import Logo from "../assets/iconblack.png";

const Navbar = () => {
  const menuOptions = [
    { text: "Home", icon: "home", link: "/home" },
    { text: "About", icon: "about", link: "/about" },
  ];
  return (
    <nav>
      <div className="nav-logo-container"></div>
      <div className="navbar-links-container">
        {menuOptions.map((option) => (
          <a href={option.link} key={option.text}>
            {option.text}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
