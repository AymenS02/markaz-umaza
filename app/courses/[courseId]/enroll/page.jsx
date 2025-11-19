'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle, ArrowLeft, Mail, DollarSign, CreditCard, 
  Shield, Clock, Users, Award, Sparkles, AlertCircle,
  Send, Check, MapPin, ExternalLink
} from 'lucide-react';
import { gsap } from 'gsap';
import { authClient } from '@/lib/auth-client';

const CourseEnrollmentPage = () => {
  const router = useRouter();
  const params = useParams();
  // Change from params?.id to params?.courseId
  const courseId = params?.courseId;
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCanadian, setIsCanadian] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('etransfer');
  const [etransferEmail, setEtransferEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const pageRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (courseId) {
      checkAuthAndLoadCourse();
    }
  }, [courseId]);

  useEffect(() => {
    if (pageRef.current && !loading) {
      gsap.fromTo(pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [loading]);

  const checkAuthAndLoadCourse = async () => {
    try {
      // Check authentication
      const authResponse = await authClient.fetchWithAuth('/api/auth/me');
      
      if (!authResponse.ok) {
        // Not authenticated, redirect to login
        authClient.removeToken();
        router.push(`/login?redirect=/courses/${courseId}/enroll`);
        return;
      }
      
      const userData = await authResponse.json();
      setUser(userData);
      setIsAuthenticated(true);
      
      // Check if user is Canadian (you may want to add country to user schema)
      setIsCanadian(userData.country === 'Canada' || true); // Default to true for now
      
      // Fetch course data
      const courseResponse = await fetch(`/api/courses/${courseId}`);
      
      if (!courseResponse.ok) {
        console.error('Course fetch failed:', courseResponse.status);
        throw new Error('Course not found');
      }
      
      const courseData = await courseResponse.json();
      console.log('Course data loaded:', courseData);
      setCourse(courseData);
      
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.message === 'Course not found') {
        router.push('/courses');
      } else {
        router.push(`/login?redirect=/courses/${courseId}/enroll`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEtransferSubmit = async () => {
    if (!etransferEmail || !user || !course) return;
    
    setIsSubmitting(true);

    try {
      const response = await authClient.fetchWithAuth('/api/enrollments/etransfer', {
        method: 'POST',
        body: JSON.stringify({
          courseId: course._id,
          etransferEmail: etransferEmail,
          amount: course.price,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        
        // Animate success message
        setTimeout(() => {
          gsap.fromTo('.success-message',
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
          );
        }, 100);
      } else {
        alert(data.message || 'Failed to submit payment information. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'TBA';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatPrice = (price) => {
    return price ? `$${price}` : 'Free';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60 font-semibold">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course || !isAuthenticated) {
    return null; // Will redirect
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 mt-42">
        <div className="success-message max-w-2xl w-full bg-card backdrop-blur-sm rounded-3xl border-2 border-primary/20 p-12 text-center shadow-xl">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-primary" size={48} />
          </div>
          
          <h1 className="text-4xl font-black text-foreground mb-4">
            Payment Information Submitted!
          </h1>
          
          <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
            Thank you for submitting your payment details. Our admin team will verify your e-Transfer 
            and grant you access to the course within 24 hours.
          </p>

          <div className="bg-primary/10 rounded-2xl p-6 mb-8 text-left border-2 border-primary/20">
            <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="text-primary" size={20} />
              What&apos;s Next?
            </h3>
            <ul className="space-y-3 text-foreground/70">
              <li className="flex items-start gap-3">
                <Check className="text-primary flex-shrink-0 mt-1" size={18} />
                <span>Check your email for confirmation and e-Transfer instructions</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-primary flex-shrink-0 mt-1" size={18} />
                <span>Send the e-Transfer to: <strong className="text-primary">payments@markazumaza.com</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-primary flex-shrink-0 mt-1" size={18} />
                <span>Admin will verify your payment (usually within 24 hours)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-primary flex-shrink-0 mt-1" size={18} />
                <span>You&apos;ll receive course access links via email</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="px-8 py-4 bg-secondary text-background rounded-full font-bold hover:bg-primary transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Browse More Courses
            </Link>
            <Link
              href="/account"
              className="px-8 py-4 border-2 border-secondary text-secondary rounded-full font-bold hover:bg-secondary hover:text-background transition-all duration-300 hover:scale-105"
            >
              Go to My Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-background py-20 px-4 md:mt-42">
      <div className="container mx-auto max-w-7xl">
        {/* Back Button */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8 group font-bold"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Summary - Left Side */}
          <div className="lg:col-span-1">
            <div className="bg-card backdrop-blur-sm rounded-2xl border-2 border-foreground/10 p-6 sticky top-24 shadow-xl">
              {/* KEEP GRADIENT on course image */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl mb-6 flex items-center justify-center">
                <Award className="text-primary" size={64} />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">{course.title}</h2>
              <p className="text-foreground/60 mb-6 font-semibold">with {course.instructor}</p>

              <div className="space-y-3 mb-6 pb-6 border-b-2 border-foreground/10">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60 font-semibold">Level:</span>
                  <span className="font-bold text-primary capitalize">{course.difficultyLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60 font-semibold">Duration:</span>
                  <span className="font-bold text-foreground">{course.durationWeeks} weeks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60 font-semibold">Lessons:</span>
                  <span className="font-bold text-foreground">{course.totalLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60 font-semibold">Starts:</span>
                  <span className="font-bold text-foreground">{formatDate(course.startDate)}</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-foreground/60 mb-2 font-bold uppercase tracking-wider">Course Price</div>
                <div className="text-5xl font-black text-primary mb-2">${course.price}</div>
                <div className="text-sm text-foreground/60 font-semibold">CAD One-time payment</div>
              </div>

              <div className="mt-6 p-4 bg-primary/10 rounded-xl border-2 border-primary/20">
                <div className="flex items-start gap-3">
                  <Shield className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Secure Payment</h4>
                    <p className="text-sm text-foreground/60">Your information is protected and secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form - Right Side */}
          <div className="lg:col-span-2">
            <div className="bg-card backdrop-blur-sm rounded-2xl border-2 border-foreground/10 p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="text-primary" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-foreground">Complete Your Enrollment</h1>
                  <p className="text-foreground/60 font-semibold">Secure your spot in this course</p>
                </div>
              </div>

              {/* What You'll Get */}
              <div className="mb-8 p-6 bg-secondary/10 rounded-xl border-2 border-secondary/20">
                <h3 className="font-black text-xl text-foreground mb-4">What&apos;s Included:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.learningOutcomes ? (
                    course.learningOutcomes.split('\n').map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={18} />
                        <span className="text-foreground/70">{outcome}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={18} />
                        <span className="text-foreground/70">{course.totalLessons} comprehensive video lessons</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={18} />
                        <span className="text-foreground/70">Interactive exercises and quizzes</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={18} />
                        <span className="text-foreground/70">Downloadable study materials</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={18} />
                        <span className="text-foreground/70">Certificate of completion</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={18} />
                        <span className="text-foreground/70">Access to WhatsApp/Telegram community</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={18} />
                        <span className="text-foreground/70">Weekly live Q&A sessions</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Course Description */}
              {course.description && (
                <div className="mb-8 p-6 bg-primary/10 rounded-xl border-2 border-primary/20">
                  <h3 className="font-black text-xl text-foreground mb-3">About This Course</h3>
                  <p className="text-foreground/70 leading-relaxed">{course.description}</p>
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="mb-8">
                <h3 className="font-black text-xl text-foreground mb-4">Select Payment Method</h3>
                
                <div className="space-y-4">
                  {isCanadian && (
                    <button
                      onClick={() => setPaymentMethod('etransfer')}
                      className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        paymentMethod === 'etransfer'
                          ? 'border-primary bg-primary/10 shadow-lg'
                          : 'border-foreground/20 hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                          paymentMethod === 'etransfer' ? 'border-primary' : 'border-foreground/30'
                        }`}>
                          {paymentMethod === 'etransfer' && (
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <Mail className="text-primary" size={24} />
                            <h4 className="font-black text-lg text-foreground">Interac e-Transfer</h4>
                            <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full flex items-center gap-1 border border-primary/30">
                              <MapPin size={12} />
                              Canada Only
                            </span>
                          </div>
                          <p className="text-foreground/60 text-sm font-semibold">
                            Instant, secure transfer from your Canadian bank account. No fees.
                          </p>
                        </div>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                      paymentMethod === 'card'
                        ? 'border-secondary bg-secondary/10 shadow-lg'
                        : 'border-foreground/20 hover:border-secondary/40'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                        paymentMethod === 'card' ? 'border-secondary' : 'border-foreground/30'
                      }`}>
                        {paymentMethod === 'card' && (
                          <div className="w-3 h-3 rounded-full bg-secondary"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <CreditCard className="text-secondary" size={24} />
                          <h4 className="font-black text-lg text-foreground">Credit/Debit Card</h4>
                          <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full border border-accent/30">
                            Coming Soon
                          </span>
                        </div>
                        <p className="text-foreground/60 text-sm font-semibold">
                          Pay securely with Visa, Mastercard, or American Express via Stripe.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* e-Transfer Form */}
              {paymentMethod === 'etransfer' && (
                <div ref={formRef} className="space-y-6">
                  <div className="bg-accent/10 rounded-xl p-6 border-2 border-accent/30">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertCircle className="text-accent flex-shrink-0 mt-1" size={20} />
                      <div>
                        <h4 className="font-bold text-foreground mb-2">e-Transfer Instructions</h4>
                        <ol className="space-y-2 text-sm text-foreground/70">
                          <li>1. Send your e-Transfer to: <strong className="text-primary">payments@markazumaza.com</strong></li>
                          <li>2. Use security question: <strong>&quot;Course&quot;</strong> | Answer: <strong>&quot;Arabic&quot;</strong></li>
                          <li>3. Enter the email you&apos;re sending FROM below</li>
                          <li>4. Click submit to notify us of your payment</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Your e-Transfer Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={etransferEmail}
                      onChange={(e) => setEtransferEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-background border-2 border-foreground/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-foreground/40 transition-all"
                    />
                    <p className="text-sm text-foreground/60 mt-2 font-semibold">
                      Enter the email address you&apos;ll use to send the e-Transfer so we can match your payment
                    </p>
                  </div>

                  <div className="bg-primary/10 rounded-xl p-6 border-2 border-primary/20">
                    <h4 className="font-bold text-foreground mb-3">Payment Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-foreground/70 font-semibold">
                        <span>Course: {course.title}</span>
                        <span>${course.price}</span>
                      </div>
                      <div className="flex justify-between text-foreground/70 font-semibold">
                        <span>Processing Fee</span>
                        <span className="text-primary">$0</span>
                      </div>
                      <div className="border-t-2 border-primary/20 pt-2 mt-2">
                        <div className="flex justify-between text-xl font-black text-foreground">
                          <span>Total</span>
                          <span className="text-primary">${course.price} CAD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleEtransferSubmit}
                    disabled={isSubmitting || !etransferEmail}
                    className="w-full px-8 py-4 bg-primary text-background rounded-full font-black text-lg hover:bg-accent hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-background"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Submit Payment Information
                      </>
                    )}
                  </button>

                  <p className="text-sm text-center text-foreground/60 font-semibold">
                    By enrolling, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              )}

              {/* Stripe Payment (Coming Soon) */}
              {paymentMethod === 'card' && (
                <div className="text-center py-12">
                  <CreditCard className="mx-auto text-foreground/20 mb-4" size={64} />
                  <h3 className="text-2xl font-bold text-foreground mb-2">Card Payments Coming Soon</h3>
                  <p className="text-foreground/60 mb-6">
                    We&apos;re working on integrating Stripe for international payments. 
                    Please use e-Transfer if you&apos;re in Canada or contact us for alternative payment options.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-background rounded-full font-bold hover:bg-primary transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Contact Us for Payment Options
                    <ExternalLink size={18} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEnrollmentPage;