import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { complaintAPI } from '../../services/api';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Tag,
  User,
  Building,
  Mail,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ShieldCheck,
  Edit3,
  Loader2,
  Save,
  MessageSquare,
  Wrench,
  Flame,
  Check,
} from 'lucide-react';

export default function ComplaintDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAdmin, isStudent } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Admin update form state
  const [adminForm, setAdminForm] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    resolutionDetails: '',
  });
  const [savingStatus, setSavingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const statusTimelineSteps = [
    { key: 'Submitted', label: 'Submitted' },
    { key: 'Under Review', label: 'Under Review' },
    { key: 'Assigned', label: 'Assigned' },
    { key: 'In Progress', label: 'In Progress' },
    { key: 'Resolved', label: 'Resolved' },
    { key: 'Closed', label: 'Closed' },
  ];

  const fetchComplaint = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await complaintAPI.getById(id);
      if (data?.complaint) {
        setComplaint(data.complaint);
        setAdminForm({
          status: data.complaint.status,
          priority: data.complaint.priority,
          assignedTo: data.complaint.assignedTo || 'Unassigned',
          resolutionDetails: data.complaint.resolutionDetails || '',
        });
      }
    } catch (err) {
      console.error('Error fetching complaint:', err);
      setError(
        err.response?.data?.message || 'Complaint not found or you are not authorized to view it.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  // Admin update handler
  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setSavingStatus(true);
    setError('');
    setSuccessMessage('');

    try {
      const updated = await complaintAPI.updateStatus(id, adminForm);
      if (updated?.complaint) {
        setComplaint(updated.complaint);
        setSuccessMessage('Complaint status and details updated successfully!');
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update complaint status.'
      );
    } finally {
      setSavingStatus(false);
    }
  };

  // Student delete handler
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to cancel and delete this complaint? This cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError('');
    try {
      await complaintAPI.delete(id);
      router.push('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not delete complaint.'
      );
      setDeleting(false);
    }
  };

  // Helper to determine step status in timeline
  const getCurrentStepIndex = () => {
    if (!complaint) return 0;
    const index = statusTimelineSteps.findIndex((s) => s.key === complaint.status);
    return index !== -1 ? index : 0;
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Management Console</span>
              </Link>
            )}
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-4 text-xs text-rose-800 dark:text-rose-300 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div>
                <p className="font-semibold">Notice</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs text-emerald-800 dark:text-emerald-300 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="font-semibold">Success</p>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="text-xs font-medium">Loading ticket details...</p>
            </div>
          ) : !complaint ? (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
              <AlertCircle className="h-10 w-10 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Complaint Not Found</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                The requested ticket could not be located or you may not have authorization.
              </p>
              <Link
                href="/dashboard"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700"
              >
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={complaint.status} size="md" />
                      <StatusBadge priority={complaint.priority} size="md" />
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {complaint.category}
                      </span>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                      {complaint.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        {complaint.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        Submitted{' '}
                        {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {complaint.updatedAt !== complaint.createdAt && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                            Updated{' '}
                            {new Date(complaint.updatedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Student Cancel Button */}
                  {isStudent && complaint.status === 'Submitted' && (
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-4 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 disabled:opacity-50 transition-colors shrink-0"
                    >
                      {deleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span>Cancel & Delete Ticket</span>
                    </button>
                  )}
                </div>

                {/* Visual Status Progress Timeline */}
                <div className="py-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">
                    Resolution Milestone Timeline
                  </h3>

                  <div className="relative">
                    {/* Background line */}
                    <div className="absolute top-4 left-4 right-4 h-1 bg-slate-100 dark:bg-slate-800 -z-0 hidden md:block" />

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      {statusTimelineSteps.map((step, idx) => {
                        const currentIdx = getCurrentStepIndex();
                        const isCompleted = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div
                            key={step.key}
                            className="flex md:flex-col items-center gap-3 md:gap-2 relative z-10"
                          >
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all shadow-sm ${
                                isCurrent
                                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950 scale-110'
                                  : isCompleted
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              {isCompleted && !isCurrent ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <div className="text-left md:text-center">
                              <p
                                className={`text-xs font-semibold ${
                                  isCurrent
                                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                                    : isCompleted
                                    ? 'text-slate-800 dark:text-slate-200'
                                    : 'text-slate-400 dark:text-slate-500'
                                }`}
                              >
                                {step.label}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Submitter & Assignment Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                      Submitted By Student
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {complaint.student?.name || 'Student'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {complaint.student?.email} • {complaint.student?.department || 'Department N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                      Assigned Personnel / Team
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                        <Wrench className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {complaint.assignedTo || 'Unassigned'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {complaint.assignedTo !== 'Unassigned'
                            ? 'Specialized maintenance handler assigned'
                            : 'Awaiting administrator dispatch'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Body */}
                <div className="pt-6 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Incident Description
                  </h3>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 p-5 border border-slate-200/80 dark:border-slate-800">
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {complaint.description}
                    </p>
                  </div>
                </div>

                {/* Resolution Details (if provided) */}
                {complaint.resolutionDetails && (
                  <div className="pt-6 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      Resolution & Action Notes
                    </h3>
                    <div className="rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 p-5 border border-emerald-200 dark:border-emerald-900/60">
                      <p className="text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed whitespace-pre-wrap">
                        {complaint.resolutionDetails}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Management Panel */}
              {isAdmin && (
                <div className="rounded-3xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm transition-colors duration-200">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Admin Action & Resolution Console
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Update status milestones, dispatch maintenance staff, and publish resolution notes.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleAdminUpdate} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Status */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                          Status Transition
                        </label>
                        <select
                          value={adminForm.status}
                          onChange={(e) =>
                            setAdminForm({ ...adminForm, status: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-950 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                          Priority Rating
                        </label>
                        <select
                          value={adminForm.priority}
                          onChange={(e) =>
                            setAdminForm({ ...adminForm, priority: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-950 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                        >
                          <option value="Low">Low Priority</option>
                          <option value="Medium">Medium Priority</option>
                          <option value="High">High Priority</option>
                          <option value="Critical">Critical Priority</option>
                        </select>
                      </div>

                      {/* Assigned Staff */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                          Assign Personnel / Team
                        </label>
                        <input
                          type="text"
                          value={adminForm.assignedTo}
                          onChange={(e) =>
                            setAdminForm({ ...adminForm, assignedTo: e.target.value })
                          }
                          placeholder="e.g. IT Team - Alex"
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 py-2.5 px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                        />
                      </div>
                    </div>

                    {/* Resolution Details */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        Resolution Notes / Action Taken
                      </label>
                      <textarea
                        rows={4}
                        value={adminForm.resolutionDetails}
                        onChange={(e) =>
                          setAdminForm({
                            ...adminForm,
                            resolutionDetails: e.target.value,
                          })
                        }
                        placeholder="Provide details about actions taken, parts replaced, or completion notes..."
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={savingStatus}
                        className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-200 dark:shadow-none hover:bg-purple-700 disabled:opacity-50 transition-colors"
                      >
                        {savingStatus ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Updating Ticket...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Save Administrative Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
