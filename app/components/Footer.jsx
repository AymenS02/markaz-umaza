import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
  Instagram, Youtube, Mail, Phone, MessageCircle
} from "lucide-react";

const Footer = () => {
  return (
    <footer className='bg-card border-t border-primary/20 text-foreground py-12'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 items-start'>
          
          {/* Brand Section */}
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-full bg-primary/10 p-2 flex items-center justify-center'>
                <Image 
                  src="/assets/logo-skeleton.svg" 
                  alt="Markaz Umaza Logo" 
                  width={32} 
                  height={32}
                  className='object-contain'
                />
              </div>
              <h2 className='text-2xl font-bold text-primary'>Markaz Umaza</h2>
            </div>
            <p className='text-secondary text-sm leading-relaxed'>
              Awakening curiosity and understanding through the Arabic language.
            </p>
            <p className='text-foreground/60 text-xs mt-2'>
              © 2025 Markaz Umaza. All rights reserved.
            </p>
          </div>

          {/* Contact Section */}
          <div className='flex flex-col gap-4'>
            <h3 className='text-lg font-semibold text-primary mb-2'>Get In Touch</h3>
            
            <a 
              href="tel:+12894569089" 
              className='flex items-center gap-3 text-secondary hover:text-primary transition-colors duration-300 group'
            >
              <div className='w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <Phone size={16} className='group-hover:scale-110 transition-transform' />
              </div>
              <span className='text-sm'>+1 (289) 456-9089</span>
            </a>

            <a 
              href="https://wa.me/12894569089" 
              target="_blank"
              rel="noopener noreferrer"
              className='flex items-center gap-3 text-secondary hover:text-primary transition-colors duration-300 group'
            >
              <div className='w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <MessageCircle size={16} className='group-hover:scale-110 transition-transform' />
              </div>
              <span className='text-sm'>WhatsApp / Telegram</span>
            </a>

            <a 
              href="mailto:m.saleem@markazumaza.com" 
              className='flex items-center gap-3 text-secondary hover:text-primary transition-colors duration-300 group'
            >
              <div className='w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <Mail size={16} className='group-hover:scale-110 transition-transform' />
              </div>
              <span className='text-sm'>m.saleem@markazumaza.com</span>
            </a>
          </div>

          {/* Social Media Section */}
          <div className='flex flex-col gap-4'>
            <h3 className='text-lg font-semibold text-primary mb-2'>Connect With Us</h3>
            <div className='flex gap-3'>
              <a 
                href="https://wa.me/12894569089" 
                target="_blank"
                rel="noopener noreferrer"
                className='w-10 h-10 rounded-lg bg-secondary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group'
                aria-label="WhatsApp"
              >
                <Image 
                  src="/assets/whatsapp.png" 
                  alt="WhatsApp" 
                  width={20} 
                  height={20}
                  className='group-hover:scale-110 transition-transform'
                />
              </a>

              <a 
                href="https://t.me/markazumaza" 
                target="_blank"
                rel="noopener noreferrer"
                className='w-10 h-10 rounded-lg bg-secondary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group'
                aria-label="Telegram"
              >
                <Image 
                  src="/assets/telegram.png" 
                  alt="Telegram" 
                  width={20} 
                  height={20}
                  className='group-hover:scale-110 transition-transform'
                />
              </a>

              <a 
                href="https://instagram.com/markazumaza" 
                target="_blank"
                rel="noopener noreferrer"
                className='w-10 h-10 rounded-lg bg-secondary/10 hover:bg-accent/20 flex items-center justify-center text-secondary hover:text-accent transition-all duration-300 hover:scale-110'
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>

              <a 
                href="https://youtube.com/@markazumaza" 
                target="_blank"
                rel="noopener noreferrer"
                className='w-10 h-10 rounded-lg bg-secondary/10 hover:bg-error/20 flex items-center justify-center text-secondary hover:text-error transition-all duration-300 hover:scale-110'
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>

            {/* Quick Links */}
            <div className='mt-4'>
              <h4 className='text-sm font-semibold text-secondary mb-3'>Quick Links</h4>
              <div className='flex flex-col gap-2'>
                <Link 
                  href="/about" 
                  className='text-sm text-foreground/70 hover:text-primary transition-colors duration-300'
                >
                  About Us
                </Link>
                <Link 
                  href="/privacy" 
                  className='text-sm text-foreground/70 hover:text-primary transition-colors duration-300'
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className='text-sm text-foreground/70 hover:text-primary transition-colors duration-300'
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        {/* <div className='mt-12 pt-8 border-t border-primary/10 text-center'>
          <p className='text-sm text-foreground/60'>
            Built by <span className='text-accent'>Aymen Shoteri</span>
          </p>
        </div> */}
      </div>
    </footer>
  )
}

export default Footer