'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const HeroTextAnimation = () => {
  const enTextRef = useRef(null);
  const arTextRef = useRef(null);
  const currentIndex = useRef(0);
  const timelineRef = useRef(null);

  const words = [
    { en: "Learn Arabic", ar: "تعلم العربية" },
    { en: "Master Language", ar: "أتقن اللغة" },
    { en: "Discover Culture", ar: "اكتشف الثقافة" }
  ];

  useEffect(() => {
    const en = enTextRef.current;
    const ar = arTextRef.current;
    if (!en || !ar) return;

    // Initial states
    gsap.set(en, { opacity: 1, y: 0, display: 'flex' });
    gsap.set(ar, { opacity: 0, y: 20, display: 'flex' });

    const createTimeline = () => {
      const tl = gsap.timeline({
        repeat: -1,
        onRepeat: () => {
          // Cycle to next phrase on each full loop
          currentIndex.current = (currentIndex.current + 1) % words.length;
        }
      });

      // Phase 1: Show English
      tl.to(en, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'power2.out' 
      })
      .to({}, { duration: 1.5 }) // Hold English visible

      // Phase 2: Transition English → Arabic
      .to(en, { 
        opacity: 0, 
        y: -30, 
        duration: 0.5, 
        ease: 'power2.in' 
      })
      .set(ar, { 
        y: 30 
      }, '<0.4') // Prepare Arabic to come from below at same time
      .call(() => {
        // Update Arabic text while transitioning
        ar.textContent = words[currentIndex.current].ar;
      }, null, '<')
      .to(ar, { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        ease: 'power2.out' 
      }, '<0.4') // Slight overlap for smooth crossfade

      // Phase 3: Show Arabic
      .to({}, { duration: 1.5 }) // Hold Arabic visible

      // Phase 4: Transition Arabic → English
      .to(ar, { 
        opacity: 0, 
        y: -30, 
        duration: 0.5, 
        ease: 'power2.in' 
      })
      .set(en, { 
        y: 30 
      }, '<0.4') // Prepare English to come from below
      .call(() => {
        // Update English text for next cycle while transitioning
        const nextIndex = (currentIndex.current + 1) % words.length;
        en.textContent = words[nextIndex].en;
      }, null, '<')
      .to(en, { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        ease: 'power2.out' 
      }, '<0.4'); // Slight overlap for smooth crossfade

      return tl;
    };

    timelineRef.current = createTimeline();

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <div className="relative min-h-[120px] flex items-center justify-center lg:justify-start w-full overflow-visible">
      {/* English Text */}
      <h1
        ref={enTextRef}
        className="font-bold text-5xl sm:text-6xl lg:text-7xl
                  text-transparent bg-clip-text bg-gradient-to-r 
                  from-primary via-accent to-primary bg-[length:200%_auto] 
                  animate-gradient whitespace-nowrap"
      >
        Learn Arabic
      </h1>

      {/* Arabic Text */}
      <h1
        ref={arTextRef}
        dir="rtl"
        className="font-bold text-5xl sm:text-6xl lg:text-7xl
                  text-transparent bg-clip-text bg-gradient-to-r 
                  from-primary via-accent to-primary bg-[length:200%_auto] 
                  animate-gradient whitespace-nowrap absolute"
      >
        تعلم العربية
      </h1>
    </div>
  );
};

export default HeroTextAnimation;