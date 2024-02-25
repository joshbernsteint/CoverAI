import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import {
  SignOutButton,
  SignInButton,
  SignedIn,
  SignedOut,
  UserProfile,
} from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="home-container">
      hello in home
      <Navbar />
    </div>
  );
}
