/**
 * complaints/[id].js — Detailed complaint view with status and comments.
 */

import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Loader2, MessageSquareText, Send } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import useAuthStore from '@/store/authStore';
import api from '@/lib/axios';

const statusOptions = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

export default function ComplaintDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuthStore();
  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const fetchComplaint = async () => {
    if (!id) return;

    try {
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data.complaint);
      setComments(data.comments || []);
    } catch (err) {
      setError(err.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleStatusChange = async (e) => {
    const nextStatus = e.target.value;
    if (!complaint || !nextStatus || nextStatus === complaint.status) return;

    setStatusLoading(true);
    try {
      const { data } = await api.put(`/complaints/${complaint._id}/status`, { status: nextStatus });
      setComplaint((prev) => ({ ...prev, status: data.complaint.status }));
    } catch (err) {
      setError(err.message || 'Unable to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const { data } = await api.post(`/complaints/${id}/comments`, { message: comment });
      setComments((prev) => [...prev, data.comment]);
      setComment('');
    } catch (err) {
      setError(err.message || 'Unable to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="skeleton" style={{ height: 36, width: '30%' }} />
          <div className="skeleton" style={{ height: 220, borderRadius: 16 }} />
        </div>
      </DashboardLayout>
    );
  }

  if (!complaint) {
    return (
      <DashboardLayout>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Complaint not found</h2>
        </div>
      </DashboardLayout>
    );
  }

  const canUpdateStatus = user && (user.role === 'staff' || user.role === 'admin');

  return (
    <>
      <Head>
        <title>{complaint.title} — ComplaintMS</title>
      </Head>
      <DashboardLayout>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gap: '1.25rem' }}>
          <div>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Back to dashboard
            </Link>
          </div>

          {error && <div className="alert-error">{error}</div>}

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{complaint.title}</h1>
                  <StatusBadge status={complaint.status} />
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Submitted by {complaint.createdBy?.name || 'Unknown'} • {new Date(complaint.createdAt).toLocaleString()}
                </div>
              </div>

              {canUpdateStatus ? (
                <div style={{ minWidth: 180 }}>
                  <label className="form-label" htmlFor="status-select">Update status</label>
                  <select id="status-select" className="form-input" value={complaint.status} onChange={handleStatusChange} disabled={statusLoading}>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
              <MetaItem label="Category" value={complaint.category} />
              <MetaItem label="Urgency" value={<UrgencyBadge urgency={complaint.urgency} />} />
              <MetaItem label="Assigned" value={complaint.assignedTo?.name || 'Unassigned'} />
              <MetaItem label="Department" value={complaint.department || 'N/A'} />
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem', color: 'var(--text-primary)' }}>Description</h2>
            <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{complaint.description}</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Comments</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.25rem' }}>
              {comments.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)' }}>No comments yet.</div>
              ) : (
                comments.map((item) => (
                  <div key={item._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 12, padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{item.userId?.name || 'User'}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', margin: 0 }}>{item.message}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleCommentSubmit}>
              <label className="form-label" htmlFor="comment-input">Add a comment</label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <textarea id="comment-input" className="form-input" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a message..." style={{ flex: 1, minWidth: 220 }} />
                <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: 'flex-end' }}>
                  {submitting ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Posting...</> : <><MessageSquareText size={18} /> Post</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

function MetaItem({ label, value }) {
  return (
    <div className="glass-card" style={{ padding: '0.8rem 1rem' }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{label}</div>
      <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{value}</div>
    </div>
  );
}
