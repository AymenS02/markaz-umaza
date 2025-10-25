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
    <header className="max-md:hidden fixed top-0 left-0 w-full px-3 py-2 bg-background text-foreground shadow-lg z-50">
      <div className="max-w-[90%] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div
            className="w-36 h-36 mr-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => window.location.href='/'}
          >
            <Image
              src="/assets/markaz_umaza_header_logo.svg"
              alt="Fitrah Foundation Logo"
              className="w-full h-full object-contain"
              width={120}
              height={120}
              priority
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-secondary hover:text-primary hover:scale-105 transition-all duration-300 font-medium">
            Home
          </Link>

          <Link href="/instructors" className="text-secondary hover:text-primary hover:scale-105 transition-all duration-300 font-medium">
            Instructors
          </Link>

          <Link href="/articles" className="text-secondary hover:text-primary hover:scale-105 transition-all duration-300 font-medium">
            Articles
          </Link>

          <Link href="/contact" className="text-secondary hover:text-primary hover:scale-105 transition-all duration-300 font-medium">
            Contact Us
          </Link>

          {/* Conditional buttons */}
          {user ? (
            <>
              {/* Courses button */}
              <Link
                href="/courses"
                className="px-4 py-2 rounded-full font-medium border-2 border-secondary text-secondary hover:bg-secondary hover:text-background hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                Courses
              </Link>

              {/* Account button */}
              <Link
                href="/account"
                className="px-4 py-2 rounded-full font-medium bg-primary text-background hover:bg-accent hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                Account
              </Link>

              {/* Admin button only for admins */}
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-full font-medium bg-accent text-background hover:bg-primary hover:shadow-lg hover:shadow-accent/30 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  Admin
                </Link>
              )}
            </>
          ) : (
            // Show Sign Up if not logged in
            <Link
              href="/sign-up"
              className="px-4 py-2 rounded-full font-medium bg-primary text-background hover:bg-accent hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300 cursor-pointer"
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
