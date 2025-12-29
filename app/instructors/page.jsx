'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Award, BookOpen, GraduationCap, Sparkles, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const InstructorsPage = () => {
  const headerRef = useRef(null);
  const instructorsRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y:  0 });

  useEffect(() => {
    // Header animation
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        }
      );
    }

    // Instructor cards animation
    if (instructorsRef.current) {
      const cards = instructorsRef.current.querySelectorAll('.instructor-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y:  0,
          duration: 0.8,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: instructorsRef. current,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const calculateRotation = () => {
    const maxRotation = 15;
    const rotateY = (mousePosition.x / 150) * maxRotation;
    const rotateX = -(mousePosition.y / 150) * maxRotation;
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  return (
    <div className='overflow-hidden min-h-screen bg-background pt-24 md:pt-42'>
      {/* Header Section */}
      <div ref={headerRef} className='relative pt-32 pb-20'>
        <div className='container mx-auto px-4 relative z-10'>
          <div className='text-center max-w-4xl mx-auto'>
            <div className='flex items-center justify-center gap-2 mb-6'>
              <Sparkles className="text-primary" size={24} />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Meet Your Teachers
              </span>
            </div>
            
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6'>
              Our <span className='text-primary'>Expert Instructors</span>
            </h1>
            
            <p className='text-xl md:text-2xl text-foreground/70 leading-relaxed'>
              Learn from qualified scholars dedicated to helping you master Arabic and connect with its rich cultural heritage
            </p>

            {/* Stats Bar */}
            <div className='flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-primary/20'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-primary'>10+</div>
                <div className='text-sm text-foreground/60'>Years Experience</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-accent'>150+</div>
                <div className='text-sm text-foreground/60'>Students Taught</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-secondary'>5+</div>
                <div className='text-sm text-foreground/60'>Courses Created</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructors Section */}
      <div ref={instructorsRef} className='container mx-auto px-4 pb-20'>
        <div className='max-w-6xl mx-auto space-y-16'>
          
          {/* Instructor 1 - Ustadh Umair */}
          <div className='instructor-card group'>
            <div className='bg-card backdrop-blur-sm rounded-3xl border-2 border-foreground/10 hover:border-primary/40 transition-all duration-500 overflow-hidden hover:shadow-xl'>
              <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 p-8 lg:p-12'>
                
                {/* Image Section */}
                <div className='lg:col-span-2 flex flex-col items-center justify-center'>
                  <div 
                    className='relative cursor-pointer'
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Image container with 3D rotation */}
                    <div 
                      className='relative w-64 h-64 rounded-full bg-primary/20 p-2 transition-transform duration-200 ease-out'
                      style={{ transform: calculateRotation() }}
                    >
                      <div className='w-full h-full rounded-full bg-card p-8 flex items-center justify-center'>
                        <div className='w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden'>
                          <Image
                            src="/assets/instructor_umair.svg"
                            alt="Instructor Image"
                            width={120}
                            height={120}
                            className="rounded-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className='lg:col-span-3 flex flex-col justify-center space-y-6'>
                  <div>
                    <h2 className='text-4xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors'>
                      Ustadh Umair
                    </h2>
                    <h3 className='text-xl font-semibold text-primary mb-4'>
                      Co-Founder of Markaz Umaza
                    </h3>
                  </div>

                  {/* Credentials */}
                  <div className='hover:shadow-amber-100/20 hover:shadow-md flex items-start gap-3 bg-primary/10 rounded-xl p-4 border border-primary/20 transition-all duration-300'>
                    <GraduationCap className='text-primary flex-shrink-0 mt-1' size={24} />
                    <div>
                      <h4 className='font-semibold text-foreground mb-1'>Education</h4>
                      <p className='text-foreground/70 leading-relaxed'>
                        Bachelor of Arts in Arabic Linguistics from the Islamic University of Madinah
                      </p>
                    </div>
                  </div>

                  {/* Expertise */}
                  <div className='hover:shadow-amber-100/20 hover:shadow-md flex items-start gap-3 bg-secondary/10 rounded-xl p-4 border border-secondary/20 transition-all duration-300'>
                    <BookOpen className='text-secondary flex-shrink-0 mt-1' size={24} />
                    <div>
                      <h4 className='font-semibold text-foreground mb-1'>Expertise</h4>
                      <p className='text-foreground/70 leading-relaxed'>
                        Specializes in Arabic grammar, morphology, and modern standard Arabic.  Expert in curriculum development and interactive teaching methodologies. 
                      </p>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className='hover:shadow-amber-100/20 hover:shadow-md flex items-start gap-3 bg-accent/10 rounded-xl p-4 border border-accent/20 transition-all duration-300'>
                    <Award className='text-accent flex-shrink-0 mt-1' size={24} />
                    <div>
                      <h4 className='font-semibold text-foreground mb-1'>Experience</h4>
                      <p className='text-foreground/70 leading-relaxed'>
                        Over 10 years of experience teaching Arabic to students of all levels, with a passion for making complex concepts accessible and engaging.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor 2 - Ustadh Uzair */}
          <div className='instructor-card group'>
            <div className='bg-card backdrop-blur-sm rounded-3xl border-2 border-foreground/10 hover:border-secondary/40 transition-all duration-500 overflow-hidden hover:shadow-xl'>
              <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 p-8 lg:p-12'>
                
                {/* Content Section - Flipped order for variety */}
                <div className='lg:col-span-3 flex flex-col justify-center space-y-6 order-2 lg:order-1'>
                  <div>
                    <h2 className='text-4xl font-bold text-foreground mb-2 group-hover: text-secondary transition-colors'>
                      Ustadh Uzair
                    </h2>
                    <h3 className='text-xl font-semibold text-secondary mb-4'>
                      Co-Founder of Markaz Umaza
                    </h3>
                  </div>

                  {/* Credentials */}
                  <div className='hover:shadow-amber-100/20 hover:shadow-md flex items-start gap-3 bg-secondary/10 rounded-xl p-4 border border-secondary/20 transition-all duration-300'>
                    <GraduationCap className='text-secondary flex-shrink-0 mt-1' size={24} />
                    <div>
                      <h4 className='font-semibold text-foreground mb-1'>Education</h4>
                      <p className='text-foreground/70 leading-relaxed'>
                        Bachelors of Education in Quran Sciences from King Saud University
                      </p>
                    </div>
                  </div>

                  {/* Expertise */}
                  <div className='hover:shadow-amber-100/20 hover:shadow-md flex items-start gap-3 bg-accent/10 rounded-xl p-4 border border-accent/20 transition-all duration-300'>
                    <BookOpen className='text-accent flex-shrink-0 mt-1' size={24} />
                    <div>
                      <h4 className='font-semibold text-foreground mb-1'>Expertise</h4>
                      <p className='text-foreground/70 leading-relaxed'>
                        Focuses on classical Arabic literature, poetry analysis, and conversational Arabic.  Known for his engaging teaching style and cultural insights.
                      </p>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className='hover:shadow-amber-100/20 hover:shadow-md flex items-start gap-3 bg-primary/10 rounded-xl p-4 border border-primary/20 transition-all duration-300'>
                    <Award className='text-primary flex-shrink-0 mt-1' size={24} />
                    <div>
                      <h4 className='font-semibold text-foreground mb-1'>Experience</h4>
                      <p className='text-foreground/70 leading-relaxed'>
                        A decade of teaching experience with a specialty in helping students connect with Arabic culture through language immersion and authentic materials.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Section */}
                <div className='lg:col-span-2 flex flex-col items-center justify-center order-1 lg:order-2'>
                  <div 
                    className='relative cursor-pointer'
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Image container with 3D rotation */}
                    <div 
                      className='relative w-64 h-64 rounded-full bg-secondary/20 p-2 transition-transform duration-200 ease-out'
                      style={{ transform: calculateRotation() }}
                    >
                      <div className='w-full h-full rounded-full bg-card p-8 flex items-center justify-center'>
                        <div className='w-48 h-48 rounded-full bg-secondary/10 flex items-center justify-center overflow-hidden relative'>
                          <Image
                            src="/assets/instructor_uzair.svg"
                            alt="Instructor Image"
                            width={120}
                            height={120}
                            className="rounded-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='py-20 bg-card'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-6'>
            Ready to Learn with Our <span className='text-primary'>Expert Instructors? </span>
          </h2>
          <p className='text-xl text-foreground/70 mb-8 max-w-2xl mx-auto'>
            Join our courses and experience personalized guidance from qualified teachers dedicated to your success
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <a
              href="/courses"
              className='group px-8 py-4 rounded-full font-normal text-lg hover:scale-105 transition-all flex items-center justify-center gap-2 uppercase text-white bg-gradient-to-r from-[#f2b10d] to-[#ffdd00] shadow-xl'
            >
              View All Courses
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/contact"
              className='px-8 py-4 bg-background border-2 border-foreground/30 text-foreground rounded-full font-normal text-lg hover:border-[#f2b10d] hover:shadow-[0px_7px_10px_#C18D08] hover:text-white transition-all hover:scale-105 flex items-center justify-center gap-2 uppercase'
            >
              Contact Us
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorsPage;