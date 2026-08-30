import React from 'react';
import Navbar from './Navbar';
import Link from 'next/link';
import { ShieldAlert, Heart } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white">
              <ShieldAlert className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-slate-700">
              CampusResolve — College Complaint Management System
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <span className="text-slate-400">|</span>
            <span>&copy; {new Date().getFullYear()} Campus Administration. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
