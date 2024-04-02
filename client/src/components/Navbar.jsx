import React, { useEffect, useState } from "react";
import logo from "../assets/iconblack.png";
import { Link, NavLink} from "react-router-dom";

import { Navbar } from "flowbite-react";
import {
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useAuth,
  useUser,
} from "@clerk/clerk-react";

const NavbarComp = () => {
  const {isLoaded, isSignedIn} = useAuth();
  console.log(isLoaded, isSignedIn);

  const navItems = [
    { key: "1", name: "Home", href: "/home" },
    { key: "2", name: "Profile", href: "/edit-profile" },
    { key: "3", name: "Cover Letters", href: "/cover-letters" },
    { key: "4", name: "Cover Letter Editor", href: "/text-editor/1" },
    { key: "5", name: "About", href: "/about" },
    { key: "6", name: "Settings", href: "/settings" },
    { key: "7", name: "Login", href: "/login" },
  ];

  if(isLoaded && isSignedIn){
    // navItems[navItems.length - 1] = {key: "9", name: "Logout", href: "/logout"};
    navItems.pop();
  }

  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="/">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Cover.AI Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Cover.AI
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        {navItems.map(({ name, href }) => (
          <Link key={name} to={href}>
            {name}
          </Link>
        ))}
        {isLoaded && isSignedIn ? (<SignOutButton displayName="Logout"/>) : (<></>)}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComp;
