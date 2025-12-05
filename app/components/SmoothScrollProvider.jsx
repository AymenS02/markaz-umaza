"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    let lenis;
    let isMobile = window.matchMedia("(max-width: 900px)").matches;

    const getScrollSettings = (mobile) => ({
      // Keep easing consistent
      duration: mobile ? 1 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      // Mobile: let native touch be snappy; disable smoothTouch/syncTouch
      smoothTouch: false,
      syncTouch: false,
      // Lower multipliers to reduce jitter/overshoot
      touchMultiplier: mobile ? 1 : 1.25,
      wheelMultiplier: 1,
      lerp: mobile ? 0.08 : 0.12,
      direction: "vertical",
      gestureDirection: "vertical",
      orientation: "vertical",
      infinite: false,
    });

    // Create lenis once
    lenis = new Lenis(getScrollSettings(isMobile));

    // ScrollTrigger scrollerProxy to read Lenis positions
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        } else {
          return lenis.scroll;
        }
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      // Use fixed pinType for mobile to avoid jitter
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    // Update ScrollTrigger on Lenis scroll
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Prefer Lenis RAF loop over gsap.ticker
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Build triggers after proxy
    ScrollTrigger.refresh();

    // Handle breakpoint changes without destroying instance
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const onChange = (e) => {
      isMobile = e.matches;
      const settings = getScrollSettings(isMobile);
      // Update settings on the existing instance (Lenis v1 supports .options update via new Lenis? If not, re-init cautiously)
      try {
        // If your Lenis version doesn’t allow live updates, do a controlled re-init:
        const currentScroll = lenis.scroll;
        lenis.destroy();
        lenis = new Lenis(settings);
        ScrollTrigger.scrollerProxy(document.body, {
          scrollTop(value) {
            if (arguments.length) {
              lenis.scrollTo(value, { immediate: true });
            } else {
              return lenis.scroll;
            }
          },
          getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
          },
          pinType: document.body.style.transform ? "transform" : "fixed",
        });
        lenis.scrollTo(currentScroll, { immediate: true });
        ScrollTrigger.refresh();
      } catch (err) {
        // Fallback: do nothing
      }
    };
    mediaQuery.addEventListener("change", onChange);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
      lenis?.destroy();
      // Clear any ScrollTrigger state if needed
      ScrollTrigger.kill();
    };
  }, []);

  return <>{children}</>;
}