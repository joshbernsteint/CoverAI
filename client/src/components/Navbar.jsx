import React from "react";
import logo from "../assets/iconblack.png";
import { Link, NavLink } from "react-router-dom";
import { Navbar } from "flowbite-react";

const NavbarComp = ({ userAuthenticated }) => {
  const navItems = [
    { name: "Home", href: "/home" },
    { name: "Login", href: "/login" },
    { name: "Sign Up", href: "/sign-up" },
  ];

  const navItemsAuth = [
    { name: "Home", href: "/home" },
    { name: "Profile", href: "/edit-profile" },
    { name: "Cover Letters", href: "/cover-letters" },
    { name: "Cover Letter Editor", href: "/text-editor/1" },
    { name: "About", href: "/about" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <nav className="navigation bg-gray-800">
      <ul>
        <div>
          <li>
            <NavLink to="/home">
              <img src={logo} alt="logo" className="w-12" />
            </NavLink>
          </li>
        </div>
        <div>
          {userAuthenticated
            ? navItemsAuth.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.href}
                    className="text-white hover:bg-gray-900"
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))
            : navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.href}
                    className="text-white hover:bg-gray-900"
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
        </div>
      </ul>
    </nav>
  );
};

export default NavbarComp;
