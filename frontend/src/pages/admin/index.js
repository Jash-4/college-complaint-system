import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import StatusBadge from '../../components/StatusBadge';
import MetricCard from '../../components/MetricCard';
import { complaintAPI } from '../../services/api';
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  FileText,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  Edit,
  X,
  Save,
  Loader2,
  Building,
  User,
  Wrench,
  ChevronRight,
  Check,
} from 'lucide-react';

export default function AdminConsolePage() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Quick Edit Modal State
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [modalForm, setModalForm] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    resolutionDetails: '',
  });
  const [updating, setUpdating] = useState(false);
  const [modalFeedback, setModalFeedback] = useState({ type: '', text: '' });

  // Fetch all complaints and statistics
  const loadAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [complaintsRes, statsRes] = await Promise.all([
        complaintAPI.getAll({
          status: statusFilter || undefined,
          category: categoryFilter || undefined,
          priority: priorityFilter || undefined,
          search: searchQuery || undefined,
        }),
        complaintAPI.getStats(),
      ]);

      setComplaints(complaintsRes.complaints || []);
      setStats(statsRes.stats || null);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, priorityFilter, searchQuery]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Open Quick Edit Modal
  const openEditModal = (complaint) => {
    setEditingComplaint(complaint);
    setModalForm({
      status: complaint.status,
      priority: complaint.priority,
      assignedTo: complaint.assignedTo || 'Unassigned',
      resolutionDetails: complaint.resolutionDetails || '',
    });
    setModalFeedback({ type: '', text: '' });
  };

  // Close Quick Edit Modal
  const closeEditModal = () => {
    setEditingComplaint(null);
    setModalFeedback({ type: '', text: '' });
  };

  // Submit Modal Updates
  const handleModalSave = async (e) => {
    e.preventDefault();
    if (!editingComplaint) return;
    setUpdating(true);
    setModalFeedback({ type: '', text: '' });

    try {
      const res = await complaintAPI.updateStatus(editingComplaint._id, modalForm);
      if (res?.complaint) {
        // Update local state list
        setComplaints((prev) =>
          prev.map((c) => (c._id === res.complaint._id ? res.complaint : c))
        );
        setModalFeedback({ type: 'success', text: 'Ticket successfully updated!' });
        setTimeout(() => {
          closeEditModal();
          loadAdminData();
        }, 1200);
      }
    } catch (err) {
      setModalFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update ticket.',
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 shadow-inner">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Admin Management Console
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Campus-wide incident triage, maintenance dispatch, and resolution audit.
                </p>
              </div>
            </div>

            <button
              onClick={loadAdminData}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Records</span>
            </button>
          </div>

          {/* Analytics Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Logged Incidents"
              value={stats?.total ?? complaints.length}
              subtitle="Comprehensive tally"
              icon={FileText}
              color="indigo"
            />
            <MetricCard
              title="Active / Pending Review"
              value={stats?.pending ?? 0}
              subtitle="Awaiting resolution"
              icon={Clock}
              color="amber"
            />
            <MetricCard
              title="In Progress / Assigned"
              value={
                (stats?.byStatus?.['In Progress'] || 0) +
                (stats?.byStatus?.['Assigned'] || 0)
              }
              subtitle="Dispatched to teams"
              icon={Activity}
              color="sky"
            />
            <MetricCard
              title="Resolved & Verified"
              value={stats?.resolved ?? 0}
              subtitle="Successfully addressed"
              icon={CheckCircle2}
              color="emerald"
            />
          </div>

          {/* Category Breakdown Badges */}
          {stats?.byCategory && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Volume by Campus Category
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {Object.entries(stats.byCategory).map(([category, count]) => (
                  <button
                    key={category}
                    onClick={() =>
                      setCategoryFilter(categoryFilter === category ? '' : category)
                    }
                    className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors border ${
                      categoryFilter === category
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{category}</span>
                    <span
                      className={`rounded-md px-1.5 py-0.2 text-[10px] font-bold ${
                        categoryFilter === category
                          ? 'bg-purple-800 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search & Filter Toolbar */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search incidents by keyword, student, location, or assigned staff..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 py-2 pl-10 pr-4 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-950 focus:border-purple-600 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-950 focus:border-purple-600 focus:outline-none"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>

              {/* Reset Filters */}
              {(statusFilter || categoryFilter || priorityFilter || searchQuery) && (
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setCategoryFilter('');
                    setPriorityFilter('');
                    setSearchQuery('');
                  }}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Master Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Active Campus Incidents Table
              </h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {complaints.length} Records Found
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
                <p className="text-xs font-medium">Loading complaints ledger...</p>
              </div>
            ) : complaints.length === 0 ? (
              <div className="py-16 text-center text-slate-500 dark:text-slate-400">
                <FileText className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">No complaints matching filters</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try relaxing search terms or filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Ticket & Category</th>
                      <th className="px-6 py-3.5">Location</th>
                      <th className="px-6 py-3.5">Student Submitter</th>
                      <th className="px-6 py-3.5">Priority</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Assigned To</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {complaints.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors"
                      >
                        {/* Title & Category */}
                        <td className="px-6 py-4 max-w-xs">
                          <Link
                            href={`/complaints/${item._id}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors block truncate"
                          >
                            {item.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            {item.category} • {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                            {item.location}
                          </span>
                        </td>

                        {/* Submitter */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {item.student?.name || 'Student'}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500">
                            {item.student?.department || item.student?.email}
                          </div>
                        </td>

                        {/* Priority */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge priority={item.priority} size="sm" />
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={item.status} size="sm" />
                        </td>

                        {/* Assigned To */}
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                          {item.assignedTo && item.assignedTo !== 'Unassigned' ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              <Wrench className="h-3 w-3" />
                              {item.assignedTo}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 italic">Unassigned</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="flex items-center gap-1 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors shadow-sm"
                              title="Quick Update / Assign"
                            >
                              <Edit className="h-3 w-3" />
                              <span>Update</span>
                            </button>

                            <Link
                              href={`/complaints/${item._id}`}
                              className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                              title="Full Details"
                            >
                              <span>View</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Edit Modal */}
          {editingComplaint && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
              <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Quick Triage & Status Update
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-md">
                      {editingComplaint.title}
                    </p>
                  </div>
                  <button
                    onClick={closeEditModal}
                    className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {modalFeedback.text && (
                  <div
                    className={`mb-4 flex items-center gap-2 rounded-xl p-3 text-xs font-medium animate-fade-in ${
                      modalFeedback.type === 'success'
                        ? 'border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                        : 'border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    {modalFeedback.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    )}
                    <span>{modalFeedback.text}</span>
                  </div>
                )}

                <form onSubmit={handleModalSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Status */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        Status Transition
                      </label>
                      <select
                        value={modalForm.status}
                        onChange={(e) =>
                          setModalForm({ ...modalForm, status: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-950 focus:border-purple-600 focus:outline-none"
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
                        Priority
                      </label>
                      <select
                        value={modalForm.priority}
                        onChange={(e) =>
                          setModalForm({ ...modalForm, priority: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-950 focus:border-purple-600 focus:outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  {/* Assignee */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Assign Maintenance Personnel / Team
                    </label>
                    <input
                      type="text"
                      value={modalForm.assignedTo}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, assignedTo: e.target.value })
                      }
                      placeholder="e.g. Electrical Staff - Room 102"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 px-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-950 focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  {/* Resolution Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Resolution Notes / Progress Update
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
                      placeholder="Enter resolution notes, parts ordered, or fix completion summary..."
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-purple-700 disabled:opacity-50"
                    >
                      {updating ? (
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
