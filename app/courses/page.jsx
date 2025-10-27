'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, Clock, Users, Star, Calendar, CheckCircle, 
  Award, TrendingUp, Sparkles, Filter, Search, ArrowRight,
  Play, Lock, BadgeCheck, Zap
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mock data for courses
const coursesData = {
  current: [
    {
      id: 1,
      title: "Arabic Fundamentals",
      instructor: "Ustadh Umair",
      level: "Beginner",
      duration: "12 weeks",
      students: 234,
      rating: 4.9,
      progress: 45,
      enrolled: true,
      startDate: "Jan 15, 2025",
      endDate: "Apr 8, 2025",
      price: "$99",
      description: "Master the Arabic alphabet, basic grammar, and essential vocabulary for everyday conversation.",
      image: "primary",
      lessons: 48,
      nextLesson: "Lesson 12: Past Tense Verbs"
    },
    {
      id: 2,
      title: "Modern Standard Arabic",
      instructor: "Ustadh Uzair",
      level: "Intermediate",
      duration: "16 weeks",
      students: 189,
      rating: 5.0,
      progress: 60,
      enrolled: true,
      startDate: "Jan 20, 2025",
      endDate: "May 12, 2025",
      price: "$149",
      description: "Master the Arabic used in news, literature, and formal communication across the Arab world.",
      image: "secondary",
      lessons: 64,
      nextLesson: "Lesson 24: Advanced Sentence Structure"
    },
    {
      id: 3,
      title: "Conversational Arabic",
      instructor: "Ustadh Umair",
      level: "Intermediate",
      duration: "10 weeks",
      students: 156,
      rating: 4.8,
      progress: 30,
      enrolled: true,
      startDate: "Feb 1, 2025",
      endDate: "Apr 14, 2025",
      price: "$89",
      description: "Build confidence in speaking Arabic through practical dialogues and real-world scenarios.",
      image: "accent",
      lessons: 40,
      nextLesson: "Lesson 8: Restaurant Conversations"
    }
  ],
  upcoming: [
    {
      id: 4,
      title: "Classical Arabic Literature",
      instructor: "Ustadh Uzair",
      level: "Advanced",
      duration: "20 weeks",
      students: 0,
      rating: null,
      startDate: "May 1, 2025",
      price: "$199",
      description: "Explore classical texts, poetry, and advanced linguistic concepts for complete mastery.",
      image: "primary",
      lessons: 80,
      spotsLeft: 25
    },
    {
      id: 5,
      title: "Arabic Grammar Mastery",
      instructor: "Ustadh Umair",
      level: "Advanced",
      duration: "14 weeks",
      students: 0,
      rating: null,
      startDate: "May 15, 2025",
      price: "$129",
      description: "Deep dive into Arabic grammar (Nahw) with comprehensive analysis and practice.",
      image: "secondary",
      lessons: 56,
      spotsLeft: 30
    },
    {
      id: 6,
      title: "Arabic Writing Workshop",
      instructor: "Ustadh Uzair",
      level: "Intermediate",
      duration: "8 weeks",
      students: 0,
      rating: null,
      startDate: "June 1, 2025",
      price: "$79",
      description: "Develop your Arabic writing skills through guided practice and feedback.",
      image: "accent",
      lessons: 32,
      spotsLeft: 20
    }
  ],
  past: [
    {
      id: 7,
      title: "Arabic Essentials",
      instructor: "Ustadh Umair",
      level: "Beginner",
      duration: "10 weeks",
      students: 312,
      rating: 4.9,
      startDate: "Sep 1, 2024",
      endDate: "Nov 10, 2024",
      price: "$89",
      description: "Introduction to Arabic alphabet, pronunciation, and basic phrases.",
      image: "primary",
      lessons: 40,
      certified: 298
    },
    {
      id: 8,
      title: "Intermediate Arabic",
      instructor: "Ustadh Uzair",
      level: "Intermediate",
      duration: "12 weeks",
      students: 245,
      rating: 4.8,
      startDate: "Sep 15, 2024",
      endDate: "Dec 8, 2024",
      price: "$119",
      description: "Building on fundamentals with expanded grammar and vocabulary.",
      image: "secondary",
      lessons: 48,
      certified: 231
    },
    {
      id: 9,
      title: "Arabic Poetry & Literature",
      instructor: "Ustadh Uzair",
      level: "Advanced",
      duration: "16 weeks",
      students: 178,
      rating: 5.0,
      startDate: "Aug 1, 2024",
      endDate: "Nov 24, 2024",
      price: "$159",
      description: "Explore the beauty of Arabic poetry and classical literature.",
      image: "accent",
      lessons: 64,
      certified: 165
    }
  ]
};

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Replace with actual auth check
  
  const headerRef = useRef(null);
  const tabsRef = useRef(null);
  const coursesRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status (replace with actual auth logic)
    // const user = useAuth(); 
    // setIsAuthenticated(!!user);
  }, []);

  useEffect(() => {
    // Header animation
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }

    // Tabs animation
    if (tabsRef.current) {
      gsap.fromTo(tabsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    // Courses animation on tab change
    if (coursesRef.current) {
      const cards = coursesRef.current.querySelectorAll('.course-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, [activeTab, filterLevel, searchQuery]);

  const handleEnroll = (courseId, isEnrolled = false) => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      router.push(`/login?redirect=/courses/${courseId}`);
      return;
    }
    
    if (isEnrolled) {
      // Go to course content
      router.push(`/courses/${courseId}/learn`);
    } else {
      // Go to enrollment page
      router.push(`/courses/${courseId}/enroll`);
    }
  };

  const filteredCourses = coursesData[activeTab].filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || course.level.toLowerCase() === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level) => {
    switch(level.toLowerCase()) {
      case 'beginner': return 'text-primary bg-primary/10 border-primary/20';
      case 'intermediate': return 'text-accent bg-accent/10 border-accent/20';
      case 'advanced': return 'text-secondary bg-secondary/10 border-secondary/20';
      default: return 'text-foreground/60 bg-foreground/5 border-foreground/10';
    }
  };

  const getImageGradient = (image) => {
    switch(image) {
      case 'primary': return 'from-primary/20 to-accent/20';
      case 'secondary': return 'from-secondary/20 to-primary/20';
      case 'accent': return 'from-accent/20 to-secondary/20';
      default: return 'from-primary/20 to-secondary/20';
    }
  };

  return (
    <div className='overflow-hidden min-h-screen bg-gradient-to-b from-background to-card/20 mt-40'>
      {/* Header Section */}
      <div ref={headerRef} className='relative pt-32 pb-12'>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className='container mx-auto px-4 relative z-10'>
          <div className='text-center max-w-4xl mx-auto'>
            <div className='flex items-center justify-center gap-2 mb-6'>
              <Sparkles className="text-primary animate-pulse" size={24} />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Your Learning Journey
              </span>
            </div>
            
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6'>
              Explore Our <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary'>Courses</span>
            </h1>
            
            <p className='text-xl md:text-2xl text-foreground/70 leading-relaxed'>
              Choose from beginner to advanced levels and start mastering Arabic today
            </p>
          </div>
        </div>
      </div>

      {/* Tabs and Filters Section */}
      <div ref={tabsRef} className='sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-primary/10'>
        <div className='container mx-auto px-4 py-6'>
          {/* Tabs */}
          <div className='flex flex-wrap items-center justify-center gap-3 mb-6'>
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'current'
                  ? 'bg-primary text-background shadow-lg shadow-primary/30'
                  : 'bg-card/50 text-foreground/70 hover:bg-card hover:text-foreground'
              }`}
            >
              <div className='flex items-center gap-2'>
                <Play size={18} />
                Current Courses
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'upcoming'
                  ? 'bg-secondary text-background shadow-lg shadow-secondary/30'
                  : 'bg-card/50 text-foreground/70 hover:bg-card hover:text-foreground'
              }`}
            >
              <div className='flex items-center gap-2'>
                <Calendar size={18} />
                Upcoming Courses
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'past'
                  ? 'bg-accent text-background shadow-lg shadow-accent/30'
                  : 'bg-card/50 text-foreground/70 hover:bg-card hover:text-foreground'
              }`}
            >
              <div className='flex items-center gap-2'>
                <Award size={18} />
                Past Courses
              </div>
            </button>
          </div>

          {/* Search and Filter */}
          <div className='flex flex-col md:flex-row gap-4 max-w-4xl mx-auto'>
            <div className='flex-1 relative'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40' size={20} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-12 pr-4 py-3 rounded-full bg-card/50 border border-primary/10 focus:border-primary/30 focus:outline-none text-foreground placeholder:text-foreground/40 transition-all'
              />
            </div>
            
            <div className='relative md:w-64'>
              <Filter className='absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40' size={20} />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className='w-full pl-12 pr-4 py-3 rounded-full bg-card/50 border border-primary/10 focus:border-primary/30 focus:outline-none text-foreground appearance-none cursor-pointer transition-all'
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div ref={coursesRef} className='container mx-auto px-4 py-16'>
        {filteredCourses.length === 0 ? (
          <div className='text-center py-20'>
            <BookOpen className='mx-auto text-foreground/20 mb-4' size={64} />
            <h3 className='text-2xl font-bold text-foreground/60 mb-2'>No courses found</h3>
            <p className='text-foreground/40'>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredCourses.map((course) => (
              <div key={course.id} className='course-card group'>
                <div className='h-full bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 flex flex-col'>
                  
                  {/* Course Image/Header */}
                  <div className={`h-48 bg-gradient-to-br ${getImageGradient(course.image)} relative overflow-hidden`}>
                    <div className='absolute inset-0 flex flex-col justify-between p-6'>
                      <div className='flex items-start justify-between'>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>
                        {course.rating && (
                          <div className='flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full'>
                            <Star size={14} fill="currentColor" className='text-accent' />
                            <span className='text-sm font-semibold text-foreground'>{course.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        {activeTab === 'current' && course.enrolled && (
                          <div className='bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg'>
                            <div className='flex items-center justify-between mb-1'>
                              <span className='text-xs font-semibold text-foreground'>Progress</span>
                              <span className='text-xs font-bold text-primary'>{course.progress}%</span>
                            </div>
                            <div className='h-2 bg-foreground/10 rounded-full overflow-hidden'>
                              <div 
                                className='h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500'
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {activeTab === 'upcoming' && course.spotsLeft && (
                          <div className='bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full inline-flex items-center gap-2'>
                            <Zap size={14} className='text-accent' />
                            <span className='text-xs font-semibold text-foreground'>{course.spotsLeft} spots left</span>
                          </div>
                        )}
                        {activeTab === 'past' && course.certified && (
                          <div className='bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full inline-flex items-center gap-2'>
                            <BadgeCheck size={14} className='text-primary' />
                            <span className='text-xs font-semibold text-foreground'>{course.certified} certified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className='p-6 flex-1 flex flex-col'>
                    <h3 className='text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors'>
                      {course.title}
                    </h3>
                    
                    <p className='text-sm text-foreground/60 mb-4 flex items-center gap-2'>
                      <Users size={14} />
                      {course.instructor}
                    </p>

                    <p className='text-foreground/70 mb-4 leading-relaxed line-clamp-2 flex-1'>
                      {course.description}
                    </p>

                    {/* Course Info */}
                    <div className='grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-primary/10'>
                      <div className='flex items-center gap-2 text-foreground/60'>
                        <Clock size={16} className='text-primary' />
                        <span className='text-sm'>{course.duration}</span>
                      </div>
                      <div className='flex items-center gap-2 text-foreground/60'>
                        <BookOpen size={16} className='text-secondary' />
                        <span className='text-sm'>{course.lessons} lessons</span>
                      </div>
                      <div className='flex items-center gap-2 text-foreground/60'>
                        <Calendar size={16} className='text-accent' />
                        <span className='text-sm'>{course.startDate}</span>
                      </div>
                      <div className='flex items-center gap-2 text-foreground/60'>
                        <Users size={16} className='text-primary' />
                        <span className='text-sm'>{course.students}+ students</span>
                      </div>
                    </div>

                    {/* Next Lesson for Current Courses */}
                    {activeTab === 'current' && course.nextLesson && (
                      <div className='mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10'>
                        <p className='text-xs font-semibold text-primary mb-1'>Next Lesson</p>
                        <p className='text-sm text-foreground/80'>{course.nextLesson}</p>
                      </div>
                    )}

                    {/* CTA Button */}
                    <div className='flex items-center justify-between gap-3 mt-auto'>
                      <span className='text-2xl font-bold text-primary'>{course.price}</span>
                      
                      {activeTab === 'current' && course.enrolled ? (
                        <button
                          onClick={() => handleEnroll(course.id, true)}
                          className='flex-1 px-6 py-3 bg-primary text-background rounded-full font-semibold hover:bg-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2'
                        >
                          Continue Learning
                          <ArrowRight size={18} />
                        </button>
                      ) : activeTab === 'past' ? (
                        <button
                          disabled
                          className='flex-1 px-6 py-3 bg-foreground/5 text-foreground/40 rounded-full font-semibold cursor-not-allowed flex items-center justify-center gap-2'
                        >
                          <Lock size={18} />
                          Completed
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course.id, false)}
                          className='flex-1 px-6 py-3 bg-secondary text-background rounded-full font-semibold hover:bg-primary hover:shadow-lg hover:shadow-secondary/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2'
                        >
                          Enroll Now
                          <ArrowRight size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className='py-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-6'>
            Can&apos;t Find What You&apos;re <span className='text-primary'>Looking For?</span>
          </h2>
          <p className='text-xl text-foreground/70 mb-8 max-w-2xl mx-auto'>
            Contact us to suggest a course or learn about custom learning paths tailored to your goals
          </p>
          <Link
            href="/contact"
            className='inline-flex items-center gap-2 px-8 py-4 bg-primary text-background rounded-full font-semibold text-lg hover:bg-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105'
          >
            Contact Us
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;