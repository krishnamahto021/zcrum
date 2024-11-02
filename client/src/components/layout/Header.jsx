import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { PenBox } from "lucide-react";
import UserMenu from "../user/UserMenu";

const Header = () => {
  return (
    <header className="container mx-auto">
      <nav className="py-6 px-4 flex justify-between items-center">
        <Link to={"/"}>
          <img
            src="https://krishnabucket021.s3.ap-southeast-2.amazonaws.com/zcrum/logo.png"
            loading="lazy"
            className="h-10 w-auto object-contain"
          ></img>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/user/project/create">
            <Button variant="destructive" className="flex items-center gap-3">
              <PenBox size={16} />
              <span className="hidden md:inline">Create Project</span>
            </Button>
          </Link>
          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
