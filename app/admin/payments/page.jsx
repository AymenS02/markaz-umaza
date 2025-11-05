'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  DollarSign, Search, Filter, Mail, Calendar, CheckCircle, 
  X, Clock, User, BookOpen, Sparkles, AlertCircle, 
  ArrowUpDown, Eye, Ban, Check, CreditCard, ArrowLeft
} from 'lucide-react';
import { gsap } from 'gsap';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const AdminPaymentsPage = () => {
  const pageRef = useRef(null);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPayments();
    
    if (pageRef.current) {
      gsap.fromTo(pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    filterAndSortPayments();
  }, [payments, searchQuery, filterStatus, sortBy]);

  const fetchPayments = async () => {
    try {
      const response = await authClient.fetchWithAuth('/api/admin/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPayments = () => {
    let filtered = [...payments];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(payment =>
        payment.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.etransferEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(payment => payment.paymentStatus === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount-high':
          return b.amount - a.amount;
        case 'amount-low':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    setFilteredPayments(filtered);
  };

  const handleApprovePayment = async (id) => {
    if (!confirm('Are you sure you want to approve this payment? This will grant the student access to the course.')) return;

    setProcessingId(id);
    try {
      const response = await authClient.fetchWithAuth(`/api/admin/payments/${id}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchPayments();
        setShowModal(false);
        alert('Payment approved successfully! Student has been granted access.');
      } else {
        const error = await response.json();
        alert(`Failed to approve payment: ${error.message}`);
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('An error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectPayment = async (id) => {
    if (!confirm('Are you sure you want to reject this payment? This will delete the enrollment request.')) return;

    setProcessingId(id);
    try {
      const response = await authClient.fetchWithAuth(`/api/admin/payments/${id}/reject`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchPayments();
        setShowModal(false);
        alert('Payment rejected and enrollment deleted.');
      } else {
        const error = await response.json();
        alert(`Failed to reject payment: ${error.message}`);
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('An error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-accent/10 text-accent border-accent/20';
      case 'completed': return 'bg-primary/10 text-primary border-primary/20';
      case 'failed': return 'bg-foreground/10 text-foreground/60 border-foreground/20';
      default: return 'bg-foreground/5 text-foreground/60 border-foreground/10';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-card/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-background to-card/20 py-20 px-4 mt-42">
      <div className="container mx-auto max-w-7xl">
              {/* Back Button */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          Back to Admin Dashboard
        </Link>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <DollarSign className="text-accent" size={24} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Payment Management
              </h1>
              <p className="text-foreground/60">
                Review and approve student payments
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Clock className="text-accent" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {payments.filter(p => p.paymentStatus === 'pending').length}
                </div>
                <div className="text-sm text-foreground/60">Pending</div>
              </div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-primary/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-primary" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {payments.filter(p => p.paymentStatus === 'completed').length}
                </div>
                <div className="text-sm text-foreground/60">Approved</div>
              </div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-secondary/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-secondary" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  ${payments
                    .filter(p => p.paymentStatus === 'completed')
                    .reduce((sum, p) => sum + (p.amount || 0), 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-foreground/60">Total Revenue</div>
              </div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Clock className="text-accent" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  ${payments
                    .filter(p => p.paymentStatus === 'pending')
                    .reduce((sum, p) => sum + (p.amount || 0), 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-foreground/60">Pending Amount</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
              <input
                type="text"
                placeholder="Search by student name, email, or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-primary/20 focus:border-primary focus:outline-none text-foreground placeholder:text-foreground/40 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative md:w-48">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-primary/20 focus:border-primary focus:outline-none text-foreground appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative md:w-48">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-primary/20 focus:border-primary focus:outline-none text-foreground appearance-none cursor-pointer transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/5 border-b border-primary/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">e-Transfer Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <DollarSign className="mx-auto text-foreground/20 mb-4" size={48} />
                      <p className="text-foreground/60">No payments found</p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                            {payment.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{payment.user?.name || 'Unknown'}</div>
                            <div className="text-sm text-foreground/60">{payment.user?.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{payment.course?.title || 'Unknown Course'}</div>
                        <div className="text-sm text-foreground/60">{payment.course?.code || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-foreground/80">
                          <Mail size={14} />
                          <span className="text-sm">{payment.etransferEmail || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-lg text-primary">${payment.amount}</div>
                        <div className="text-xs text-foreground/60">CAD</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.paymentStatus)}`}>
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <Calendar size={14} />
                          {formatDate(payment.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(payment)}
                            className="p-2 hover:bg-secondary/10 rounded-lg transition-colors group"
                            title="View Details"
                          >
                            <Eye size={18} className="text-foreground/60 group-hover:text-secondary" />
                          </button>
                          
                          {payment.paymentStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprovePayment(payment._id)}
                                disabled={processingId === payment._id}
                                className="p-2 hover:bg-primary/10 rounded-lg transition-colors group disabled:opacity-50"
                                title="Approve Payment"
                              >
                                <CheckCircle size={18} className="text-foreground/60 group-hover:text-primary " />
                              </button>
                              <button
                                onClick={() => handleRejectPayment(payment._id)}
                                disabled={processingId === payment._id}
                                className="p-2 hover:bg-accent/10 rounded-lg transition-colors group disabled:opacity-50"
                                title="Reject Payment"
                              >
                                <Ban size={18} className="text-foreground/60 group-hover:text-accent" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-3xl border border-primary/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Payment Details</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedPayment.paymentStatus)}`}>
                    {selectedPayment.paymentStatus}
                  </span>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                >
                  <X size={24} className="text-foreground/60" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-background/50 rounded-xl p-6 border border-primary/10">
                  <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                    <User size={20} className="text-primary" />
                    Student Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Name:</span>
                      <span className="font-semibold text-foreground">{selectedPayment.user?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Email:</span>
                      <span className="font-semibold text-foreground">{selectedPayment.user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Phone:</span>
                      <span className="font-semibold text-foreground">{selectedPayment.user?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="bg-background/50 rounded-xl p-6 border border-secondary/10">
                  <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                    <BookOpen size={20} className="text-secondary" />
                    Course Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Course:</span>
                      <span className="font-semibold text-foreground">{selectedPayment.course?.title || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Code:</span>
                      <span className="font-semibold text-foreground">{selectedPayment.course?.code || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Instructor:</span>
                      <span className="font-semibold text-foreground">{selectedPayment.course?.instructor || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-background/50 rounded-xl p-6 border border-accent/10">
                  <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                    <CreditCard size={20} className="text-accent" />
                    Payment Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Payment Method:</span>
                      <span className="font-semibold text-foreground capitalize">{selectedPayment.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">e-Transfer From:</span>
                      <span className="font-semibold text-foreground">{selectedPayment.etransferEmail || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Amount:</span>
                      <span className="font-bold text-2xl text-primary">${selectedPayment.amount} CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Submitted:</span>
                      <span className="font-semibold text-foreground">{formatDate(selectedPayment.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selectedPayment.paymentStatus === 'pending' && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprovePayment(selectedPayment._id)}
                      disabled={processingId === selectedPayment._id}
                      className="flex-1 px-6 py-4 bg-primary text-background rounded-full font-bold hover:bg-accent hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processingId === selectedPayment._id ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-background"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check size={20} />
                          Approve Payment
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRejectPayment(selectedPayment._id)}
                      disabled={processingId === selectedPayment._id}
                      className="flex-1 px-6 py-4 border-2 border-accent text-accent rounded-full font-bold hover:bg-accent hover:text-background transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Ban size={20} />
                      Reject Payment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;