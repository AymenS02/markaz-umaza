'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Info,
  Star,
  ArrowRight,
  BookOpen,
  Users,
  Trophy,
  Clock,
  Zap,
  Award,
  Target
} from 'lucide-react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sidebar state for mobile frosty overlay + scroll lock
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const heroSlides = [
    {
      title: 'LEARN ARABIC',
      subtitle: 'MASTER THE LANGUAGE OF THE QURAN',
      description: 'Join thousands of students worldwide in their journey to Arabic fluency',
      cta: 'START LEARNING',
      ctaLink: '/courses',
      image: '/assets/hero-1.webp'
    },
    {
      title: 'EXPERT INSTRUCTORS',
      subtitle: 'LEARN FROM QUALIFIED SCHOLARS',
      description: 'Our instructors have years of experience teaching Arabic at all levels',
      cta: 'MEET OUR TEAM',
      ctaLink: '/instructors',
      image: '/assets/hero-2.webp'
    },
    {
      title: 'FLEXIBLE LEARNING',
      subtitle: 'STUDY AT YOUR OWN PACE',
      description: 'Access courses anytime, anywhere with our comprehensive online platform',
      cta: 'VIEW COURSES',
      ctaLink: '/courses',
      image: '/assets/hero-3.webp'
    }
  ];

  useEffect(() => {
    fetchRecentCourses();
  }, []);

  const fetchRecentCourses = async () => {
    try {
      const response = await fetch('/api/courses?limit=4&sort=recent');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="bg-background min-h-screen font-montserrat mt-[-44px]">
      {/* Optional mobile sidebar back-drop to dismiss on outside click */}
      {sidebarOpen && (
        <button
          aria-label="Dismiss sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
        />
      )}
      {/* Example frosty sidebar container (hook up to your actual sidebar) */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 z-[70] transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } bg-background/40 backdrop-blur-xl border-l border-foreground/10`}
      >
        {/* Your sidebar content */}
      </aside>

      {/* Hero Section - Full Screen with Images */}
      <section className="relative h-screen w-full overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image with Parallax Effect */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover scale-105"
                style={{
                  transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)',
                  transition: 'transform 10s ease-out'
                }}
              />
              {/* Dark Overlay with softer gradient (less strong) */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Horizontal: black -> black with hex alpha 40 -> transparent */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to right, #000000, #000000CC, rgba(0,0,0,0))'
                      }}
                />
                {/* Vertical: black with alpha 40 -> transparent */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, #000000CC, rgba(0,0,0,0), rgba(0,0,0,0))'
                  }}
                />
              </div>
            </div>

            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-4 sm:px-6 h-full flex items-center">
              <div className="max-w-3xl w-full">
                {/* Main Title: 3.75rem, uppercase, boldness toned down */}
                <h1
                  className={`text-[3.75rem] sm:text-[3.75rem] md:text-[3.75rem] lg:text-[3.75rem] leading-none font-extrabold text-foreground uppercase mb-4 sm:mb-6 transition-all duration-700 delay-500 ${
                    index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ lineHeight: 1 }}
                >
                  {slide.title}
                </h1>

                {/* Accent Line */}
                <div
                  className={`w-20 sm:w-32 h-1.5 sm:h-2 bg-gradient-to-r from-[#f2b10d] to-[#ffdd00] mb-4 sm:mb-6 transition-all duration-700 delay-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0 w-0'
                  }`}
                />

                {/* Subtitle (kept bold, uppercase) */}
                <h2
                  className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary font-bold uppercase mb-4 sm:mb-6 transition-all duration-700 delay-[900ms] ${
                    index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {slide.subtitle}
                </h2>

                {/* Description */}
                <p
                  className={`text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/90 leading-relaxed mb-6 sm:mb-10 max-w-2xl transition-all duration-700 delay-[1100ms] ${
                    index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {slide.description}
                </p>

                {/* CTA Buttons */}
                <div
                  className={`flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 transition-all duration-700 delay-[1300ms] ${
                    index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <a
                    href={slide.ctaLink}
                    className="group px-6 sm:px-10 py-3 sm:py-5 rounded-full font-normal text-base sm:text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 uppercase text-white bg-gradient-to-r from-[#ce950d] to-[#dbbf00]"
                  >
                    <Play size={20} className="group-hover:translate-x-1 transition-transform" />
                    {slide.cta}
                  </a>
                  <a
                    href="/about"
                    className="relative rounded-full font-normal text-base sm:text-lg transition-all flex items-center justify-center gap-3 p-[2px] group uppercase"
                  >
                    <span className="flex items-center justify-center gap-3 w-full h-full bg-background/90 backdrop-blur-md rounded-full px-6 sm:px-10 py-3 sm:py-5 border-2 border-foreground/30 hover:border-[#f2b10d] hover:shadow-[0px_7px_10px_#C18D08] text-white hover:text-white transition-all">
                      <Info size={20} className="text-foreground group-hover:text-white" />
                      LEARN MORE
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Controls - Hidden on mobile */}
        <div className="hidden sm:flex absolute bottom-6 sm:bottom-10 right-4 sm:right-10 z-30 items-center gap-3 sm:gap-4">
          <button
            onClick={prevSlide}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-background/80 backdrop-blur-xl border border-foreground/20 rounded-full flex items-center justify-center border-2 border-foreground/30 hover:border-[#f2b10d] hover:shadow-[0px_3px_10px_#C18D08] text-white hover:text-white transition-all group "
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-500 ${
                  index === currentSlide
                    ? 'w-12 sm:w-16 h-2 bg-gradient-to-r from-[#f2b10d] to-[#ffdd00] rounded-full'
                    : 'w-2 h-2 bg-foreground/30 rounded-full hover:bg-foreground/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-background/80 backdrop-blur-xl border border-foreground/20 rounded-full flex items-center justify-center border-2 border-foreground/30 hover:border-[#f2b10d] hover:shadow-[0px_3px_10px_#C18D08] text-white hover:text-white transition-all group "
          >
            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="sm:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-500 ${
                index === currentSlide
                  ? 'w-8 h-2 bg-gradient-to-r from-[#f2b10d] to-[#ffdd00] rounded-full'
                  : 'w-2 h-2 bg-foreground/30 rounded-full'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        <div className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-foreground/60 font-semibold tracking-wider uppercase">SCROLL</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-[#f2b10d] to-[#ffdd00]" />
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full mb-3 sm:mb-4">
                <span className="text-primary font-bold text-xs sm:text-sm tracking-wider uppercase">POPULAR COURSES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground uppercase">EXPLORE OUR COURSES</h2>
            </div>
            <a
              href="/courses"
              className="hidden md:flex items-center gap-2 text-primary hover:gap-4 transition-all font-bold uppercase"
            >
              VIEW ALL <ArrowRight size={20} />
            </a>
          </div>

          {loading ? (
            <div className="text-center text-foreground/60 py-12 sm:py-20">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center text-foreground/60 py-12 sm:py-20">No courses found.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {courses.map((course, idx) => (
                  <a
                    key={course._id}
                    href={`/courses/${course._id}/enroll`}
                    className="group relative bg-card border-2 border-foreground/10 rounded-2xl overflow-hidden hover:border-[#f2b10d] hover:shadow-[0px_7px_10px_#C18D08] transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Course Image/Thumbnail */}
                    <div className="relative w-full bg-primary/20 overflow-hidden">
                      {/* Overlay */}
                      <div className="absolute inset-0" />
                      <img
                        src={course.thumbnailUrl || '/assets/course-placeholder.png'}
                        alt={course.title}
                        className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Badge */}
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                        <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-[#f2b10d] to-[#ffdd00] text-white text-xs font-extrabold uppercase tracking-wide rounded-full shadow-lg">
                          {course.difficultyLevel || 'BEGINNER'}
                        </span>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-background/90 backdrop-blur-sm rounded-full">
                        <Star size={12} fill="currentColor" className="text-accent" />
                        <span className="font-bold text-foreground text-xs sm:text-sm">{course.rating || 5.0}</span>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem] uppercase">
                        {course.title}
                      </h3>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs sm:text-sm text-foreground/60">
                        <div className="flex items-center gap-1.5">
                          <Users size={14} />
                          <span className="font-semibold">{course.enrolledStudents || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span className="font-semibold">{course.durationWeeks || 0} weeks</span>
                        </div>
                      </div>

                      {/* Price & Arrow */}
                      <div className="pt-3 sm:pt-4 border-t border-foreground/10 flex items-center justify-between">
                        <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                          ${course.price || 0}
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center border-2 border-foreground/30 hover:border-[#f2b10d] hover:shadow-[0px_3px_10px_#C18D08] text-white hover:text-white transition-all">
                          <ArrowRight
                            size={18}
                            className="text-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="text-center mt-8 sm:mt-12">
                <a
                  href="/courses"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-normal text-base sm:text-lg hover:shadow-xl transition-all uppercase text-white bg-gradient-to-r from-[#f2b10d] to-[#ffdd00]"
                >
                  VIEW ALL COURSES
                  <ArrowRight size={20} />
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Grid ("Why Students Choose Us") */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-card">
        <img src="/assets/cali-1.svg" alt="Cali" className="absolute top-0 left-0 z-0 w-full h-full object-cover pointer-events-none opacity-25" />
        <div className="relative container mx-auto max-w-7xl z-20">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary/10 rounded-full mb-3 sm:mb-4">
              <span className="text-secondary font-bold text-xs sm:text-sm tracking-wider uppercase">Our Approach</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3 sm:mb-4">Why Students Choose Us</h2>
            <p className="text-base sm:text-lg lg:text-xl text-foreground/60 max-w-2xl mx-auto px-4">
              Experience a comprehensive learning platform designed for your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="group bg-background  border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-[#f2b10d] hover:shadow-[0px_7px_10px_#C18D08] transition-all text-center">
              <div className="w-16 h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <BookOpen className="text-primary" size={36} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">Expert Teachers</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Learn from qualified scholars with decades of combined teaching experience in Arabic language education.
              </p>
            </div>

            <div className="group bg-background  border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-secondary/60 hover:shadow-[0px_7px_10px_#b3ccc2] transition-all text-center">
              <div className="w-16 h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <Zap className="text-secondary" size={36} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">Fast Progress</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Our proven methodology helps students achieve fluency faster with structured lessons and practice.
              </p>
            </div>

            <div className="group bg-background border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-accent/60 hover:shadow-[0px_7px_10px_#dce2cf] transition-all text-center">
              <div className="w-16 h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <Clock className="text-accent" size={36} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">Flexible Schedule</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Study whenever and wherever suits you with 24/7 access to all course materials and resources.
              </p>
            </div>

            <div className="group bg-background border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-[#f2b10d] hover:shadow-[0px_7px_10px_#C18D08] transition-all text-center">
              <div className="w-16 h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <Users className="text-primary" size={36} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">Active Community</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Join a vibrant community of learners who support and motivate each other throughout the journey.
              </p>
            </div>

            <div className="group bg-background border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-secondary/60 hover:shadow-[0px_7px_10px_#b3ccc2] transition-all text-center">
              <div className="w-16 h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <Trophy className="text-secondary" size={36} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">Proven Results</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                98% of our students successfully achieve their learning goals and gain Arabic proficiency.
              </p>
            </div>

            <div className="group bg-background border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-accent/60 hover:shadow-[0px_7px_10px_#dce2cf] transition-all text-center">
              <div className="w-16 h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <Award className="text-accent" size={36} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">Certification</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Earn recognized certificates upon course completion to showcase your Arabic language skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-dark">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 rounded-full mb-3 sm:mb-4">
              <span className="text-accent font-bold text-xs sm:text-sm tracking-wider uppercase">SUCCESS STORIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3 sm:mb-4 uppercase">
              WHAT STUDENTS SAY
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-foreground/60 max-w-2xl mx-auto px-4">
              Hear from learners who transformed their Arabic skills with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Testimonial Cards */}
            <div className="bg-foreground/5 border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-[#f2b10d] hover:shadow-[0px_7px_10px_#C18D08] transition-all">
              <div className="flex items-center gap-1 text-accent mb-4 sm:mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-foreground/90 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed italic">
                &quot;The structured approach made learning Arabic enjoyable and effective. I&apos;ve made incredible progress!&quot;
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-[#f2b10d] to-[#ffdd00] rounded-full flex items-center justify-center font-extrabold text-white text-lg sm:text-xl shadow-lg">
                  AH
                </div>
                <div>
                  <div className="font-extrabold text-foreground text-sm sm:text-base ">Ahmed Hassan</div>
                  <div className="text-xs sm:text-sm text-foreground/60 font-semibold">Software Engineer</div>
                </div>
              </div>
            </div>

            <div className="bg-card border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-secondary/60 hover:shadow-[0px_7px_10px_#b3ccc2] transition-all">
              <div className="flex items-center gap-1 text-accent mb-4 sm:mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-foreground/90 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed italic">
                &quot;Perfect for my busy schedule. The instructors are patient, knowledgeable, and truly dedicated.&quot;
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary rounded-full flex items-center justify-center font-extrabold text-background text-lg sm:text-xl shadow-lg">
                  FZ
                </div>
                <div>
                  <div className="font-extrabold text-foreground text-sm sm:text-base ">Fatima Zahra</div>
                  <div className="text-xs sm:text-sm text-foreground/60 font-semibold">Home Educator</div>
                </div>
              </div>
            </div>

            <div className="bg-card border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-accent/60 hover:shadow-[0px_7px_10px_#dce2cf] transition-all">
              <div className="flex items-center gap-1 text-accent mb-4 sm:mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-foreground/90 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed italic">
                &quot;Deepened my understanding tremendously. Complex concepts explained with remarkable clarity.&quot;
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent rounded-full flex items-center justify-center font-extrabold text-background text-lg sm:text-xl shadow-lg">
                  YA
                </div>
                <div>
                  <div className="font-extrabold text-foreground text-sm sm:text-base ">Yusuf Ali</div>
                  <div className="text-xs sm:text-sm text-foreground/60 font-semibold">Medical Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-[url('/assets/success.png')] bg-no-repeat bg-center bg-cover">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full mb-4 sm:mb-6">
              <span className="text-primary font-bold text-xs sm:text-sm tracking-wider uppercase">JOIN TODAY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 sm:mb-6 px-4 uppercase">
              READY TO START YOUR
              <br className="hidden sm:inline" /> ARABIC JOURNEY?
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-foreground/60 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              Transform your future by mastering Arabic. Join thousands of successful students worldwide.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
              <a
                href="/sign-up"
                className="group px-8 sm:px-12 py-4 sm:py-6 rounded-full font-normal text-base sm:text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 uppercase text-white bg-gradient-to-r from-[#f2b10d] to-[#ffdd00]"
              >
                <Play size={20} className="group-hover:translate-x-1 transition-transform" />
                START LEARNING NOW
              </a>
              <a
                href="/courses"
                className="px-8 sm:px-12 py-4 sm:py-6 bg-background border-2 border-foreground/20 text-foreground rounded-full font-normal text-base sm:text-lg border-2 border-foreground/30 hover:border-[#f2b10d] hover:shadow-[0px_7px_10px_#C18D08] text-white hover:text-white transition-all flex items-center justify-center gap-3 uppercase"
              >
                EXPLORE COURSES
                <ArrowRight size={20} />
              </a>
            </div>

            {/* Trust Bar */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pt-8 sm:pt-12 border-t-2 border-foreground/10">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary mb-1 sm:mb-2">150+</div>
                <div className="text-xs sm:text-sm text-foreground/60 font-bold uppercase">STUDENTS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-secondary mb-1 sm:mb-2">5+</div>
                <div className="text-xs sm:text-sm text-foreground/60 font-bold uppercase">COURSES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-accent mb-1 sm:mb-2">2+</div>
                <div className="text-xs sm:text-sm text-foreground/60 font-bold uppercase">INSTRUCTORS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary mb-1 sm:mb-2">98%</div>
                <div className="text-xs sm:text-sm text-foreground/60 font-bold uppercase">SATISFACTION</div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Example button hover utility for yellow outline -> neon shadow */}
      <style jsx>{`
        .hover-yellow-outline:hover {
          outline: 2px solid #f2b10d;
          box-shadow: 0 0 18px #ffff33;
        }
      `}</style>
    </div>
  );
}