/**
 * complaints/new.js — Student complaint submission form.
 */

import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Loader2, Send, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import useAuthStore from '@/store/authStore';
import api from '@/lib/axios';

const categories = ['Maintenance', 'IT', 'Academic', 'Hostel', 'Administration', 'Library', 'Sports'];
const urgencies = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export default function NewComplaintPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [form, setForm] = useState({ title: '', category: 'Maintenance', description: '', urgency: 'medium' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.role !== 'student') {
    return (
      <DashboardLayout>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <ShieldAlert size={26} style={{ margin: '0 auto 1rem', color: '#f59e0b' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Access restricted</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Only students can create new complaints.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      setError('Title and description are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/complaints', form);
      router.push(`/complaints/${data.complaint._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>New Complaint — ComplaintMS</title>
      </Head>
      <DashboardLayout>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Back to dashboard
            </Link>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>Submit a complaint</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Share the issue clearly so staff can respond and resolve it quickly.</p>

            {error && <div className="alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'grid', gap: '1.1rem' }}>
                <div>
                  <label className="form-label" htmlFor="title">Title</label>
                  <input id="title" name="title" className="form-input" value={form.title} onChange={handleChange} placeholder="Broken projector in room 204" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="form-label" htmlFor="category">Category</label>
                    <select id="category" name="category" className="form-input" value={form.category} onChange={handleChange}>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="urgency">Urgency</label>
                    <select id="urgency" name="urgency" className="form-input" value={form.urgency} onChange={handleChange}>
                      {urgencies.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea id="description" name="description" className="form-input" value={form.description} onChange={handleChange} rows={7} placeholder="Describe the issue, where it happened, and any relevant details..." />
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: 'fit-content', justifySelf: 'flex-start' }}>
                  {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : <><Send size={18} /> Submit Complaint</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
