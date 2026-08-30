import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { complaintAPI } from '../../services/api';
import {
  PlusCircle,
  ArrowLeft,
  Send,
  AlertCircle,
  Loader2,
  Building,
  Tag,
  MapPin,
  Flame,
  FileText,
  CheckCircle,
} from 'lucide-react';

export default function NewComplaintPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Wi-Fi',
    location: '',
    priority: 'Medium',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    { value: 'Classroom', label: 'Classroom & Audio/Visual' },
    { value: 'Hostel', label: 'Hostel & Living Quarters' },
    { value: 'Wi-Fi', label: 'Wi-Fi & Campus Network' },
    { value: 'Infrastructure', label: 'Infrastructure & Building Repairs' },
    { value: 'Cleanliness', label: 'Cleanliness & Sanitization' },
    { value: 'Labs', label: 'Labs & Department Instruments' },
    { value: 'Other', label: 'Other Campus Grievance' },
  ];

  const priorities = [
    {
      value: 'Low',
      label: 'Low',
      desc: 'Minor issue or suggestion, normal priority',
      color: 'border-slate-300 dark:border-slate-700 hover:border-slate-400 peer-checked:border-slate-600 dark:peer-checked:border-slate-400 peer-checked:bg-slate-50 dark:peer-checked:bg-slate-800/60',
    },
    {
      value: 'Medium',
      label: 'Medium',
      desc: 'Standard maintenance problem requiring attention',
      color: 'border-blue-200 dark:border-blue-800 hover:border-blue-300 peer-checked:border-blue-600 dark:peer-checked:border-blue-400 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-950/40',
    },
    {
      value: 'High',
      label: 'High',
      desc: 'Disrupts study, academic activities, or living conditions',
      color: 'border-amber-200 dark:border-amber-800 hover:border-amber-300 peer-checked:border-amber-600 dark:peer-checked:border-amber-400 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-950/40',
    },
    {
      value: 'Critical',
      label: 'Critical',
      desc: 'Safety hazard, major outage, or emergency issue',
      color: 'border-rose-200 dark:border-rose-800 hover:border-rose-300 peer-checked:border-rose-600 dark:peer-checked:border-rose-400 peer-checked:bg-rose-50 dark:peer-checked:bg-rose-950/40',
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      setErrorMessage('Please fill in all required fields (Title, Location, Description)');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const data = await complaintAPI.create(formData);
      if (data?.complaint?._id) {
        router.push(`/complaints/${data.complaint._id}`);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit complaint. Please check your inputs.'
      );
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <Layout>
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Breadcrumb & Top Bar */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Submit Grievance Ticket
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Provide thorough details to assist maintenance engineers and facility teams in swift resolution.
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-4 text-xs text-rose-800 dark:text-rose-300 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div>
                <p className="font-semibold">Submission Error</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-5 transition-colors duration-200">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Complaint Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    maxLength={150}
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Wi-Fi router offline in Hostel Block B 3rd Floor"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1 text-right">
                    {formData.title.length}/150
                  </span>
                </div>

                {/* Category & Location Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 py-2.5 px-3 text-sm text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      >
                        {categories.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Exact Location <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="location"
                        name="location"
                        type="text"
                        required
                        maxLength={200}
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Block C, Room 204"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Priority Selection Cards */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Priority Level <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {priorities.map((p) => (
                      <label
                        key={p.value}
                        className={`relative flex cursor-pointer rounded-2xl border p-3.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500 ${p.color}`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={p.value}
                          checked={formData.priority === p.value}
                          onChange={handleChange}
                          className="peer sr-only"
                        />
                        <div className="flex flex-col justify-between w-full">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {p.label}
                            </span>
                            <StatusBadge priority={p.value} size="sm" />
                          </div>
                          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                            {p.desc}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Detailed Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                    maxLength={2000}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the issue in detail (when did it start, frequency, equipment affected, etc.)..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1 text-right">
                    {formData.description.length}/2000
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-semibold text-white shadow-md shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Grievance Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Live Preview Section */}
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors duration-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                  Live Ticket Preview
                </h3>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status="Submitted" size="sm" />
                    <StatusBadge priority={formData.priority} size="sm" />
                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      {formData.category}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug break-words">
                    {formData.title || 'Untitled Complaint'}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {formData.location || 'Location not specified'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3 break-words">
                    {formData.description ||
                      'Issue description details will be displayed here in full once you start typing.'}
                  </p>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
                    <span>Filed by: {user?.name || 'Student'}</span>
                    <span>Status: Submitted</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/40 p-5 text-xs text-indigo-900 dark:text-indigo-200">
                <p className="font-bold flex items-center gap-1.5 mb-1 text-indigo-700 dark:text-indigo-300">
                  <CheckCircle className="h-4 w-4" />
                  What happens next?
                </p>
                <p className="text-indigo-800 dark:text-indigo-200/80 leading-relaxed">
                  Your ticket will immediately enter the administrative queue with status <strong>Submitted</strong>. You can track progress or cancel the ticket from your dashboard until review begins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
