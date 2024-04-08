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
    { name: "Cover Letters", href: "/cover-letters" },
    { name: "Settings", href: "/settings" },
    { name: "Profile", href: "/edit-profile" },
  ];

  return (
    <nav className="flex items-center justify-between px-4 py-2">
      <ul className="flex items-center w-full justify-between">
        <div>
          <li>
            <NavLink to="/home" className="flex items-center">
              <img src={logo} alt="logo" className="w-12" />
              <h1 className="font-bold text-3xl">Cover.AI</h1>
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
              <></>
            ) : (
              // <SignInButton className="font-body bg-[#474CF3] px-4 py-2 rounded-2xl text-white" />
              <NavLink className={"font-body bg-[#474CF3] px-4 py-2 rounded-2xl text-white"} to={"/login"}>Sign In</NavLink>
            )}
          </div>
          <div>
            <UserButton afterSignOutUrl="/"/>
          </div>
        </div>
      </ul>
    </nav>
  );
};

export default NavbarComp;
