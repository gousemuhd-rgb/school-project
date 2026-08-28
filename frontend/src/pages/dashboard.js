/**
 * dashboard.js — Role-aware dashboard shell for all complaint users.
 */

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AlertCircle, ArrowRight, CheckCircle2, ClipboardList, Loader2, MessageSquareText, PlusCircle, UserCog } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, UrgencyBadge } from '@/components/StatusBadge';
import { SkeletonCard } from '@/components/SkeletonLoader';
import useAuthStore from '@/store/authStore';
import api from '@/lib/axios';

const statusColors = {
  PENDING: 'var(--status-pending)',
  IN_PROGRESS: 'var(--status-inprogress)',
  RESOLVED: 'var(--status-resolved)',
  REJECTED: 'var(--status-rejected)',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    const fetchComplaints = async () => {
      try {
        const { data } = await api.get('/complaints');
        setComplaints(data.complaints || []);
      } catch (err) {
        setError(err.message || 'Unable to load complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [isAuthenticated, user, router]);

  if (!user) return null;

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'PENDING').length,
    inProgress: complaints.filter((c) => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter((c) => c.status === 'RESOLVED').length,
  };

  const headerTitle =
    user.role === 'admin'
      ? 'College Overview'
      : user.role === 'staff'
        ? 'Department Queue'
        : 'My Complaints';

  return (
    <>
      <Head>
        <title>Dashboard — ComplaintMS</title>
      </Head>
      <DashboardLayout>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div className="badge" style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.35)', marginBottom: '0.5rem' }}>
                {user.role.toUpperCase()} PORTAL
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{headerTitle}</h1>
            </div>

            {user.role === 'student' && (
              <Link href="/complaints/new">
                <button className="btn-primary">
                  <PlusCircle size={16} /> New Complaint
                </button>
              </Link>
            )}
          </div>

          {error && <div className="alert-error">{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <StatCard label="Total" value={stats.total} icon={<ClipboardList size={18} />} color="#6366f1" />
            <StatCard label="Pending" value={stats.pending} icon={<AlertCircle size={18} />} color="#ef4444" />
            <StatCard label="In Progress" value={stats.inProgress} icon={<Loader2 size={18} />} color="#f59e0b" />
            <StatCard label="Resolved" value={stats.resolved} icon={<CheckCircle2 size={18} />} color="#10b981" />
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Complaints</h2>
              {user.role === 'admin' && <span className="badge" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>System-wide visibility</span>}
            </div>

            {loading ? (
              <div style={{ display: 'grid', gap: '0.9rem' }}>
                {[1, 2, 3].map((item) => <SkeletonCard key={item} />)}
              </div>
            ) : complaints.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No complaints found for your role yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {complaints.map((complaint) => (
                  <Link key={complaint._id} href={`/complaints/${complaint._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="glass-card" style={{ padding: '1rem 1.1rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(140px, 0.9fr) minmax(120px, 0.7fr)', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', overflowWrap: 'anywhere' }}>{complaint.title}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>#{complaint._id.slice(-6)}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}>
                          {complaint.category} • {complaint.createdBy?.name || 'Unknown'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <StatusBadge status={complaint.status} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                        <UrgencyBadge urgency={complaint.urgency} />
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="glass-card" style={{ padding: '1.2rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
      </div>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}22`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}40` }}>
        {icon}
      </div>
    </div>
  );
}
