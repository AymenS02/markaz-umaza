'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from "./authContext";

// Dynamically import to avoid SSR mismatches
const DarkModeToggle = dynamic(() => import('@/darkMode'), { ssr: false });

const Header = () => {
  const { user } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  // Plain JS ref (no TypeScript generic) so this works in .jsx files
  const headerRef = useRef(null);

  useEffect(() => {
    setHydrated(true);
    // you can log user here if you want
    // console.log("User in Header:", user);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const el = headerRef.current;
    if (!el) return;

    const setVar = () => {
      // set CSS variable on the root so other components can use it
      document.documentElement.style.setProperty('--header-height', `${el.offsetHeight}px`);
    };

    setVar();

    // Watch for changes in header size (responsive, font changes, etc.)
    const ro = new ResizeObserver(() => setVar());
    ro.observe(el);

    return () => ro.disconnect();
  }, [hydrated]);

  if (!hydrated) return null; // Prevent SSR/client mismatch

  return (
    <header
      ref={headerRef}
      className="max-md:hidden fixed top-0 left-0 w-full px-2 bg-background/50 backdrop-blur-xl text-foreground shadow-lg border-b-2 border-foreground/10 z-50"
    >
      <div className="max-w-[90%] mx-auto flex items-center justify-between py-2">
        {/* Logo */}
        <div className="flex items-center">
          <div
            className="mr-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => (window.location.href = '/')}
          >
            <Image
              src="/assets/markaz_umaza_header_logo.svg"
              alt="Fitrah Foundation Logo"
              className="w-24 h-18 object-fit"
              width={24}
              height={18}
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

          {user ? (
            <>
              <Link
                href="/courses"
                className="px-6 py-2 rounded-full font-bold border-2 border-secondary text-secondary hover:bg-secondary hover:text-background hover:scale-105 transition-all duration-300 cursor-pointer shadow-md"
              >
                Courses
              </Link>

              <Link
                href="/account"
                className="px-6 py-2 rounded-full font-bold bg-primary text-background hover:bg-accent hover:scale-105 transition-all duration-300 cursor-pointer shadow-md"
              >
                Account
              </Link>

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
            <Link
              href="/sign-up"
              className="px-6 py-2 rounded-full font-bold bg-primary text-background hover:bg-accent hover:scale-105 transition-all duration-300 cursor-pointer shadow-md"
            >
              Sign Up
            </Link>
          )}

          {/* <DarkModeToggle /> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;