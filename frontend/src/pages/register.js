import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Building,
  GraduationCap,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

// Strict institutional .edu email regex
const INSTITUTIONAL_EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu(\.[a-zA-Z]{2,})?$/i;

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Computer Science & Engineering',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Biotechnology & Bioinformatics',
    'Business Administration & Management',
    'Architecture & Design',
    'Applied Sciences & Humanities',
    'General Campus Administration',
  ];

  // Real-time password criteria evaluation
  const passwordCriteria = {
    length: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const isEmailValid = INSTITUTIONAL_EMAIL_REGEX.test(formData.email.trim());

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage('');
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({
      ...formData,
      role: selectedRole,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (!isEmailValid) {
      setErrorMessage('Please enter a valid institutional (.edu) email address.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage(
        'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.'
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const res = await register(formData);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(res.message || 'Registration failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-md py-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm transition-colors duration-200">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3 shadow-inner">
              <UserPlus className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Join the institutional grievance redressal network
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                formData.role === 'student'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                formData.role === 'admin'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Administrator</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs text-rose-800 dark:text-rose-300 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div>
                <p className="font-semibold">Validation Notice</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            </div>

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
                htmlFor="department"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Department / Program
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Building className="h-4 w-4" />
                </div>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Strong Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
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

              {/* Password Requirements Checklist */}
              <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 space-y-1.5 text-[11px]">
                <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password Requirements:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <span
                    className={`flex items-center gap-1.5 ${
                      passwordCriteria.length
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {passwordCriteria.length ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ml-1 mr-1" />
                    )}
                    8+ Characters
                  </span>

                  <span
                    className={`flex items-center gap-1.5 ${
                      passwordCriteria.hasUpper
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {passwordCriteria.hasUpper ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ml-1 mr-1" />
                    )}
                    Uppercase Letter
                  </span>

                  <span
                    className={`flex items-center gap-1.5 ${
                      passwordCriteria.hasLower
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {passwordCriteria.hasLower ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ml-1 mr-1" />
                    )}
                    Lowercase Letter
                  </span>

                  <span
                    className={`flex items-center gap-1.5 ${
                      passwordCriteria.hasNumber
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {passwordCriteria.hasNumber ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ml-1 mr-1" />
                    )}
                    At least 1 Number
                  </span>

                  <span
                    className={`col-span-2 flex items-center gap-1.5 ${
                      passwordCriteria.hasSpecial
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {passwordCriteria.hasSpecial ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ml-1 mr-1" />
                    )}
                    Special Character (!@#$%^&*...)
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !isEmailValid || !isPasswordValid}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Register as {formData.role === 'admin' ? 'Administrator' : 'Student'}</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            Already have an institutional account?{' '}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 underline underline-offset-2"
            >
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
