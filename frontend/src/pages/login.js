import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  GraduationCap,
  XCircle,
} from 'lucide-react';

// Strict institutional .edu email regex
const INSTITUTIONAL_EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu(\.[a-zA-Z]{2,})?$/i;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const isEmailValid = INSTITUTIONAL_EMAIL_REGEX.test(formData.email.trim());

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = router.query.redirect || '/dashboard';
      router.push(redirect);
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);

    if (!formData.email || !formData.password) {
      setErrorMessage('Please fill in both email and password');
      return;
    }

    if (!isEmailValid) {
      setErrorMessage('Please enter a valid institutional (.edu) email address.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const res = await login(formData.email, formData.password);

    if (res.success) {
      const redirect = router.query.redirect || '/dashboard';
      router.push(redirect);
    } else {
      setErrorMessage(res.message || 'Login failed. Please try again.');
      setSubmitting(false);
    }
  };

  // Quick fill demo helper
  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@college.edu',
        password: 'Password123!',
      });
    } else {
      setFormData({
        email: 'student@college.edu',
        password: 'Password123!',
      });
    }
    setErrorMessage('');
    setEmailTouched(false);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-md py-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm transition-colors duration-200">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3 shadow-inner">
              <LogIn className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sign in to manage and track college grievance tickets
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs text-rose-800 dark:text-rose-300 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Error</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Institutional Email Address (.edu)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onBlur={() => setEmailTouched(true)}
                  onChange={handleChange}
                  placeholder="student@college.edu"
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 ${
                    emailTouched && formData.email && !isEmailValid
                      ? 'border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600/20'
                  }`}
                />
              </div>
              {emailTouched && formData.email && !isEmailValid && (
                <p className="mt-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Please enter a valid institutional (.edu) email address.</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 py-2.5 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 disabled:opacity-60 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Credentials Helpers */}
          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
            <p className="text-center text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              Quick Test Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <GraduationCap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Student Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 underline underline-offset-2"
            >
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
