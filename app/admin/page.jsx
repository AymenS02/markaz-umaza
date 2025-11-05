'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, Users, TrendingUp, DollarSign, Calendar,
  Award, Eye, ArrowRight, Sparkles, Activity, Clock,
  CheckCircle, AlertCircle, BarChart3, PieChart, Target
} from 'lucide-react';
import { gsap } from 'gsap';

const AdminDashboard = () => {
  const router = useRouter();
  const dashboardRef = useRef(null);
  const cardsRef = useRef(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeEnrollments: 0,
    pendingPayments: 0,
    completedCourses: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Animations
    if (dashboardRef.current) {
      gsap.fromTo(dashboardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (cardsRef.current && !loading) {
      const cards = cardsRef.current.querySelectorAll('.stat-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );
    }
  }, [loading]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes, coursesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/recent-activity'),
        fetch('/api/admin/top-courses')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivity(activityData);
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setTopCourses(coursesData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Manage Courses',
      description: 'Create, edit, and manage all courses',
      icon: BookOpen,
      color: 'primary',
      href: '/admin/courses',
      stats: `${stats.totalCourses} courses`
    },
    {
      title: 'View Students',
      description: 'See all registered students and enrollments',
      icon: Users,
      color: 'secondary',
      href: '/admin/students',
      stats: `${stats.totalStudents} students`
    },
    {
      title: 'Pending Payments',
      description: 'Review and approve e-Transfer payments',
      icon: DollarSign,
      color: 'accent',
      href: '/admin/payments',
      stats: `${stats.pendingPayments} pending`,
      badge: stats.pendingPayments > 0 ? stats.pendingPayments : null
    },
    // {
    //   title: 'Analytics',
    //   description: 'View detailed reports and insights',
    //   icon: BarChart3,
    //   color: 'primary',
    //   href: '/admin/analytics',
    //   stats: 'View reports'
    // }
  ];

  const getColorClasses = (color) => {
    switch(color) {
      case 'primary':
        return {
          bg: 'bg-primary/10',
          border: 'border-primary/20',
          hover: 'hover:border-primary/40',
          text: 'text-primary',
          icon: 'text-primary'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary/10',
          border: 'border-secondary/20',
          hover: 'hover:border-secondary/40',
          text: 'text-secondary',
          icon: 'text-secondary'
        };
      case 'accent':
        return {
          bg: 'bg-accent/10',
          border: 'border-accent/20',
          hover: 'hover:border-accent/40',
          text: 'text-accent',
          icon: 'text-accent'
        };
      default:
        return {
          bg: 'bg-foreground/5',
          border: 'border-foreground/10',
          hover: 'hover:border-foreground/20',
          text: 'text-foreground',
          icon: 'text-foreground/60'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-card/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="min-h-screen bg-gradient-to-b from-background to-card/20 py-20 px-4 mt-20 md:mt-42">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-foreground/60">Welcome back! Here&apos;s what&apos;s happening.</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="stat-card bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/20 p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="text-primary" size={24} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-2">{stats.totalStudents}</h3>
            <p className="text-foreground/60">Total Students</p>
          </div>

          <div className="stat-card bg-card/50 backdrop-blur-sm rounded-2xl border border-secondary/20 p-6 hover:border-secondary/40 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="text-secondary" size={24} />
              </div>
              <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                {stats.totalCourses} active courses
              </span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-2">{stats.activeEnrollments}</h3>
            <p className="text-foreground/60">Active Enrollments</p>
          </div>

          <div className="stat-card bg-card/50 backdrop-blur-sm rounded-2xl border border-accent/20 p-6 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <DollarSign className="text-accent" size={24} />
              </div>
              <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                This month
              </span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-2">${stats.totalRevenue.toLocaleString()}</h3>
            <p className="text-foreground/60">Total Revenue</p>
          </div>

          <div className="stat-card bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/20 p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Clock className="text-primary" size={24} />
              </div>
              {stats.pendingPayments > 0 && (
                <span className="px-3 py-1 bg-accent text-background text-xs font-semibold rounded-full animate-pulse">
                  Needs attention
                </span>
              )}
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-2">{stats.pendingPayments}</h3>
            <p className="text-foreground/60">Pending Payments</p>
          </div>

          {/* <div className="stat-card bg-card/50 backdrop-blur-sm rounded-2xl border border-secondary/20 p-6 hover:border-secondary/40 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Award className="text-secondary" size={24} />
              </div>
              <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                98% rate
              </span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-2">{stats.completedCourses}</h3>
            <p className="text-foreground/60">Completed Courses</p>
          </div>

          <div className="stat-card bg-card/50 backdrop-blur-sm rounded-2xl border border-accent/20 p-6 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-accent" size={24} />
              </div>
              <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                +8% growth
              </span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-2">24</h3>
            <p className="text-foreground/60">New This Week</p>
          </div> */}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Target className="text-primary" size={24} />
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => {
              const colors = getColorClasses(action.color);
              const Icon = action.icon;
              
              return (
                <Link
                  key={index}
                  href={action.href}
                  className={`group relative bg-card/50 backdrop-blur-sm rounded-2xl border ${colors.border} ${colors.hover} p-6 transition-all duration-300 hover:shadow-xl hover:scale-105`}
                >
                  {action.badge && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-background rounded-full flex items-center justify-center font-bold text-sm animate-bounce">
                      {action.badge}
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={colors.icon} size={28} />
                    </div>
                    <ArrowRight className={`${colors.text} group-hover:translate-x-2 transition-transform`} size={24} />
                  </div>
                  
                  <h3 className={`text-2xl font-bold text-foreground mb-2 group-hover:${colors.text} transition-colors`}>
                    {action.title}
                  </h3>
                  <p className="text-foreground/70 mb-4">{action.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <Activity className={colors.icon} size={16} />
                    <span className={`text-sm font-semibold ${colors.text}`}>{action.stats}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Courses */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/20 p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <PieChart className="text-primary" size={24} />
              Top Performing Courses
            </h2>
            
            <div className="space-y-4">
              {topCourses.length > 0 ? (
                topCourses.map((course, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-background/50 rounded-xl border border-primary/10 hover:border-primary/30 transition-all">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{course.title}</h4>
                      <p className="text-sm text-foreground/60">{course.enrolledStudents} students</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">${course.revenue}</div>
                      <div className="text-xs text-foreground/60">revenue</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-foreground/60">
                  No course data available yet
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-secondary/20 p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Activity className="text-secondary" size={24} />
              Recent Activity
            </h2>
            
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-background/50 rounded-xl border border-secondary/10">
                    <div className={`w-10 h-10 ${activity.type === 'enrollment' ? 'bg-primary/10' : activity.type === 'payment' ? 'bg-accent/10' : 'bg-secondary/10'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {activity.type === 'enrollment' ? (
                        <CheckCircle className="text-primary" size={20} />
                      ) : activity.type === 'payment' ? (
                        <DollarSign className="text-accent" size={20} />
                      ) : (
                        <Users className="text-secondary" size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium">{activity.message}</p>
                      <p className="text-sm text-foreground/60">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-foreground/60">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;