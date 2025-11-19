'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from "./authContext";

// Dynamically import to avoid SSR mismatches
const DarkModeToggle = dynamic(() => import('@/darkMode'), { ssr: false });

const Header = () => {
  const { user } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    console.log("User in Header:", user);
  }, []);

  if (!hydrated) return null; // Prevent SSR/client mismatch

  return (
    <header className="max-md:hidden fixed top-0 left-0 w-full px-2 bg-background/95 backdrop-blur-md text-foreground shadow-lg border-b-2 border-foreground/10 z-50">
      <div className="max-w-[90%] mx-auto flex items-center justify-between py-2">
        {/* Logo */}
        <div className="flex items-center">
          <div
            className="mr-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => window.location.href='/'}
          >
            <Image
              src="/assets/markaz_umaza_header_logo.svg"
              alt="Fitrah Foundation Logo"
              className="w-24 h-24 object-fit"
              width={24}
              height={24}
              priority
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-foreground hover:text-primary hover:scale-105 transition-all duration-300 font-bold">
            Home
          </Link>

          <Link href="/instructors" className="text-foreground hover:text-primary hover:scale-105 transition-all duration-300 font-bold">
            Instructors
          </Link>

          <Link href="/contact" className="text-foreground hover:text-primary hover:scale-105 transition-all duration-300 font-bold">
            Contact Us
          </Link>

          {/* Conditional buttons */}
          {user ? (
            <>
              {/* Courses button */}
              <Link
                href="/courses"
                className="px-6 py-2 rounded-full font-bold border-2 border-secondary text-secondary hover:bg-secondary hover:text-background hover:scale-105 transition-all duration-300 cursor-pointer shadow-md"
              >
                Courses
              </Link>

              {/* Account button */}
              <Link
                href="/account"
                className="px-6 py-2 rounded-full font-bold bg-primary text-background hover:bg-accent hover:scale-105 transition-all duration-300 cursor-pointer shadow-md"
              >
                Account
              </Link>

              {/* Admin button only for admins */}
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-6 py-2 rounded-full font-bold bg-accent text-background hover:bg-primary hover:scale-105 transition-all duration-300 cursor-pointer shadow-md"
                >
                  Admin
                </Link>
              )}
            </>
          ) : (
            // Show Sign Up if not logged in
            <Link
              href="/sign-up"
              className="px-6 py-2 rounded-full font-bold bg-primary text-background hover:bg-accent hover:scale-105 transition-all duration-300 cursor-pointer shadow-md"
            >
              Sign Up
            </Link>
          )}

          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;