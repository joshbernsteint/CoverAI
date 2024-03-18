import React, { useEffect, useState } from "react";
import logo from "../assets/iconblack.png";
import { Link, NavLink} from "react-router-dom";

import { Navbar } from "flowbite-react";

const NavbarComp = () => {
  const navItems = [
    { key: "1", name: "Home", href: "/home" },
    { key: "2", name: "Profile", href: "/edit-profile" },
    { key: "3", name: "Cover Letters", href: "/cover-letters" },
    { key: "4", name: "Cover Letter Editor", href: "/text-editor/1" },
    { key: "5", name: "About", href: "/about" },
    { key: "6", name: "Settings", href: "/settings" },
    { key: "7", name: "Login", href: "/login" },
    { key: "8", name: "Sign Up", href: "/sign-up" }, 
  ];

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
          <Navbar.Link key={name} href={href}>
            {name}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComp;
