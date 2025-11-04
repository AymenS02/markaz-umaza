'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, Clock, Users, Star, Calendar, Award,
  Sparkles, Filter, Search, ArrowRight, Play, Lock,
  BadgeCheck, Zap
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  const headerRef = useRef(null);
  const tabsRef = useRef(null);
  const coursesRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }

    if (tabsRef.current) {
      gsap.fromTo(tabsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (coursesRef.current && !loading) {
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
  }, [activeTab, filterLevel, searchQuery, loading]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
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

  const handleEnroll = (courseId) => {
    router.push(`/courses/${courseId}/enroll`);
  };

  // --- Fixed course status logic ---
  const today = new Date();

  const coursesByStatus = {
    current: courses.filter(c => {
      if (!c.startDate || !c.endDate) return false;
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      return start <= today && today <= end;
    }),
    upcoming: courses.filter(c => {
      if (!c.startDate) return false;
      const start = new Date(c.startDate);
      return start > today;
    }),
    past: courses.filter(c => {
      if (!c.endDate) return false;
      const end = new Date(c.endDate);
      return end < today;
    })
  };
  // --- end fix ---

  const filteredCourses = coursesByStatus[activeTab].filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || course.difficultyLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level) => {
    switch(level) {
      case 'beginner': return 'text-primary bg-primary/10 border-primary/20';
      case 'intermediate': return 'text-accent bg-accent/10 border-accent/20';
      case 'advanced': return 'text-secondary bg-secondary/10 border-secondary/20';
      default: return 'text-foreground/60 bg-foreground/5 border-foreground/10';
    }
  };

  const getImageGradient = (index) => {
    const gradients = [
      'from-primary/20 to-accent/20',
      'from-secondary/20 to-primary/20',
      'from-accent/20 to-secondary/20'
    ];
    return gradients[index % gradients.length];
  };

  const formatPrice = (price) => price ? `$${price}` : 'Free';

  const formatDate = (date) => {
    if (!date) return 'TBA';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isUserEnrolled = (courseId) => false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-card/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-hidden min-h-screen bg-gradient-to-b from-background to-card/20 pt-32'>
      {/* Header */}
      <div ref={headerRef} className='relative pb-12'>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className='container mx-auto px-4 relative z-10 text-center max-w-4xl'>
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

      {/* Tabs & Filters */}
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
                Current Courses ({coursesByStatus.current.length})
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
                Upcoming Courses ({coursesByStatus.upcoming.length})
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
                Past Courses ({coursesByStatus.past.length})
              </div>
            </button>
          </div>

          {/* Search & Filter */}
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
            <h3 className='text-2xl font-bold text-foreground/60 mb-2'>
              {courses.length === 0 ? 'No courses available yet' : 'No courses found'}
            </h3>
            <p className='text-foreground/40'>
              {courses.length === 0 ? 'Check back soon for new courses!' : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredCourses.map((course, index) => {
              const isEnrolled = isUserEnrolled(course._id);
              return (
                <div key={course._id} className='course-card group'>
                  <div className='h-full bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 flex flex-col'>
                    
                    {/* Image */}
                    <div className={`h-48 bg-gradient-to-br ${getImageGradient(index)} relative overflow-hidden`}>
                      <div className='absolute inset-0 flex flex-col justify-between p-6'>
                        <div className='flex items-start justify-between'>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(course.difficultyLevel)}`}>
                            {course.difficultyLevel}
                          </span>
                          {course.enrolledStudents > 0 && (
                            <div className='flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full'>
                              <Star size={14} fill="currentColor" className='text-accent' />
                              <span className='text-sm font-semibold text-foreground'>
                                {course.enrolledStudents} enrolled
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className='p-6 flex-1 flex flex-col'>
                      <h3 className='text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors'>
                        {course.title}
                      </h3>
                      
                      <p className='text-sm text-foreground/60 mb-4 flex items-center gap-2'>
                        <Users size={14} />
                        {course.instructor}
                      </p>

                      <p className='text-foreground/70 mb-4 leading-relaxed line-clamp-2 flex-1'>
                        {course.description || 'No description available'}
                      </p>

                      {/* Info */}
                      <div className='grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-primary/10'>
                        <div className='flex items-center gap-2 text-foreground/60'>
                          <Clock size={16} className='text-primary' />
                          <span className='text-sm'>{course.durationWeeks} weeks</span>
                        </div>
                        <div className='flex items-center gap-2 text-foreground/60'>
                          <BookOpen size={16} className='text-secondary' />
                          <span className='text-sm'>{course.totalLessons} lessons</span>
                        </div>
                        <div className='flex items-center gap-2 text-foreground/60'>
                          <Calendar size={16} className='text-accent' />
                          <span className='text-sm'>{formatDate(course.startDate)}</span>
                        </div>
                        <div className='flex items-center gap-2 text-foreground/60'>
                          <Users size={16} className='text-primary' />
                          <span className='text-sm'>{course.enrolledStudents || 0} students</span>
                        </div>
                      </div>

                      {/* Button */}
                      <div className='flex items-center justify-between gap-3 mt-auto'>
                        <span className='text-2xl font-bold text-primary'>{formatPrice(course.price)}</span>
                        
                        {activeTab === 'current' && isEnrolled ? (
                          <button
                            onClick={() => handleEnroll(course._id)}
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
                            onClick={() => handleEnroll(course._id)}
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
              );
            })}
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
