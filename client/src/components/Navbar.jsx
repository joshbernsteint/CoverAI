import React from "react";
import logo from "../assets/iconblack.png";
import { Link, NavLink } from "react-router-dom";
import { Navbar } from "flowbite-react";
import { SignIn, UserButton, SignInButton } from "@clerk/clerk-react";

const NavbarComp = ({ userAuthenticated }) => {

  const navItems = [
    { name: "Home", href: "/home" },
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
    <nav className="flex items-center justify-between px-4 py-2">
      <ul className="flex items-center w-full justify-between">
        <div>
          <li>
            <NavLink to="/home">
              <img src={logo} alt="logo" className="w-12" />
            </NavLink>
          </li>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex gap-4 items-center">
            {userAuthenticated
              ? navItemsAuth.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.href}
                      className="hover:text-gray-400 font-body"
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))
              : navItems.map((item, index) => (
                  <li key={index}>
                    {item.name === "Sign Up" ? (
                      <NavLink
                        to={item.href}
                        className="hover:text-gray-400 font-body border-2 px-4 py-2 rounded-2xl border-[#474CF3]"
                      >
                        {item.name}
                      </NavLink>
                    ) : (
                      <NavLink
                        to={item.href}
                        className="hover:text-gray-400 font-body"
                      >
                        {item.name}
                      </NavLink>
                    )}
                  </li>
                ))}
            {userAuthenticated ? (
              () => <UserButton />
            ) : (
              <SignInButton className="font-body bg-[#474CF3] px-4 py-2 rounded-2xl text-white" />
            )}
          </div>
          <div>
            <UserButton />
          </div>
        </div>
      </ul>
    </nav>
  );
};

export default NavbarComp;
