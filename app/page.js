'use client';

import { useEffect, useRef } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Sparkles, BookOpen, Users, Award, Clock, CheckCircle, Star, MessageSquare, Play, ArrowRight, Globe, Heart, Brain } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const textRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const coursesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  
  const words = [
    { en: "Learn Arabic", ar: "تعلم العربية" },
    { en: "Master Language", ar: "أتقن اللغة" },
    { en: "Discover Culture", ar: "اكتشف الثقافة" }
  ];
  const currentIndex = useRef(0);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const animateText = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          currentIndex.current = (currentIndex.current + 1) % words.length;
          animateText();
        }
      });

      tl.to(element, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in"
      })
      .call(() => {
        element.textContent = words[currentIndex.current].en;
      })
      .to(element, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      })
      .to(element, {
        opacity: 1,
        duration: 1.5
      })
      .to(element, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in"
      })
      .call(() => {
        element.textContent = words[currentIndex.current].ar;
        element.style.direction = 'rtl';
      })
      .to(element, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      })
      .to(element, {
        opacity: 1,
        duration: 1.5
      })
      .call(() => {
        element.style.direction = 'ltr';
      });
    };

    animateText();

    return () => {
      gsap.killTweensOf(element);
    };
  }, []);

  useEffect(() => {
    // Features animation
    if (featuresRef.current) {
      const features = featuresRef.current.querySelectorAll('.feature-card');
      gsap.fromTo(features, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
          }
        }
      );
    }

    // Stats animation
    if (statsRef.current) {
      const statItems = statsRef.current.querySelectorAll('.stat-item');
      gsap.fromTo(statItems,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          }
        }
      );
    }

    // Courses animation
    if (coursesRef.current) {
      const courseCards = coursesRef.current.querySelectorAll('.course-card');
      gsap.fromTo(courseCards,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: coursesRef.current,
            start: "top 80%",
          }
        }
      );
    }

    // Testimonials animation
    if (testimonialsRef.current) {
      const testimonialCards = testimonialsRef.current.querySelectorAll('.testimonial-card');
      gsap.fromTo(testimonialCards,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 80%",
          }
        }
      );
    }

    // CTA animation
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  return (
    <div className="overflow-hidden pt-20">
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <Sparkles className="text-primary animate-pulse" size={24} />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                    Transform Your Knowledge
                  </span>
                </div>
                
                <h1 
                  ref={textRef}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary bg-size-[200%_auto] animate-gradient min-h-[120px] flex items-center justify-center lg:justify-start"
                >
                  Learn Arabic
                </h1>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary">
                  <span>with</span>
                  <span className="text-primary">Markaz Umaza</span>
                </div>
              </div>

              <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl leading-relaxed">
                Embark on a transformative journey to master Arabic, deepen your understanding of the Quran, 
                and connect with authentic Islamic knowledge.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  href="/courses"
                  className="group relative px-8 py-4 bg-primary text-background rounded-full font-semibold text-lg hover:bg-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  Get Started
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                
                <Link
                  href="/about"
                  className="px-8 py-4 border-2 border-secondary text-secondary rounded-full font-semibold text-lg hover:bg-secondary hover:text-background transition-all duration-300 hover:scale-105 flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-8 pt-8 border-t border-primary/20">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-foreground/60">Students</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-accent">20+</div>
                  <div className="text-sm text-foreground/60">Courses</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-secondary">10+</div>
                  <div className="text-sm text-foreground/60">Instructors</div>
                </div>
              </div>
            </div>

            <div className="shrink-0 relative">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-spin-slow"></div>
                <div className="absolute inset-4 rounded-full border-4 border-accent/20 animate-spin-reverse"></div>
                <div className="absolute inset-8 bg-linear-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl">
                  <div className="w-48 h-48 relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse">
                      <Image
                        src="/assets/markaz_umaza_logo_white.svg"
                        alt="Placeholder"
                        className="w-full h-full object-contain p-8"
                        width={320}
                        height={320}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-12 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-secondary/60 hover:text-primary transition-colors cursor-pointer">
          <span className="text-sm font-medium">Scroll to explore</span>
          <ArrowDown size={32} />
        </div>
      </div>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-linear-to-b from-background to-card/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Choose <span className="text-primary">Markaz Umaza</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Experience a comprehensive learning platform designed for your spiritual and linguistic growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Structured Curriculum</h3>
              <p className="text-foreground/70 leading-relaxed">
                Follow a carefully designed path from beginner to advanced, with clear milestones and achievements.
              </p>
            </div>

            <div className="feature-card bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-secondary/10 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10 group">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-secondary" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Expert Instructors</h3>
              <p className="text-foreground/70 leading-relaxed">
                Learn from qualified scholars with years of experience in teaching Arabic and Islamic studies.
              </p>
            </div>

            <div className="feature-card bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Flexible Schedule</h3>
              <p className="text-foreground/70 leading-relaxed">
                Study at your own pace with on-demand lessons and live sessions that fit your lifestyle.
              </p>
            </div>

            <div className="feature-card bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Interactive Learning</h3>
              <p className="text-foreground/70 leading-relaxed">
                Engage with multimedia content, quizzes, and interactive exercises for better retention.
              </p>
            </div>

            <div className="feature-card bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-secondary/10 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10 group">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="text-secondary" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Certificates</h3>
              <p className="text-foreground/70 leading-relaxed">
                Earn recognized certificates upon course completion to showcase your achievements.
              </p>
            </div>

            <div className="feature-card bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Community Support</h3>
              <p className="text-foreground/70 leading-relaxed">
                Join a vibrant community of learners, share experiences, and grow together in faith.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section ref={statsRef} className="py-20 bg-linear-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="stat-item text-center">
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">500+</div>
              <div className="text-lg text-foreground/70">Active Students</div>
            </div>
            <div className="stat-item text-center">
              <div className="text-5xl md:text-6xl font-bold text-secondary mb-2">25+</div>
              <div className="text-lg text-foreground/70">Courses Available</div>
            </div>
            <div className="stat-item text-center">
              <div className="text-5xl md:text-6xl font-bold text-accent mb-2">15+</div>
              <div className="text-lg text-foreground/70">Expert Instructors</div>
            </div>
            <div className="stat-item text-center">
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">98%</div>
              <div className="text-lg text-foreground/70">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Featured Courses Section */}
      <section ref={coursesRef} className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured <span className="text-primary">Courses</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Start your journey with our most popular courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="course-card group bg-card rounded-2xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
              <div className="h-48 bg-linear-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="text-primary" size={64} />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">Beginner</span>
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">12 Weeks</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  Arabic Fundamentals
                </h3>
                <p className="text-foreground/70 mb-4 leading-relaxed">
                  Master the Arabic alphabet, basic grammar, and essential vocabulary for everyday conversation.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-accent">
                    <Star size={18} fill="currentColor" />
                    <span className="font-semibold">4.9</span>
                    <span className="text-foreground/60 text-sm">(234)</span>
                  </div>
                  <Link href="/courses" className="text-primary font-semibold hover:gap-2 flex items-center gap-1 transition-all">
                    Enroll Now <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="course-card group bg-card rounded-2xl overflow-hidden border border-secondary/10 hover:border-secondary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/20">
              <div className="h-48 bg-linear-to-br from-secondary/20 to-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="text-secondary" size={64} />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">Intermediate</span>
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">16 Weeks</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors">
                  Quranic Arabic
                </h3>
                <p className="text-foreground/70 mb-4 leading-relaxed">
                  Understand the language of the Quran with detailed grammar analysis and vocabulary building.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-accent">
                    <Star size={18} fill="currentColor" />
                    <span className="font-semibold">5.0</span>
                    <span className="text-foreground/60 text-sm">(189)</span>
                  </div>
                  <Link href="/courses" className="text-secondary font-semibold hover:gap-2 flex items-center gap-1 transition-all">
                    Enroll Now <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="course-card group bg-card rounded-2xl overflow-hidden border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20">
              <div className="h-48 bg-linear-to-br from-accent/20 to-secondary/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="text-accent" size={64} />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">Advanced</span>
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">20 Weeks</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                  Classical Arabic Literature
                </h3>
                <p className="text-foreground/70 mb-4 leading-relaxed">
                  Explore classical texts, poetry, and advanced linguistic concepts for mastery.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-accent">
                    <Star size={18} fill="currentColor" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-foreground/60 text-sm">(156)</span>
                  </div>
                  <Link href="/courses" className="text-accent font-semibold hover:gap-2 flex items-center gap-1 transition-all">
                    Enroll Now <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-background rounded-full font-semibold text-lg hover:bg-primary hover:shadow-lg hover:shadow-secondary/30 transition-all duration-300 hover:scale-105"
            >
              View All Courses
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 bg-linear-to-b from-card/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              What Our <span className="text-primary">Students Say</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Real experiences from our learning community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial-card bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center gap-1 text-accent mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 italic">
                &quot;The structured approach and supportive community made learning Arabic enjoyable and effective. I&apos;ve made incredible progress in just a few months!&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  AH
                </div>
                <div>
                  <div className="font-semibold text-foreground">Ahmed Hassan</div>
                  <div className="text-sm text-foreground/60">Software Engineer</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-secondary/10 hover:border-secondary/30 transition-all duration-300">
              <div className="flex items-center gap-1 text-accent mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 italic">
                &quot;As a mother of three, the flexible schedule was perfect for me. The instructors are patient and knowledgeable. Highly recommend!&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary">
                  FZ
                </div>
                <div>
                  <div className="font-semibold text-foreground">Fatima Zahra</div>
                  <div className="text-sm text-foreground/60">Home Educator</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-accent/10 hover:border-accent/30 transition-all duration-300">
              <div className="flex items-center gap-1 text-accent mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 italic">
                &quot;The Quranic Arabic course deepened my understanding of the Quran tremendously. The teachers explain complex concepts with clarity.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                  YA
                </div>
                <div>
                  <div className="font-semibold text-foreground">Yusuf Ali</div>
                  <div className="text-sm text-foreground/60">Medical Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-primary via-accent to-secondary opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Begin Your <span className="text-primary">Journey?</span>
            </h2>
            <p className="text-xl text-foreground/70 mb-10 leading-relaxed">
              Join thousands of students worldwide in mastering Arabic and deepening your connection with Islamic knowledge.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
              <Link
                href="/register"
                className="group px-10 py-5 bg-primary text-background rounded-full font-bold text-xl hover:bg-accent hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-110 flex items-center gap-3"
              >
                Start Learning Today
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
              </Link>
              
              <Link
                href="/courses"
                className="px-10 py-5 border-3 border-secondary text-secondary rounded-full font-bold text-xl hover:bg-secondary hover:text-background transition-all duration-300 hover:scale-110 flex items-center gap-3"
              >
                <Play size={24} />
                Explore Courses
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-foreground/60">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary" size={24} />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary" size={24} />
                <span>Free Trial Available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-primary" size={24} />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Arabic Section */}
      <section className="py-20 bg-linear-to-b from-background to-card/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-primary/20">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <CheckCircle className="text-primary" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground mb-2">Understand the Quran</h4>
                        <p className="text-foreground/70">Connect directly with the words of Allah without translation barriers.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
                      <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                        <CheckCircle className="text-secondary" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground mb-2">Access Classical Texts</h4>
                        <p className="text-foreground/70">Read authentic Islamic literature and scholarly works in their original form.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                        <CheckCircle className="text-accent" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground mb-2">Connect with Heritage</h4>
                        <p className="text-foreground/70">Bridge the gap with your cultural and religious roots through language.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <CheckCircle className="text-primary" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground mb-2">Enhance Your Prayers</h4>
                        <p className="text-foreground/70">Deepen your khushu by understanding every word you recite in salah.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-12 bg-primary rounded-full"></div>
                <span className="text-primary font-semibold uppercase tracking-wider">The Power of Arabic</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Why Learn <span className="text-primary">Arabic?</span>
              </h2>
              <p className="text-xl text-foreground/70 leading-relaxed mb-6">
                Arabic is not just a language—it&apos;s the key to unlocking a deeper understanding of Islam, 
                the Quran, and centuries of Islamic scholarship and wisdom.
              </p>
              <p className="text-lg text-foreground/60 leading-relaxed mb-8">
                Whether you want to recite the Quran with proper tajweed, understand Islamic lectures, 
                or connect with Arabic-speaking communities, our comprehensive courses will guide you every step of the way.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-4 transition-all group"
              >
                Learn More About Our Mission
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Process Section */}
      <section className="py-20 bg-linear-to-r from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Your Learning <span className="text-primary">Journey</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              A simple, proven path to Arabic mastery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-linear-to-r from-primary via-secondary to-accent opacity-20"></div>

            <div className="relative text-center group">
              <div className="w-32 h-32 mx-auto bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform relative z-10">
                <span className="text-5xl font-bold text-background">1</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Sign Up</h3>
              <p className="text-foreground/70">Create your free account and explore our course catalog</p>
            </div>

            <div className="relative text-center group">
              <div className="w-32 h-32 mx-auto bg-linear-to-br from-secondary to-primary rounded-full flex items-center justify-center mb-6 shadow-lg shadow-secondary/30 group-hover:scale-110 transition-transform relative z-10">
                <span className="text-5xl font-bold text-background">2</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Choose Course</h3>
              <p className="text-foreground/70">Select courses that match your level and goals</p>
            </div>

            <div className="relative text-center group">
              <div className="w-32 h-32 mx-auto bg-linear-to-br from-accent to-secondary rounded-full flex items-center justify-center mb-6 shadow-lg shadow-accent/30 group-hover:scale-110 transition-transform relative z-10">
                <span className="text-5xl font-bold text-background">3</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Learn & Practice</h3>
              <p className="text-foreground/70">Follow structured lessons with interactive exercises</p>
            </div>

            <div className="relative text-center group">
              <div className="w-32 h-32 mx-auto bg-linear-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform relative z-10">
                <span className="text-5xl font-bold text-background">4</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Achieve Mastery</h3>
              <p className="text-foreground/70">Earn certificates and unlock advanced content</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Frequently Asked <span className="text-primary">Questions</span>
              </h2>
              <p className="text-xl text-foreground/70">
                Quick answers to common questions
              </p>
            </div>

            <div className="space-y-4">
              <details className="group bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/10 hover:border-primary/30 transition-all overflow-hidden">
                <summary className="px-6 py-5 cursor-pointer font-semibold text-lg text-foreground flex items-center justify-between list-none">
                  <span>Do I need any prior knowledge of Arabic?</span>
                  <ArrowDown className="group-open:rotate-180 transition-transform text-primary" size={24} />
                </summary>
                <div className="px-6 pb-5 text-foreground/70 leading-relaxed">
                  No prior knowledge is required! Our beginner courses start from the very basics, teaching you the Arabic alphabet, 
                  pronunciation, and fundamental grammar. We guide you step-by-step from zero to fluency.
                </div>
              </details>

              <details className="group bg-card/50 backdrop-blur-sm rounded-2xl border border-secondary/10 hover:border-secondary/30 transition-all overflow-hidden">
                <summary className="px-6 py-5 cursor-pointer font-semibold text-lg text-foreground flex items-center justify-between list-none">
                  <span>How long does it take to complete a course?</span>
                  <ArrowDown className="group-open:rotate-180 transition-transform text-secondary" size={24} />
                </summary>
                <div className="px-6 pb-5 text-foreground/70 leading-relaxed">
                  Course duration varies from 8 to 20 weeks depending on the level and intensity. However, you can learn at your own pace—
                  all courses remain accessible, and you can take as much time as you need to master the material.
                </div>
              </details>

              <details className="group bg-card/50 backdrop-blur-sm rounded-2xl border border-accent/10 hover:border-accent/30 transition-all overflow-hidden">
                <summary className="px-6 py-5 cursor-pointer font-semibold text-lg text-foreground flex items-center justify-between list-none">
                  <span>Are the courses taught live or pre-recorded?</span>
                  <ArrowDown className="group-open:rotate-180 transition-transform text-accent" size={24} />
                </summary>
                <div className="px-6 pb-5 text-foreground/70 leading-relaxed">
                  We offer both! You get access to high-quality pre-recorded lessons that you can watch anytime, plus optional live sessions 
                  with instructors for real-time interaction, Q&A, and personalized feedback.
                </div>
              </details>

              <details className="group bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/10 hover:border-primary/30 transition-all overflow-hidden">
                <summary className="px-6 py-5 cursor-pointer font-semibold text-lg text-foreground flex items-center justify-between list-none">
                  <span>Will I receive a certificate?</span>
                  <ArrowDown className="group-open:rotate-180 transition-transform text-primary" size={24} />
                </summary>
                <div className="px-6 pb-5 text-foreground/70 leading-relaxed">
                  Yes! Upon successful completion of each course, you&apos;ll receive a certificate of completion that you can download and share. 
                  These certificates demonstrate your commitment and achievement in Arabic language studies.
                </div>0
              </details>
            </div>

            <div className="text-center mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-4 transition-all"
              >
                Have more questions? Contact us
                <MessageSquare size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
      `}</style>
    </div>
  );
}