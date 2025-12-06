'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useAuth } from '../components/authContext';
import { X, Menu, Home, BookOpen, Mail, Users } from 'lucide-react';

// Dynamically import to avoid SSR mismatch
const DarkModeToggle = dynamic(() => import('@/darkMode'), { ssr: false });

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // Wait for client hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Disable body scroll while sidebar open
  useEffect(() => {
    if (!hydrated) return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, hydrated]);

  if (!hydrated) return null; // Prevent hydration mismatch

  return (
    <>
      {/* Hamburger button (moved slightly up so header overlaps hero) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-2 right-4 z-50 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 font-montserrat text-white"
        aria-label="Toggle menu"
        style={{ background: 'linear-gradient(to right, #dea10d, #ebca00)' }}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay (click outside to dismiss) */}
      <button
        aria-label="Dismiss sidebar"
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } bg-black/35 backdrop-blur-sm`}
        onClick={toggleSidebar}
      />

      {/* Sidebar (frosty, transparent) */}
      <aside
        className={`md:hidden fixed top-0 right-0 h-full w-80 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } bg-background/40 backdrop-blur-2xl border-l border-foreground/10 shadow-2xl`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        {/* Header (reduced vertical padding to half) */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 p-2 flex items-center justify-center">
              <Image
                src="/assets/logo-skeleton.svg"
                alt="Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <h2 className="text-lg font-extrabold text-primary font-montserrat">Menu</h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full transition-all hover:bg-primary/10 hover-yellow-outline"
            aria-label="Close menu"
          >
            <X size={20} className="text-secondary" />
          </button>
        </div>

        <nav className="flex flex-col mt-4 space-y-2 px-4 overflow-y-auto h-[calc(100%-150px)] font-montserrat">
          {/* Navigation Links with Icons */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="relative flex items-center gap-3 px-4 py-3 rounded-full text-secondary hover:text-primary hover:bg-primary/10 transition-all duration-300 font-medium group"
          >
            <Home size={20} className="group-hover:scale-110 transition-transform" />
            <span>Home</span>
            {/* yellow bar lowered on hover (bottom-2) */}
            <span
              className="absolute left-4 bottom-2 w-6 h-1 rounded-full transition-all opacity-0 group-hover:opacity-100"
              style={{ background: 'linear-gradient(to right, #dea10d, #ebca00)' }}
            />
          </Link>

          <Link
            href="/instructors"
            onClick={() => setIsOpen(false)}
            className="relative flex items-center gap-3 px-4 py-3 rounded-full text-secondary hover:text-primary hover:bg-primary/10 transition-all duration-300 font-medium group"
          >
            <Users size={20} className="group-hover:scale-110 transition-transform" />
            <span>Instructors</span>
            <span
              className="absolute left-4 bottom-2 w-6 h-1 rounded-full transition-all opacity-0 group-hover:opacity-100"
              style={{ background: 'linear-gradient(to right, #dea10d, #ebca00)' }}
            />
          </Link>

          {!user && (
            <Link
              href="/courses"
              onClick={() => setIsOpen(false)}
              className="relative flex items-center gap-3 px-4 py-3 rounded-full text-secondary hover:text-primary hover:bg-primary/10 transition-all duration-300 font-medium group"
            >
              <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
              <span>Courses</span>
              <span
                className="absolute left-4 bottom-2 w-6 h-1 rounded-full transition-all opacity-0 group-hover:opacity-100"
                style={{ background: 'linear-gradient(to right, #dea10d, #ebca00)' }}
              />
            </Link>
          )}

          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="relative flex items-center gap-3 px-4 py-3 rounded-full text-secondary hover:text-primary hover:bg-primary/10 transition-all duration-300 font-medium group"
          >
            <Mail size={20} className="group-hover:scale-110 transition-transform" />
            <span>Contact Us</span>
            <span
              className="absolute left-4 bottom-2 w-6 h-1 rounded-full transition-all opacity-0 group-hover:opacity-100"
              style={{ background: 'linear-gradient(to right, #dea10d, #ebca00)' }}
            />
          </Link>

          {/* Divider */}
          <div className="border-t border-primary/10 my-4" />

          {/* Auth-dependent buttons */}
          {user ? (
            <>
              <Link
                href="/courses"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-full font-normal border-2 border-[#dea10d] text-[#dea10d] hover:bg-[#dea10d] hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer text-center uppercase hover-yellow-outline"
              >
                Courses
              </Link>

              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-full font-normal text-white"
                style={{ background: 'linear-gradient(to right, #dea10d, #ebca00)' }}
              >
                Account
              </Link>

              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-full font-normal text-white bg-accent hover:bg-primary hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer text-center"
                >
                  Admin
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-full font-normal text-white"
              style={{ background: 'linear-gradient(to right, #dea10d, #ebca00)' }}
            >
              Sign Up
            </Link>
          )}
        </nav>

        {/* Footer with Dark Mode Toggle (optional) */}
        {/* <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-primary/20 bg-gradient-to-t from-primary/5 to-transparent">
          <DarkModeToggle />
        </div> */}
      </aside>

      {/* Utility styles for neon shadow on yellow-outline hover */}
      <style jsx>{`
        .hover-yellow-outline:hover {
          outline: 2px solid #dea10d;
          box-shadow: 0 0 18px #ffff33;
        }
      `}</style>
    </>
  );
};

export default Sidebar;