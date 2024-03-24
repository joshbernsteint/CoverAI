import React, { useEffect, useState } from "react";
import logo from "../assets/iconblack.png";
import { Link, NavLink} from "react-router-dom";

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
    <Navbar>
      { userAuthenticated ?
        navItemsAuth.map(({ name, href }) => (
          <Link to={href} key={href}>{name}</Link>
        )) :
        navItems.map(({ name, href }) => (
          <Link to={href} key={href}>{name}</Link>
        ))
      }
    </Navbar>
  );
};

export default NavbarComp;
