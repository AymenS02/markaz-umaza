// app/contact/page.jsx
"use client";
import React from "react";
import {
  Mail, MapPin, Globe,
  Facebook, Twitter, Instagram, Send, Youtube
} from "lucide-react";

export default function ContactPage() {
  const onSubmit = (e) => e.preventDefault();

  return (
    <main className="bg-background text-foreground mt-20 md:mt-42">
      {/* Hero */}
      <section className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
        <h1 className="text-4xl font-extrabold text-center text-foreground md:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
          We'd love to hear from you — reach out with any questions, feedback, or collaboration ideas. 
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {/* LEFT: Form */}
          <form
            onSubmit={onSubmit}
            className="rounded-2xl bg-foreground/5 p-6 sm:p-8 hover:shadow-[0px_7px_10px_#b3ccc2] transition-all duration-500 hover:-translate-y-2 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-lg border border-foreground/20 bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-foreground/20 bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Message</label>
              <textarea
                rows={4}
                placeholder="Write your message here..."
                className="w-full rounded-lg border border-foreground/20 bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-[#f2b10d] to-[#ffdd00] px-4 py-3 text-white font-semibold hover:scale-105 transition-all shadow-xl uppercase"
            >
              Send Message
            </button>
          </form>

          {/* RIGHT:  Info card with rows like the example */}
          <div className="rounded-2xl bg-foreground/5 p-6 sm: p-8 hover:shadow-[0px_7px_10px_#b3ccc2] transition-all duration-500 hover:-translate-y-2">
            <h3 className="text-lg font-semibold text-primary mb-6">Contact Information</h3>

            <ul className="space-y-4 text-sm">
              {/* Email */}
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="font-medium text-foreground">Email Us</p>
                  <a
                    href="mailto:m.saleem@markazumaza.com"
                    className="text-foreground/70 hover:text-primary hover:underline transition-colors"
                  >
                    m.saleem@markazumaza.com
                  </a>
                </div>
              </li>

              {/* Location */}
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="font-medium text-foreground">Location</p>
                  <span className="text-foreground/70">Hamilton, Ontario</span>
                </div>
              </li>

              <hr className="my-2 border-foreground/10" />

              {/* Socials */}
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Facebook size={18} />
                </span>
                <div>
                  <p className="font-medium text-foreground">Facebook</p>
                  <a
                    href="https://www.facebook.com/markazumaza/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-primary hover:underline transition-colors"
                  >
                    facebook.com/markazumaza
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Instagram size={18} />
                </span>
                <div>
                  <p className="font-medium text-foreground">Instagram</p>
                  <a
                    href="https://www.instagram.com/markazumaza/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-primary hover: underline transition-colors"
                  >
                    @markazumaza
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Send size={18} />
                </span>
                <div>
                  <p className="font-medium text-foreground">Telegram</p>
                  <a
                    href="https://t.me/markazumaza"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover: text-primary hover:underline transition-colors"
                  >
                    t.me/markazumaza
                  </a>
                </div>
              </li>

              {/* YouTube */}
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Youtube size={18} />
                </span>
                <div>
                  <p className="font-medium text-foreground">YouTube</p>
                  <a
                    href="https://www.youtube.com/@markazumaza"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-primary hover:underline transition-colors"
                  >
                    @markazumaza
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}