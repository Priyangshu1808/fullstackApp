"use client";

import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

export const Navbar = () => {
  const {data: session} = useSession()
  const user: User = session?.user as User


  return (
    <nav className='p-4 md:p-6 shadow-md'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <a className='text-xl font-bold mb-4 md:mb-0' href='#'>
          Mystry Message
        </a>

        {session ? (
          <>
            <span className='mr-4'>
              Welcome, { user?.userName || "User"}
            </span>
            <Button onClick={() => signOut()} className="w-full md:w-auto">Logout</Button>
          </>
        ) : (
          <Link href='/sign-in'>
            <Button className="w-full md:w-auto">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

  