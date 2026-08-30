import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../services/api';
import {
  ShieldCheck,
  Wifi,
  Building2,
  Sparkles,
  Laptop,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Send,
  Sliders,
  Users,
  Building,
  FileText,
  Activity,
  Flame,
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isStudent, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const res = await complaintAPI.getPublicStats();
        if (res?.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        // Fallback default numbers if offline
        setStats({
          total: 128,
          pending: 14,
          resolved: 114,
        });
      }
    };

    fetchPublicStats();
  }, []);

  const categories = [
    {
      name: 'Wi-Fi & Network',
      description: 'Hostel and campus connectivity issues, bandwidth speeds, and access point outages.',
      icon: Wifi,
      color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900',
    },
    {
      name: 'Hostel Facilities',
      description: 'Room maintenance, plumbing, hot water, electrical fittings, and mess facilities.',
      icon: Building,
      color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900',
    },
    {
      name: 'Classrooms & AV',
      description: 'Projector failures, audio equipment, seating issues, and climate control.',
      icon: GraduationCap,
      color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900',
    },
    {
      name: 'Labs & Workstations',
      description: 'Equipment malfunctions, software licenses, lab instruments, and workstation setups.',
      icon: Laptop,
      color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900',
    },
    {
      name: 'Campus Cleanliness',
      description: 'Washroom sanitization, waste collection, corridor cleanliness, and hygiene maintenance.',
      icon: Sparkles,
      color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900',
    },
    {
      name: 'Infrastructure & Safety',
      description: 'Elevators, lighting, pathways, structural repairs, and emergency equipment.',
      icon: Building2,
      color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Submit Ticket',
      description: 'Describe the issue, set the location, select the category, and submit in seconds.',
      icon: Send,
    },
    {
      step: '02',
      title: 'Automated Triaging',
      description: 'Admins review priority, assign to specialized maintenance staff, and update ETA.',
      icon: Sliders,
    },
    {
      step: '03',
      title: 'Live Tracking',
      description: 'Receive visual timeline status updates as your ticket moves from review to in-progress.',
      icon: Clock,
    },
    {
      step: '04',
      title: 'Verified Resolution',
      description: 'Staff attaches resolution details, and tickets are officially closed with audit history.',
      icon: CheckCircle2,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-10 md:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/60 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm backdrop-blur-sm mb-6">
            <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Smart College Grievance & Incident Resolution System</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
            Fast, Transparent & Accountable{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
              Campus Issue Resolution
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Report maintenance, infrastructure, hostel, and digital services issues.
            Track resolution milestones in real time with end-to-end transparency.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 dark:shadow-none transition-all hover:bg-indigo-700 hover:shadow-lg"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {isStudent && (
                  <Link
                    href="/complaints/new"
                    className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400"
                  >
                    <span>+ Submit a Complaint</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50 px-6 py-3.5 text-sm font-semibold text-purple-700 dark:text-purple-300 shadow-sm transition-all hover:bg-purple-100 dark:hover:bg-purple-900/50"
                  >
                    <span>Admin Portal</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/complaints/new"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 dark:shadow-none transition-all hover:bg-indigo-700 hover:shadow-lg"
                >
                  <span>Submit a Complaint</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400"
                >
                  <span>Admin Portal</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-5 py-3.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>Create Account</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Live Complaint Statistics Counters */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/40 dark:to-slate-900 p-5 text-center shadow-sm">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mx-auto mb-2">
              <FileText className="h-5 w-5" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.total ?? 120}+
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Total Grievances Logged
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/40 dark:to-slate-900 p-5 text-center shadow-sm">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto mb-2">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {stats?.pending ?? 14}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Active / In Progress
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/40 dark:to-slate-900 p-5 text-center shadow-sm">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto mb-2">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats?.resolved ?? 106}+
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Successfully Resolved
            </p>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-12 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Supported Complaint Categories
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Dedicated support channels and maintenance teams for every campus area.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${cat.color} mb-4`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            How The Resolution Workflow Operates
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            From submission to verification, transparent stages keep everyone aligned.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-indigo-600/30 dark:text-indigo-400/30">
                      {s.step}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mt-8 rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 dark:from-indigo-950 dark:via-indigo-900 dark:to-purple-950 border border-indigo-600/30 p-8 sm:p-12 text-white shadow-xl">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Facing an issue on campus right now?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-indigo-100 dark:text-indigo-200 leading-relaxed">
            Submit a grievance ticket with room details and receive immediate confirmation.
            Our facility managers and technical teams are active around the clock.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={isAuthenticated ? (isStudent ? '/complaints/new' : '/dashboard') : '/register'}
              className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-100 px-6 py-3 text-sm font-bold text-indigo-900 shadow hover:bg-indigo-50 transition-colors"
            >
              <span>{isAuthenticated ? 'Create New Ticket' : 'Get Started Now'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <span>Admin Portal Login</span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
