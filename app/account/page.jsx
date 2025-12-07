'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, LogOut, Check, X, Eye, EyeOff, Phone } from 'lucide-react';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passwords, setPasswords] = useState({ current: '', newPass: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState({ email: false, phone: false, password: false });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.location.href = '/login';
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEmail(parsedUser.email);
      setPhone(parsedUser.phone);
    }
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleEmailUpdate = async () => {
    setLoading({ ...loading, email: true });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/account/update-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify({ ...user, email }));
        setUser({ ...user, email });
        showMessage('Email updated successfully!', 'success');
      } else showMessage(data.message || 'Failed to update email', 'error');
    } catch {
      showMessage('Network error occurred', 'error');
    } finally {
      setLoading({ ...loading, email: false });
    }
  };

  const handlePhoneUpdate = async () => {
    setLoading({ ...loading, phone: true });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/account/update-phone', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify({ ...user, phone }));
        setUser({ ...user, phone });
        showMessage('Phone updated successfully!', 'success');
      } else showMessage(data.message || 'Failed to update phone', 'error');
    } catch {
      showMessage('Network error occurred', 'error');
    } finally {
      setLoading({ ...loading, phone: false });
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.newPass)
      return showMessage('Please fill in both password fields', 'error');
    if (passwords.newPass.length < 6)
      return showMessage('New password must be at least 6 characters', 'error');

    setLoading({ ...loading, password: true });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/account/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('Password updated successfully!', 'success');
        setPasswords({ current: '', newPass: '' });
      } else showMessage(data.message || 'Failed to update password', 'error');
    } catch {
      showMessage('Network error occurred', 'error');
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 md:mt-42">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4">
            <User className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-palanquin-dark">
            Account Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Manage your account information and preferences
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 sm:p-4 rounded-lg border-l-4 flex items-center gap-3 text-sm sm:text-base ${
              messageType === 'success'
                ? 'bg-success/10 border-success text-success'
                : messageType === 'error'
                ? 'bg-error/10 border-error text-error'
                : 'bg-info/10 border-info text-info'
            }`}
          >
            {messageType === 'success' ? (
              <Check className="w-5 h-5" />
            ) : messageType === 'error' ? (
              <X className="w-5 h-5" />
            ) : (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Profile Info */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="bg-primary px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-black flex items-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Profile Information
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">First Name</label>
                <p className="text-base sm:text-lg font-semibold text-foreground">{user.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Last Name</label>
                <p className="text-base sm:text-lg font-semibold text-foreground">{user.lastName}</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary/20 text-foreground border border-secondary">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reusable card styles for Email, Phone, Password, Logout */}
        {[ 
          { icon: Mail, title: "Email Address", value: email, setValue: setEmail, handler: handleEmailUpdate, loading: loading.email, placeholder: "Enter your email address" },
          { icon: Phone, title: "Phone Number", value: phone, setValue: setPhone, handler: handlePhoneUpdate, loading: loading.phone, placeholder: "Enter your phone number" }
        ].map(({ icon: Icon, title, value, setValue, handler, loading, placeholder }, i) => (
          <div key={i} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="bg-accent px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-lg sm:text-xl font-semibold text-black flex items-center">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> {title}
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">{title}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition"
                    placeholder={placeholder}
                  />
                  <Icon className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <button
                onClick={handler}
                disabled={loading}
                className="w-full bg-primary text-black py-3 rounded-lg hover:bg-primary-hover transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Update</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}

        {/* Password */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="bg-secondary px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-black flex items-center">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Change Password
            </h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {[
              { label: 'Current Password', key: 'current', show: showCurrentPassword, setShow: setShowCurrentPassword },
              { label: 'New Password', key: 'newPass', show: showNewPassword, setShow: setShowNewPassword }
            ].map(({ label, key, show, setShow }, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-muted-foreground mb-2">{label}</label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    value={passwords[key]}
                    onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                    className="w-full px-4 py-3 pl-10 pr-10 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition"
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                  >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handlePasswordUpdate}
              disabled={loading.password}
              className="w-full bg-primary text-black py-3 rounded-lg hover:bg-primary-hover transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading.password ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-foreground">Sign Out</h3>
              <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-error hover:opacity-90 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
