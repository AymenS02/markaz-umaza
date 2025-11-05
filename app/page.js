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
              {/* Dark Overlay with Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/30"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
            </div>
            
            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-6 h-full flex items-center">
              <div className="max-w-3xl">
                {/* Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full mb-8 transition-all duration-700 delay-300 ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-primary font-bold text-sm tracking-wider uppercase">Premium Education</span>
                </div>

                {/* Main Title */}
                <h1 className={`text-6xl md:text-8xl font-black text-foreground mb-6 leading-none transition-all duration-700 delay-500 ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  {slide.title}
                </h1>

                {/* Accent Line */}
                <div className={`w-32 h-2 bg-gradient-to-r from-primary via-secondary to-accent mb-6 transition-all duration-700 delay-700 ${
                  index === currentSlide ? 'opacity-100 w-32' : 'opacity-0 w-0'
                }`}></div>
                
                {/* Subtitle */}
                <h2 className={`text-3xl md:text-4xl text-primary font-bold mb-6 transition-all duration-700 delay-[900ms] ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {slide.subtitle}
                </h2>
                
                {/* Description */}
                <p className={`text-xl md:text-2xl text-foreground/90 leading-relaxed mb-10 max-w-2xl transition-all duration-700 delay-[1100ms] ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {slide.description}
                </p>
                
                {/* CTA Buttons */}
                <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-[1300ms] ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <a
                    href={slide.ctaLink}
                    className="group px-10 py-5 bg-primary text-background rounded-xl font-bold text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all flex items-center gap-3"
                  >
                    <Play size={22} className="group-hover:translate-x-1 transition-transform" />
                    {slide.cta}
                  </a>
                  <a
                    href="/about"
                    className="px-10 py-5 bg-background/90 backdrop-blur-md border-2 border-foreground/20 text-foreground rounded-xl font-bold text-lg hover:border-primary hover:bg-background transition-all flex items-center gap-3"
                  >
                    <Info size={22} />
                    Learn More
                  </a>
                </div>

                {/* Stats Bar */}
                <div className={`mt-12 flex flex-wrap gap-8 transition-all duration-700 delay-[1500ms] ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                      <Users className="text-primary" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">150+</div>
                      <div className="text-sm text-foreground/60">Students</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                      <BookOpen className="text-secondary" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">5+</div>
                      <div className="text-sm text-foreground/60">Courses</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                      <Star className="text-accent" size={24} fill="currentColor" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">98%</div>
                      <div className="text-sm text-foreground/60">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Controls */}
        <div className="absolute bottom-10 right-10 z-30 flex items-center gap-4">
          <button
            onClick={prevSlide}
            className="w-16 h-16 bg-background/80 backdrop-blur-xl border border-foreground/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-background hover:border-primary transition-all group"
          >
            <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-500 ${
                  index === currentSlide 
                    ? 'w-16 h-2 bg-primary rounded-full' 
                    : 'w-2 h-2 bg-foreground/30 rounded-full hover:bg-foreground/50'
                }`}
              ></button>
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="w-16 h-16 bg-background/80 backdrop-blur-xl border border-foreground/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-background hover:border-primary transition-all group"
          >
            <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-foreground/60 font-semibold tracking-wider uppercase">Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
                <span className="text-primary font-bold text-sm tracking-wider uppercase">Popular Courses</span>
              </div>
              <h2 className="text-5xl font-black text-foreground">Explore Our Courses</h2>
            </div>
            <a href="/courses" className="hidden md:flex items-center gap-2 text-primary hover:gap-4 transition-all font-bold">
              View All <ArrowRight size={20} />
            </a>
          </div>

          {loading ? (
            <div className="text-center text-foreground/60 py-20">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center text-foreground/60 py-20">No courses found.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course, idx) => (
                  <a
                    key={course._id}
                    href={`/courses/${course._id}/enroll`}
                    className="group relative bg-card border-2 border-foreground/10 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Course Image/Thumbnail */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 overflow-hidden">
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                      
                      {/* Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-primary text-background text-xs font-black uppercase tracking-wide rounded-lg shadow-lg">
                          {course.difficultyLevel || 'Beginner'}
                        </span>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-lg">
                        <Star size={14} fill="currentColor" className="text-accent" />
                        <span className="font-bold text-foreground text-sm">{course.rating || 5.0}</span>
                      </div>
                    </div>
                    
                    {/* Course Info */}
                    <div className="p-6 space-y-4">
                      <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                        {course.title}
                      </h3>
                      
                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-foreground/60">
                        <div className="flex items-center gap-1.5">
                          <Users size={16} />
                          <span className="font-semibold">{course.enrolledStudents || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} />
                          <span className="font-semibold">{course.durationWeeks || 0} weeks</span>
                        </div>
                      </div>
                      
                      {/* Price & Arrow */}
                      <div className="pt-4 border-t border-foreground/10 flex items-center justify-between">
                        <div className="text-3xl font-black text-primary">
                          ${course.price || 0}
                        </div>
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-all">
                          <ArrowRight size={20} className="text-primary group-hover:text-background group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              
              <div className="text-center mt-12 md:hidden">
                <a
                  href="/courses"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background rounded-xl font-bold hover:shadow-2xl transition-all"
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
      <section className="py-24 px-6 bg-gradient-to-b from-card/30 to-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-secondary/10 rounded-full mb-4">
              <span className="text-secondary font-bold text-sm tracking-wider uppercase">Our Approach</span>
            </div>
            <h2 className="text-5xl font-black text-foreground mb-4">Why Students Choose Us</h2>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              Experience a comprehensive learning platform designed for your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            <div className="group bg-card border-2 border-foreground/10 rounded-2xl p-8 hover:border-primary/50 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="text-background" size={32} />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-3">Expert Teachers</h3>
              <p className="text-foreground/70 leading-relaxed">
                Learn from qualified scholars with decades of combined teaching experience in Arabic language education.
              </p>
            </div>

            <div className="group bg-card border-2 border-foreground/10 rounded-2xl p-8 hover:border-secondary/50 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-background" size={32} />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-3">Fast Progress</h3>
              <p className="text-foreground/70 leading-relaxed">
                Our proven methodology helps students achieve fluency faster with structured lessons and practice.
              </p>
            </div>

            <div className="group bg-card border-2 border-foreground/10 rounded-2xl p-8 hover:border-accent/50 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="text-background" size={32} />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-3">Flexible Schedule</h3>
              <p className="text-foreground/70 leading-relaxed">
                Study whenever and wherever suits you with 24/7 access to all course materials and resources.
              </p>
            </div>

            <div className="group bg-card border-2 border-foreground/10 rounded-2xl p-8 hover:border-primary/50 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-background" size={32} />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-3">Active Community</h3>
              <p className="text-foreground/70 leading-relaxed">
                Join a vibrant community of learners who support and motivate each other throughout the journey.
              </p>
            </div>

            <div className="group bg-card border-2 border-foreground/10 rounded-2xl p-8 hover:border-secondary/50 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="text-background" size={32} />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-3">Proven Results</h3>
              <p className="text-foreground/70 leading-relaxed">
                98% of our students successfully achieve their learning goals and gain Arabic proficiency.
              </p>
            </div>

            <div className="group bg-card border-2 border-foreground/10 rounded-2xl p-8 hover:border-accent/50 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="text-background" size={32} />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-3">Certification</h3>
              <p className="text-foreground/70 leading-relaxed">
                Earn recognized certificates upon course completion to showcase your Arabic language skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-accent/10 rounded-full mb-4">
              <span className="text-accent font-bold text-sm tracking-wider uppercase">Success Stories</span>
            </div>
            <h2 className="text-5xl font-black text-foreground mb-4">What Students Say</h2>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              Hear from learners who transformed their Arabic skills with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial Cards */}
            <div className="bg-gradient-to-br from-card to-card/50 border-2 border-foreground/10 rounded-2xl p-8 hover:border-primary/30 hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 text-accent mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-foreground/90 text-lg mb-8 leading-relaxed italic">
                "The structured approach made learning Arabic enjoyable and effective. I've made incredible progress!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center font-black text-background text-xl shadow-lg">
                  AH
                </div>
                <div>
                  <div className="font-black text-foreground">Ahmed Hassan</div>
                  <div className="text-sm text-foreground/60 font-semibold">Software Engineer</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-card to-card/50 border-2 border-foreground/10 rounded-2xl p-8 hover:border-secondary/30 hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 text-accent mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-foreground/90 text-lg mb-8 leading-relaxed italic">
                "Perfect for my busy schedule. The instructors are patient, knowledgeable, and truly dedicated."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center font-black text-background text-xl shadow-lg">
                  FZ
                </div>
                <div>
                  <div className="font-black text-foreground">Fatima Zahra</div>
                  <div className="text-sm text-foreground/60 font-semibold">Home Educator</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-card to-card/50 border-2 border-foreground/10 rounded-2xl p-8 hover:border-accent/30 hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 text-accent mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-foreground/90 text-lg mb-8 leading-relaxed italic">
                &quot;Deepened my understanding tremendously. Complex concepts explained with remarkable clarity.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center font-black text-background text-xl shadow-lg">
                  YA
                </div>
                <div>
                  <div className="font-black text-foreground">Yusuf Ali</div>
                  <div className="text-sm text-foreground/60 font-semibold">Medical Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-card/30 to-background relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
              <span className="text-primary font-bold text-sm tracking-wider uppercase">Join Today</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-foreground mb-6">
              Ready to Start Your<br />Arabic Journey?
            </h2>
            
            <p className="text-xl text-foreground/60 mb-12 max-w-2xl mx-auto">
              Transform your future by mastering Arabic. Join thousands of successful students worldwide.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <a
                href="/register"
                className="group px-12 py-6 bg-primary text-background rounded-xl font-black text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all flex items-center gap-3"
              >
                <Play size={24} className="group-hover:translate-x-1 transition-transform" />
                Start Learning Now
              </a>
              <a
                href="/courses"
                className="px-12 py-6 bg-card border-2 border-foreground/20 text-foreground rounded-xl font-black text-lg hover:border-primary hover:text-primary transition-all flex items-center gap-3"
              >
                Explore Courses
                <ArrowRight size={24} />
              </a>
            </div>

            {/* Trust Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t-2 border-foreground/10">
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">150+</div>
                <div className="text-foreground/60 font-bold">Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-secondary mb-2">5+</div>
                <div className="text-foreground/60 font-bold">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-accent mb-2">2+</div>
                <div className="text-foreground/60 font-bold">Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">98%</div>
                <div className="text-foreground/60 font-bold">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}