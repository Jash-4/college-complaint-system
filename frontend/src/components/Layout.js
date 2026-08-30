import React from 'react';
import Navbar from './Navbar';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white">
              <ShieldAlert className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              CampusResolve — College Complaint Management System
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Dashboard
            </Link>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <span>&copy; {new Date().getFullYear()} Campus Administration. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
