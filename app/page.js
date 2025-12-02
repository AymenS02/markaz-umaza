'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Info, Star, ArrowRight, BookOpen, Users, Trophy, Clock, Zap, Award, Target } from 'lucide-react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const heroSlides = [
    {
      title: "Learn Arabic",
      subtitle: "Master the language of the Quran",
      description: "Join thousands of students worldwide in their journey to Arabic fluency",
      cta: "Start Learning",
      ctaLink: "/courses",
      image: "/assets/hero-1.jpg"
    },
    {
      title: "Expert Instructors",
      subtitle: "Learn from qualified scholars",
      description: "Our instructors have years of experience teaching Arabic at all levels",
      cta: "Meet Our Team",
      ctaLink: "/instructors",
      image: "/assets/hero-2.jpg"
    },
    {
      title: "Flexible Learning",
      subtitle: "Study at your own pace",
      description: "Access courses anytime, anywhere with our comprehensive online platform",
      cta: "View Courses",
      ctaLink: "/courses",
      image: "/assets/hero-3.jpg"
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
    <div className="bg-background min-h-screen">
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
              {/* Dark Overlay with Gradient - Only in Dark Mode */}
              <div className="absolute inset-0 hero-gradient-horizontal"></div>
              <div className="absolute inset-0 hero-gradient-vertical"></div>
            </div>
            
            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-4 sm:px-6 h-full flex items-center">
              <div className="max-w-3xl w-full">
                {/* Badge */}
                <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full mb-4 sm:mb-8 transition-all duration-700 delay-300 ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-primary font-bold text-xs sm:text-sm tracking-wider uppercase">Premium Education</span>
                </div>

                {/* Main Title */}
                <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-foreground mb-4 sm:mb-6 leading-none transition-all duration-700 delay-500 ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  {slide.title}
                </h1>

                {/* Accent Line */}
                <div className={`w-20 sm:w-32 h-1.5 sm:h-2 bg-primary mb-4 sm:mb-6 transition-all duration-700 delay-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0 w-0'
                }`}></div>
                
                {/* Subtitle */}
                <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary font-bold mb-4 sm:mb-6 transition-all duration-700 delay-[900ms] ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {slide.subtitle}
                </h2>
                
                {/* Description */}
                <p className={`text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/90 leading-relaxed mb-6 sm:mb-10 max-w-2xl transition-all duration-700 delay-[1100ms] ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {slide.description}
                </p>
                
                {/* CTA Buttons */}
                <div className={`flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 transition-all duration-700 delay-[1300ms] ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <a
                    href={slide.ctaLink}
                    className="group px-6 sm:px-10 py-3 sm:py-5 bg-primary text-background rounded-xl font-bold text-base sm:text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                  >
                    <Play size={20} className="group-hover:translate-x-1 transition-transform" />
                    {slide.cta}
                  </a>
                  <a
                    href="/about"
                    className="px-6 sm:px-10 py-3 sm:py-5 bg-background/90 backdrop-blur-md border-2 border-foreground/20 text-foreground rounded-xl font-bold text-base sm:text-lg hover:border-primary hover:bg-background transition-all flex items-center justify-center gap-3"
                  >
                    <Info size={20} />
                    Learn More
                  </a>
                </div>

                {/* Stats Bar */}
                <div className={`mt-8 sm:mt-12 flex flex-wrap gap-4 sm:gap-6 lg:gap-8 transition-all duration-700 delay-[1500ms] ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                      <Users className="text-primary" size={20} />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-foreground">150+</div>
                      <div className="text-xs sm:text-sm text-foreground/60">Students</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                      <BookOpen className="text-secondary" size={20} />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-foreground">5+</div>
                      <div className="text-xs sm:text-sm text-foreground/60">Courses</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                      <Star className="text-accent" size={20} fill="currentColor" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-foreground">98%</div>
                      <div className="text-xs sm:text-sm text-foreground/60">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Controls - Hidden on mobile */}
        <div className="hidden sm:flex absolute bottom-6 sm:bottom-10 right-4 sm:right-10 z-30 items-center gap-3 sm:gap-4">
          <button
            onClick={prevSlide}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-background/80 backdrop-blur-xl border border-foreground/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-background hover:border-primary transition-all group"
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
                    ? 'w-12 sm:w-16 h-2 bg-primary rounded-full' 
                    : 'w-2 h-2 bg-foreground/30 rounded-full hover:bg-foreground/50'
                }`}
              ></button>
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-background/80 backdrop-blur-xl border border-foreground/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-background hover:border-primary transition-all group"
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
                  ? 'w-8 h-2 bg-primary rounded-full' 
                  : 'w-2 h-2 bg-foreground/30 rounded-full'
              }`}
            ></button>
          ))}
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        <div className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-foreground/60 font-semibold tracking-wider uppercase">Scroll</span>
          <div className="w-0.5 h-8 bg-primary"></div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full mb-3 sm:mb-4">
                <span className="text-primary font-bold text-xs sm:text-sm tracking-wider uppercase">Popular Courses</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground">Explore Our Courses</h2>
            </div>
            <a href="/courses" className="hidden md:flex items-center gap-2 text-primary hover:gap-4 transition-all font-bold">
              View All <ArrowRight size={20} />
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
                    className="group relative bg-card border-2 border-foreground/10 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Course Image/Thumbnail */}
                    <div className="relative aspect-[4/3] bg-primary/20 overflow-hidden">
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-background/80"></div>
                      
                      {/* Badge */}
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                        <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-primary text-background text-xs font-black uppercase tracking-wide rounded-lg shadow-lg">
                          {course.difficultyLevel || 'Beginner'}
                        </span>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-background/90 backdrop-blur-sm rounded-lg">
                        <Star size={12} fill="currentColor" className="text-accent" />
                        <span className="font-bold text-foreground text-xs sm:text-sm">{course.rating || 5.0}</span>
                      </div>
                    </div>
                    
                    {/* Course Info */}
                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem]">
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
                        <div className="text-2xl sm:text-3xl font-black text-primary">
                          ${course.price || 0}
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-all">
                          <ArrowRight size={18} className="text-primary group-hover:text-background group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              
              <div className="text-center mt-8 sm:mt-12">
                <a
                  href="/courses"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-background rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  View All Courses
                  <ArrowRight size={20} />
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-card">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary/10 rounded-full mb-3 sm:mb-4">
              <span className="text-secondary font-bold text-xs sm:text-sm tracking-wider uppercase">Our Approach</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-3 sm:mb-4">Why Students Choose Us</h2>
            <p className="text-base sm:text-lg lg:text-xl text-foreground/60 max-w-2xl mx-auto px-4">
              Experience a comprehensive learning platform designed for your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Feature Cards */}
            <div className="group bg-background border-2 border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-primary/50 hover:shadow-xl transition-all">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="text-background" size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 sm:mb-3">Expert Teachers</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Learn from qualified scholars with decades of combined teaching experience in Arabic language education.
              </p>
            </div>

            <div className="group bg-background border-2 border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-secondary/50 hover:shadow-xl transition-all">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-background" size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 sm:mb-3">Fast Progress</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Our proven methodology helps students achieve fluency faster with structured lessons and practice.
              </p>
            </div>

            <div className="group bg-background border-2 border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-accent/50 hover:shadow-xl transition-all">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Clock className="text-background" size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 sm:mb-3">Flexible Schedule</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Study whenever and wherever suits you with 24/7 access to all course materials and resources.
              </p>
            </div>

            <div className="group bg-background border-2 border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-primary/50 hover:shadow-xl transition-all">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-background" size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 sm:mb-3">Active Community</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Join a vibrant community of learners who support and motivate each other throughout the journey.
              </p>
            </div>

            <div className="group bg-background border-2 border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-secondary/50 hover:shadow-xl transition-all">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="text-background" size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 sm:mb-3">Proven Results</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                98% of our students successfully achieve their learning goals and gain Arabic proficiency.
              </p>
            </div>

            <div className="group bg-background border-2 border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-accent/50 hover:shadow-xl transition-all">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Award className="text-background" size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 sm:mb-3">Certification</h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Earn recognized certificates upon course completion to showcase your Arabic language skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 rounded-full mb-3 sm:mb-4">
              <span className="text-accent font-bold text-xs sm:text-sm tracking-wider uppercase">Success Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-3 sm:mb-4">What Students Say</h2>
            <p className="text-base sm:text-lg lg:text-xl text-foreground/60 max-w-2xl mx-auto px-4">
              Hear from learners who transformed their Arabic skills with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Testimonial Cards */}
            <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-primary/30 hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 text-accent mb-4 sm:mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-foreground/90 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed italic">
                &quot;The structured approach made learning Arabic enjoyable and effective. I&apos;ve made incredible progress!&quot;
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-full flex items-center justify-center font-black text-background text-lg sm:text-xl shadow-lg">
                  AH
                </div>
                <div>
                  <div className="font-black text-foreground text-sm sm:text-base">Ahmed Hassan</div>
                  <div className="text-xs sm:text-sm text-foreground/60 font-semibold">Software Engineer</div>
                </div>
              </div>
            </div>

            <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-secondary/30 hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 text-accent mb-4 sm:mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-foreground/90 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed italic">
                &quot;Perfect for my busy schedule. The instructors are patient, knowledgeable, and truly dedicated.&quot;
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary rounded-full flex items-center justify-center font-black text-background text-lg sm:text-xl shadow-lg">
                  FZ
                </div>
                <div>
                  <div className="font-black text-foreground text-sm sm:text-base">Fatima Zahra</div>
                  <div className="text-xs sm:text-sm text-foreground/60 font-semibold">Home Educator</div>
                </div>
              </div>
            </div>

            <div className="bg-card border-2 border-foreground/10 rounded-2xl p-6 sm:p-8 hover:border-accent/30 hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 text-accent mb-4 sm:mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-foreground/90 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed italic">
                &quot;Deepened my understanding tremendously. Complex concepts explained with remarkable clarity.&quot;
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent rounded-full flex items-center justify-center font-black text-background text-lg sm:text-xl shadow-lg">
                  YA
                </div>
                <div>
                  <div className="font-black text-foreground text-sm sm:text-base">Yusuf Ali</div>
                  <div className="text-xs sm:text-sm text-foreground/60 font-semibold">Medical Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-card">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full mb-4 sm:mb-6">
              <span className="text-primary font-bold text-xs sm:text-sm tracking-wider uppercase">Join Today</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 sm:mb-6 px-4">
              Ready to Start Your<br className="hidden sm:inline" /> Arabic Journey?
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-foreground/60 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              Transform your future by mastering Arabic. Join thousands of successful students worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
              <a
                href="/register"
                className="group px-8 sm:px-12 py-4 sm:py-6 bg-primary text-background rounded-xl font-black text-base sm:text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
              >
                <Play size={20} className="group-hover:translate-x-1 transition-transform" />
                Start Learning Now
              </a>
              <a
                href="/courses"
                className="px-8 sm:px-12 py-4 sm:py-6 bg-background border-2 border-foreground/20 text-foreground rounded-xl font-black text-base sm:text-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3"
              >
                Explore Courses
                <ArrowRight size={20} />
              </a>
            </div>

            {/* Trust Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pt-8 sm:pt-12 border-t-2 border-foreground/10">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-primary mb-1 sm:mb-2">150+</div>
                <div className="text-xs sm:text-sm text-foreground/60 font-bold">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-secondary mb-1 sm:mb-2">5+</div>
                <div className="text-xs sm:text-sm text-foreground/60 font-bold">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-accent mb-1 sm:mb-2">2+</div>
                <div className="text-xs sm:text-sm text-foreground/60 font-bold">Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-primary mb-1 sm:mb-2">98%</div>
                <div className="text-xs sm:text-sm text-foreground/60 font-bold">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}