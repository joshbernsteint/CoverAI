import { useContext, useState } from "react";
import logo from "../assets/iconblack.png";
import logoDark from "../assets/iconwhite.png";
import { NavLink } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { Context, MobileContext } from "../App.jsx";

import PropTypes from "prop-types";

NavbarComp.propTypes = {
  userAuthenticated: PropTypes.bool,
};

function NavbarComp({ userAuthenticated }) {
  // eslint-disable-next-line no-unused-vars
  const [isDarkMode, setIsDarkMode] = useContext(Context);
  const isMobile = useContext(MobileContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav className="flex sticky top-0 z-[50] items-center shadow-sm-light justify-between px-4 py-2 backdrop-blur-lg bg-white/50 dark:bg-background_dark/50 dark:shadow-sm">
      <ul className="flex items-center w-full justify-between">
        <div>
          <li>
            <NavLink to="/home" className="flex items-center">
              <img
                src={isDarkMode ? logoDark : logo}
                alt="logo"
                className="w-8 sm:w-10 md:w-12"
              />
              <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
                Cover.AI
              </h1>
            </NavLink>
          </li>
        </div>
        {!isMobile && (
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
                <NavLink
                  className={
                    "font-body bg-[#474CF3] px-4 py-2 rounded-2xl text-white"
                  }
                  to={"/login"}
                >
                  Sign In
                </NavLink>
              )}
            </div>
            <div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        )}
        {isMobile && (
          <div>
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="focus:outline-none"
              >
                {!isMobileMenuOpen ? "Menu" : "Close"}
              </button>
            </div>
          </div>
        )}
      </ul>
      {isMobile && isMobileMenuOpen && (
        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } flex-col gap-4 items-center rounded-b-lg backdrop-blur-lg transition-all duration-75 ease-in list-none absolute top-12 left-0 w-full bg-white/80 dark:bg-background_dark/80 dark:shadow-sm p-4 z-[50]`}
        >
          {userAuthenticated
            ? navItemsAuth.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.href}
                    className="hover:text-gray-400 font-body"
                    onClick={() => setIsMobileMenuOpen(false)}
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
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="hover:text-gray-400 font-body border-2 px-4 py-2 rounded-2xl border-[#474CF3]"
                    >
                      {item.name}
                    </NavLink>
                  ) : (
                    <NavLink
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
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
            <NavLink
              onClick={() => setIsMobileMenuOpen(false)}
              className={
                "font-body bg-[#474CF3] px-4 py-2 rounded-2xl text-white"
              }
              to={"/login"}
            >
              Sign In
            </NavLink>
          )}
          <div>
            <UserButton
              afterSignOutUrl="/"
              onClick={() => {
                setIsMobileMenuOpen(false);
                localStorage.clear();
              }}
            />
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavbarComp;
