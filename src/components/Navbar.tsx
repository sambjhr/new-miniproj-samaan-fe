"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { status } = useSession();

  const isLoggedIn = status === "authenticated";

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-3">
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <Link href="/">
            <img
              src="/gambar/logo/samaannyamping.png"
              alt="logo"
              className="h-[71px] cursor-pointer md:h-10 md:w-[186px]"
            />
          </Link>
        </div>

        {/* CENTER: Menu */}
        <nav className="flex flex-1 items-center justify-center gap-6 font-medium text-gray-700">
          <Link href="/">Home</Link>
          <Link href="/browse-event">Browse Event</Link>

          {/* Only show when logged in */}
          {isLoggedIn && (
            <>
              <Link href="/create-event">Create Event</Link>
              <Link href="/create-promotion">Create Promotion</Link>
              <Link href="/transactions">My Transaction</Link>
            </>
          )}
        </nav>

        {/* RIGHT: Auth Button */}
        <div className="flex items-center">
          {status === "unauthenticated" ? (
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          ) : status === "authenticated" ? (
            <Button variant="destructive" onClick={() => signOut()}>
              Sign Out
            </Button>
          ) : (
            // status === "loading"
            <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;