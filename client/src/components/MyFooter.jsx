import React from 'react'
import { Footer } from 'flowbite-react';
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';
import logo from "../assets/iconblack.png";
import logoDark from "../assets/iconwhite.png";
import { Context } from '../App';
import { useContext } from 'react';

const MyFooter = () => {
  const [isDarkMode, setIsDarkMode] = useContext(Context);
  return (
    <Footer container className=' dark:bg-midGrey dark:rounded-none'>
      <div className="w-full ">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Footer.Brand
              href="self link"
              src= {isDarkMode ? logoDark : logo}
              alt="Cover.AI Logo"
              name="Cover.AI"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Our Project</Footer.Link>
                <Footer.Link href="#">Our Developers</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Instagram</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider className=''/>
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Cover.AI™" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="https://github.com/joshbernsteint/CoverAI" icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  )
}

export default MyFooter