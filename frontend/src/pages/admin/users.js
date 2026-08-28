/**
 * admin/users.js — Admin-only user management portal.
 */

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { UsersRound, ShieldCheck, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import useAuthStore from '@/store/authStore';
import api from '@/lib/axios';

export default function AdminUsersPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateUser = async (id, updates) => {
    try {
      await api.put(`/users/${id}`, updates);
      await loadUsers();
    } catch (err) {
      setError(err.message || 'Unable to update user');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <ShieldCheck size={26} style={{ margin: '0 auto 1rem', color: '#34d399' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Admin access required</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>User Management — ComplaintMS</title>
      </Head>
      <DashboardLayout>
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <UsersRound size={20} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>User Management</h1>
          </div>

          {error && <div className="alert-error">{error}</div>}

          <div className="glass-card" style={{ padding: '1rem' }}>
            {loading ? (
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton" style={{ height: 52, borderRadius: 12 }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {users.map((member) => (
                  <div key={member._id} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1.4fr) minmax(120px, 0.9fr) minmax(150px, 1fr)', gap: '1rem', alignItems: 'center', padding: '0.7rem 0.8rem', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{member.email}</div>
                    </div>

                    <div>
                      <span className="badge" style={{ background: member.role === 'admin' ? 'rgba(16,185,129,0.14)' : member.role === 'staff' ? 'rgba(245,158,11,0.14)' : 'rgba(99,102,241,0.14)', color: member.role === 'admin' ? '#34d399' : member.role === 'staff' ? '#fbbf24' : '#a5b4fc', border: '1px solid rgba(255,255,255,0.12)' }}>
                        {member.role}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className="btn-secondary" onClick={() => updateUser(member._id, { role: member.role === 'admin' ? 'student' : 'admin' })}>
                        Toggle Admin
                      </button>
                      <button className="btn-secondary" onClick={() => updateUser(member._id, { role: member.role === 'staff' ? 'student' : 'staff', department: member.role === 'staff' ? null : 'Maintenance' })}>
                        {member.role === 'staff' ? 'Demote' : 'Promote Staff'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
