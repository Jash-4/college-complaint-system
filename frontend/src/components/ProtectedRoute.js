import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

/**
 * ProtectedRoute Component
 * @param {React.ReactNode} children
 * @param {Array<string>} allowedRoles - Optional allowed roles: ['student', 'admin']
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      } else if (allowedRoles && !allowedRoles.includes(user?.role)) {
        router.push('/dashboard');
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Verifying authorization...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl border border-rose-200 dark:border-rose-900/60 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Restricted</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            You do not have administrative permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
