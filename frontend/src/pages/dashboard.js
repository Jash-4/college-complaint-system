import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import StatusBadge from '../components/StatusBadge';
import MetricCard from '../components/MetricCard';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../services/api';
import {
  PlusCircle,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Trash2,
  ArrowUpRight,
  ShieldCheck,
  Building,
  RefreshCw,
  Loader2,
  Edit,
  X,
  Save,
  Check,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isStudent, isAdmin } = useAuth();
  const router = useRouter();

  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState('');

  // Admin Quick Status Updater Modal State
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [modalForm, setModalForm] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    resolutionDetails: '',
  });
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');

  // Fetch complaints & stats
  const fetchData = useCallback(async () => {
    setLoading(true);
    setActionError('');
    try {
      if (isAdmin) {
        // Admin: fetch all complaints and analytics stats in parallel
        const [complaintsRes, statsRes] = await Promise.all([
          complaintAPI.getAll({
            status: statusFilter || undefined,
            category: categoryFilter || undefined,
            search: searchQuery || undefined,
          }),
          complaintAPI.getStats(),
        ]);
        setComplaints(complaintsRes.complaints || []);
        setStats(statsRes.stats || null);
      } else {
        // Student: fetch student's own complaints
        const res = await complaintAPI.getAll({
          status: statusFilter || undefined,
          category: categoryFilter || undefined,
        });
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setActionError('Failed to load complaints. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, statusFilter, categoryFilter, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle student deleting a 'Submitted' complaint
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to cancel and delete this complaint?')) {
      return;
    }

    setDeletingId(id);
    setActionError('');
    try {
      await complaintAPI.delete(id);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Could not delete complaint.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Open Admin Quick Updater Modal
  const openQuickUpdate = (e, item) => {
    e.stopPropagation();
    setEditingComplaint(item);
    setModalForm({
      status: item.status,
      priority: item.priority,
      assignedTo: item.assignedTo || 'Unassigned',
      resolutionDetails: item.resolutionDetails || '',
    });
    setModalSuccess('');
  };

  // Handle Admin Quick Update Modal Submission
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!editingComplaint) return;
    setUpdatingStatus(true);
    setActionError('');

    try {
      const res = await complaintAPI.updateStatus(editingComplaint._id, modalForm);
      if (res?.complaint) {
        setComplaints((prev) =>
          prev.map((c) => (c._id === res.complaint._id ? res.complaint : c))
        );
        setModalSuccess('Ticket updated successfully!');
        setTimeout(() => {
          setEditingComplaint(null);
          fetchData();
        }, 1000);
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Failed to update ticket status.'
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Student Metrics Calculation
  const studentTotal = complaints.length;
  const studentSubmitted = complaints.filter((c) => c.status === 'Submitted').length;
  const studentInProgress = complaints.filter(
    (c) => c.status === 'In Progress' || c.status === 'Under Review' || c.status === 'Assigned'
  ).length;
  const studentResolved = complaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Closed'
  ).length;

  // Filter complaints client-side for search queries on student side
  const displayedComplaints = complaints.filter((c) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.title?.toLowerCase().includes(query) ||
      c.location?.toLowerCase().includes(query) ||
      c.category?.toLowerCase().includes(query) ||
      c.student?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          {/* Top Banner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {isAdmin ? 'Administrative Overview' : 'My Complaints Portal'}
                </h1>
                <span
                  className={`rounded-lg px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                    isAdmin
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {user?.role}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {isAdmin
                  ? 'Monitor campus incidents, review escalations, and manage resolution timelines.'
                  : `Welcome back, ${user?.name}. Track your filed complaints and progress below.`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                title="Refresh complaints"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              {isStudent && (
                <Link
                  href="/complaints/new"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>+ New Ticket</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-200 hover:bg-purple-700 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Full Admin Console</span>
                </Link>
              )}
            </div>
          </div>

          {/* Action Error Alert */}
          {actionError && (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Metric Cards Row */}
          {isAdmin ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Tickets"
                value={stats?.total ?? complaints.length}
                subtitle="All logged complaints"
                icon={FileText}
                color="indigo"
              />
              <MetricCard
                title="Pending / Active"
                value={stats?.pending ?? 0}
                subtitle="Awaiting resolution"
                icon={Clock}
                color="amber"
              />
              <MetricCard
                title="In Progress / Assigned"
                value={(stats?.byStatus?.['In Progress'] || 0) + (stats?.byStatus?.['Assigned'] || 0)}
                subtitle="Currently being worked on"
                icon={Activity}
                color="sky"
              />
              <MetricCard
                title="Resolved Tickets"
                value={stats?.resolved ?? 0}
                subtitle="Successfully closed"
                icon={CheckCircle2}
                color="emerald"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="My Total Tickets"
                value={studentTotal}
                subtitle="All submitted requests"
                icon={FileText}
                color="indigo"
              />
              <MetricCard
                title="Submitted (New)"
                value={studentSubmitted}
                subtitle="Awaiting review"
                icon={Clock}
                color="amber"
              />
              <MetricCard
                title="Under Active Work"
                value={studentInProgress}
                subtitle="In progress & assigned"
                icon={Activity}
                color="sky"
              />
              <MetricCard
                title="Resolved"
                value={studentResolved}
                subtitle="Closed & resolved"
                icon={CheckCircle2}
                color="emerald"
              />
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, location, category, or student name..."
                  className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-300 py-2 px-3 text-xs font-medium text-slate-700 bg-white focus:border-indigo-600 focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-xl border border-slate-300 py-2 px-3 text-xs font-medium text-slate-700 bg-white focus:border-indigo-600 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="Classroom">Classroom</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Wi-Fi">Wi-Fi</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Labs">Labs</option>
                  <option value="Other">Other</option>
                </select>

                {(statusFilter || categoryFilter || searchQuery) && (
                  <button
                    onClick={() => {
                      setStatusFilter('');
                      setCategoryFilter('');
                      setSearchQuery('');
                    }}
                    className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Complaints List / Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                {isAdmin ? 'Management Table & Complaints Registry' : 'My Complaints'}
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Showing {displayedComplaints.length} tickets
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-xs font-medium">Loading complaints...</p>
              </div>
            ) : displayedComplaints.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No Complaints Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  {searchQuery || statusFilter || categoryFilter
                    ? 'No complaints matched your active filter criteria. Try resetting the filters.'
                    : isStudent
                    ? "You haven't filed any complaints yet. Click the button below to submit a new issue."
                    : 'No complaints logged in the system yet.'}
                </p>
                {isStudent && !searchQuery && !statusFilter && !categoryFilter && (
                  <Link
                    href="/complaints/new"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>+ New Ticket</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {displayedComplaints.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => router.push(`/complaints/${item._id}`)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50/80 transition-colors cursor-pointer gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={item.status} size="sm" />
                        <StatusBadge priority={item.priority} size="sm" />
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {item.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <Building className="h-3.5 w-3.5 text-slate-400" />
                          {item.location}
                        </span>
                        <span>•</span>
                        <span>
                          Created {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        {isAdmin && item.student && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-600 font-medium">
                              By: {item.student.name} ({item.student.department || 'Student'})
                            </span>
                          </>
                        )}
                        {item.assignedTo && item.assignedTo !== 'Unassigned' && (
                          <>
                            <span>•</span>
                            <span className="text-purple-700 font-medium">
                              Assigned to: {item.assignedTo}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {isStudent && item.status === 'Submitted' && (
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item._id)}
                          disabled={deletingId === item._id}
                          className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors disabled:opacity-50"
                          title="Cancel/Delete ticket (Allowed while status is Submitted)"
                        >
                          {deletingId === item._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          <span>Cancel</span>
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => openQuickUpdate(e, item)}
                          className="flex items-center gap-1 rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
                          title="Quick update status & assignment"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Update</span>
                        </button>
                      )}

                      <span className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 group-hover:border-indigo-300 group-hover:text-indigo-600 shadow-sm transition-colors">
                        <span>Details</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin Status Updater Modal */}
          {editingComplaint && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
              <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Quick Status & Assignment Updater
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate max-w-sm">
                      {editingComplaint.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingComplaint(null)}
                    className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {modalSuccess && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 animate-fade-in">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{modalSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleModalSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Status
                      </label>
                      <select
                        value={modalForm.status}
                        onChange={(e) =>
                          setModalForm({ ...modalForm, status: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-semibold text-slate-900 bg-white focus:border-purple-600 focus:outline-none"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Priority
                      </label>
                      <select
                        value={modalForm.priority}
                        onChange={(e) =>
                          setModalForm({ ...modalForm, priority: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-semibold text-slate-900 bg-white focus:border-purple-600 focus:outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Assigned Personnel / Staff
                    </label>
                    <input
                      type="text"
                      value={modalForm.assignedTo}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, assignedTo: e.target.value })
                      }
                      placeholder="e.g. Facilities Lead - John"
                      className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Resolution Details
                    </label>
                    <textarea
                      rows={3}
                      value={modalForm.resolutionDetails}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          resolutionDetails: e.target.value,
                        })
                      }
                      placeholder="Update resolution progress or closing remarks..."
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingComplaint(null)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updatingStatus}
                      className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-purple-700 disabled:opacity-50"
                    >
                      {updatingStatus ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
