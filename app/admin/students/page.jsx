'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Users, Search, Filter, Mail, Calendar, BookOpen, 
  Award, Eye, Trash2, Ban, CheckCircle, X, ArrowUpDown,
  Download, UserCheck, AlertCircle, Sparkles, MoreVertical
} from 'lucide-react';
import { gsap } from 'gsap';

const AdminStudentsPage = () => {
  const pageRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStudents();
    
    if (pageRef.current) {
      gsap.fromTo(pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    filterAndSortStudents();
  }, [students, searchQuery, filterStatus, sortBy]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/admin/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStudents = () => {
    let filtered = [...students];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(student =>
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(student => student.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'enrollments':
          return (b.enrollments?.length || 0) - (a.enrollments?.length || 0);
        default:
          return 0;
      }
    });

    setFilteredStudents(filtered);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/students/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchStudents();
        alert('Student deleted successfully');
      } else {
        alert('Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('An error occurred');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    
    try {
      const response = await fetch(`/api/admin/students/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchStudents();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Enrollments', 'Joined Date'];
    const rows = filteredStudents.map(s => [
      s.name || '',
      s.email || '',
      s.phone || '',
      s.status || '',
      s.enrollments?.length || 0,
      new Date(s.createdAt).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students-export.csv';
    a.click();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-primary/10 text-primary border-primary/20';
      case 'suspended': return 'bg-accent/10 text-accent border-accent/20';
      case 'pending': return 'bg-secondary/10 text-secondary border-secondary/20';
      default: return 'bg-foreground/5 text-foreground/60 border-foreground/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-card/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-background to-card/20 py-20 px-4 mt-42">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Users className="text-secondary" size={24} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Students Management
                </h1>
              </div>
              <p className="text-foreground/60">
                {filteredStudents.length} of {students.length} students
              </p>
            </div>
            
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-primary text-background rounded-full font-semibold hover:bg-accent hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-primary/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="text-primary" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{students.length}</div>
                <div className="text-sm text-foreground/60">Total Students</div>
              </div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-primary/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <UserCheck className="text-primary" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {students.filter(s => s.status === 'active').length}
                </div>
                <div className="text-sm text-foreground/60">Active</div>
              </div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-secondary/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="text-secondary" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {students.reduce((sum, s) => sum + (s.enrollments?.length || 0), 0)}
                </div>
                <div className="text-sm text-foreground/60">Total Enrollments</div>
              </div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-accent" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {students.filter(s => s.status === 'pending').length}
                </div>
                <div className="text-sm text-foreground/60">Pending</div>
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
                placeholder="Search by name or email..."
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
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
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
                <option value="name">Name (A-Z)</option>
                <option value="enrollments">Most Enrollments</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/5 border-b border-primary/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Enrollments</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Users className="mx-auto text-foreground/20 mb-4" size={48} />
                      <p className="text-foreground/60">No students found</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                            {student.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{student.name || 'Unknown'}</div>
                            <div className="text-sm text-foreground/60">{student.role || 'Student'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-2 text-foreground/80 mb-1">
                            <Mail size={14} />
                            {student.email || 'No email'}
                          </div>
                          {student.phone && (
                            <div className="text-foreground/60">{student.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(student.status || 'pending')}`}>
                          {student.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} className="text-secondary" />
                          <span className="font-semibold text-foreground">
                            {student.enrollments?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <Calendar size={14} />
                          {new Date(student.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="p-2 hover:bg-primary/10 rounded-lg transition-colors group"
                            title="View Details"
                          >
                            <Eye size={18} className="text-foreground/60 group-hover:text-primary" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(student._id, student.status)}
                            className="p-2 hover:bg-accent/10 rounded-lg transition-colors group"
                            title={student.status === 'active' ? 'Suspend' : 'Activate'}
                          >
                            {student.status === 'active' ? (
                              <Ban size={18} className="text-foreground/60 group-hover:text-accent" />
                            ) : (
                              <CheckCircle size={18} className="text-foreground/60 group-hover:text-primary" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student._id)}
                            className="p-2 hover:bg-accent/10 rounded-lg transition-colors group"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-foreground/60 group-hover:text-accent" />
                          </button>
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

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-3xl border border-primary/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                    {selectedStudent.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">{selectedStudent.name || 'Unknown'}</h2>
                    <p className="text-foreground/60">{selectedStudent.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                >
                  <X size={24} className="text-foreground/60" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Account Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-background/50 rounded-xl">
                      <div className="text-sm text-foreground/60 mb-1">Status</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedStudent.status)}`}>
                        {selectedStudent.status || 'pending'}
                      </span>
                    </div>
                    <div className="p-4 bg-background/50 rounded-xl">
                      <div className="text-sm text-foreground/60 mb-1">Role</div>
                      <div className="font-semibold text-foreground">{selectedStudent.role || 'Student'}</div>
                    </div>
                    <div className="p-4 bg-background/50 rounded-xl">
                      <div className="text-sm text-foreground/60 mb-1">Phone</div>
                      <div className="font-semibold text-foreground">{selectedStudent.phone || 'Not provided'}</div>
                    </div>
                    <div className="p-4 bg-background/50 rounded-xl">
                      <div className="text-sm text-foreground/60 mb-1">Joined</div>
                      <div className="font-semibold text-foreground">
                        {new Date(selectedStudent.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Enrollments ({selectedStudent.enrollments?.length || 0})</h3>
                  {selectedStudent.enrollments && selectedStudent.enrollments.length > 0 ? (
                    <div className="space-y-2">
                      {selectedStudent.enrollments.map((enrollment, idx) => (
                        <div key={idx} className="p-4 bg-background/50 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-foreground">{enrollment.courseName || 'Course'}</div>
                            <div className="text-sm text-foreground/60">
                              Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(enrollment.status)}`}>
                            {enrollment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-foreground/60">
                      No enrollments yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentsPage;