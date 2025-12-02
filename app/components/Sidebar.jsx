'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useAuth } from '../components/authContext';
import { X, Menu, Home, BookOpen, FileText, Mail, Users } from 'lucide-react';

// Dynamically import to avoid SSR mismatch
const DarkModeToggle = dynamic(() => import('@/darkMode'), { ssr: false });

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Wait for client hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null; // Prevent hydration mismatch

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 right-4 z-50 p-3 rounded-full bg-primary text-background shadow-lg hover:bg-accent hover:shadow-primary/30 hover:scale-110 transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`md:hidden fixed top-0 right-0 h-full w-80 bg-background shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
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
            <h2 className="text-xl font-bold text-primary">Menu</h2>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="text-secondary hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col mt-6 space-y-2 px-4 overflow-y-auto h-[calc(100%-180px)]">
          {/* Navigation Links with Icons */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:text-primary hover:bg-primary/10 transition-all duration-300 font-medium group"
          >
            <Home size={20} className="group-hover:scale-110 transition-transform" />
            <span>Home</span>
          </Link>

          <Link
            href="/instructors"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:text-primary hover:bg-primary/10 transition-all duration-300 font-medium group"
          >
            <Users size={20} className="group-hover:scale-110 transition-transform" />
            <span>Instructors</span>
          </Link>
          
          {/* Courses link for non-authenticated users */}
          {!user && (
            <Link
              href="/courses"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:text-primary hover:bg-primary/10 transition-all duration-300 font-medium group"
            >
              <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
              <span>Courses</span>
            </Link>
          )}

          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:text-primary hover:bg-primary/10 transition-all duration-300 font-medium group"
          >
            <Mail size={20} className="group-hover:scale-110 transition-transform" />
            <span>Contact Us</span>
          </Link>

          {/* Divider */}
          <div className="border-t border-primary/10 my-4"></div>

          {/* Auth-dependent buttons */}
          {user ? (
            <>
              {/* Courses button */}
              <Link
                href="/courses"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-full font-medium border-2 border-secondary text-secondary hover:bg-secondary hover:text-background hover:scale-105 transition-all duration-300 cursor-pointer text-center"
              >
                Courses
              </Link>

              {/* Account button */}
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-full font-medium bg-primary text-background hover:bg-accent hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
              >
                Account
              </Link>

              {/* Admin button */}
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-full font-medium bg-accent text-background hover:bg-primary hover:shadow-lg hover:shadow-accent/30 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
                >
                  Admin
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-full font-medium bg-primary text-background hover:bg-accent hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
            >
              Sign Up
            </Link>
          )}
        </nav>

        {/* Footer with Dark Mode Toggle */}
        {/* <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-primary/20 bg-gradient-to-t from-primary/5 to-transparent">
          <DarkModeToggle />
        </div> */}
      </aside>
    </>
  );
};

export default Sidebar;