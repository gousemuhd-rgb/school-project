/**
 * register.js — User registration form with role selection.
 */

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { GraduationCap, User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Building2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import api from '@/lib/axios';

const DEPARTMENTS = ['Maintenance', 'IT', 'Academic', 'Hostel', 'Administration', 'Library', 'Sports'];

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if ((form.role === 'staff' || form.role === 'admin') && !form.department) {
      setError('Please select a department for this role.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = { name, email, password, role: form.role };
      if (form.department) payload.department = form.department;
      const { data } = await api.post('/auth/register', payload);
      setAuth({ user: data.user, token: data.token });
      router.push('/dashboard');
    } catch (err) {
      setError(err?.message || 'Unable to create account right now.');
    } finally {
      setLoading(false);
    }
  };

  const showDept = form.role === 'staff' || form.role === 'admin';

  return (
    <>
      <Head>
        <title>Create Account — ComplaintMS</title>
        <meta name="description" content="Register a new ComplaintMS account" />
      </Head>

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'var(--bg-primary)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', bottom: '-100px', right: '-100px', pointerEvents: 'none' }} />

        <div className="glass-card fade-up" style={{ width: '100%', maxWidth: 480, padding: '2.5rem' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '16px', background: 'var(--accent-gradient)', marginBottom: '1rem' }}>
              <GraduationCap size={28} color="white" />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>Create your account</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Join the ComplaintMS platform</p>
          </div>

          {error && <div className="alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div style={{ marginBottom: '1.1rem' }}>
              <label htmlFor="reg-name" className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-name" type="text" name="name" className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="Jane Doe" value={form.name} onChange={handleChange} autoComplete="name" />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1.1rem' }}>
              <label htmlFor="reg-email" className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-email" type="email" name="email" className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="you@college.edu" value={form.email} onChange={handleChange} autoComplete="email" />
              </div>
            </div>

            {/* Role */}
            <div style={{ marginBottom: '1.1rem' }}>
              <label htmlFor="reg-role" className="form-label">Role</label>
              <select id="reg-role" name="role" className="form-input" value={form.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Department (conditional) */}
            {showDept && (
              <div style={{ marginBottom: '1.1rem' }}>
                <label htmlFor="reg-department" className="form-label">Department</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select id="reg-department" name="department" className="form-input" style={{ paddingLeft: '2.5rem' }} value={form.department} onChange={handleChange}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Password */}
            <div style={{ marginBottom: '1.1rem' }}>
              <label htmlFor="reg-password" className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-password" type={showPassword ? 'text' : 'password'} name="password" className="form-input" style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} placeholder="Min. 6 characters" value={form.password} onChange={handleChange} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label htmlFor="reg-confirm-password" className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-confirm-password" type={showPassword ? 'text' : 'password'} name="confirmPassword" className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" />
              </div>
            </div>

            <button id="reg-submit-btn" type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}>
              {loading ? (
                <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating account…</>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#a5b4fc', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
