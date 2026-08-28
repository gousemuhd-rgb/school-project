/**
 * index.js — Landing page with hero section, feature cards, and CTA buttons.
 */

import Head from 'next/head';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, BarChart3, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure & Role-Based',
    desc: 'JWT-secured access with distinct portals for students, staff, and admins.',
    color: '#6366f1',
  },
  {
    icon: BarChart3,
    title: 'Live Analytics',
    desc: 'Admins see real-time dashboards with complaint trends and resolution rates.',
    color: '#8b5cf6',
  },
  {
    icon: MessageSquare,
    title: 'Communication Thread',
    desc: 'Every ticket has a built-in comment thread for transparent resolution.',
    color: '#06b6d4',
  },
];

const stats = [
  { value: '3', label: 'User Roles' },
  { value: '4', label: 'Status States' },
  { value: '∞', label: 'Complaints Handled' },
];

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>ComplaintMS — College Complaint Management System</title>
        <meta
          name="description"
          content="A modern, role-based complaint management system for colleges. Students submit issues, staff resolve them, admins oversee everything."
        />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden' }}>
        {/* ── Nav ── */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 2rem',
            borderBottom: '1px solid var(--border-glass)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backdropFilter: 'blur(12px)',
            background: 'rgba(15,15,26,0.8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GraduationCap size={21} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Complaint<span className="gradient-text">MS</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/login">
              <button className="btn-secondary" id="nav-login-btn">Sign In</button>
            </Link>
            <Link href="/register">
              <button className="btn-primary" id="nav-register-btn">
                Get Started <ArrowRight size={15} />
              </button>
            </Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section
          style={{
            textAlign: 'center',
            padding: '6rem 2rem 4rem',
            position: 'relative',
          }}
        >
          {/* Glow orb */}
          <div
            style={{
              position: 'absolute',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />

          <div
            className="badge fade-up"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)', display: 'inline-flex', marginBottom: '1.5rem' }}
          >
            <ShieldCheck size={12} />
            Role-Based Access Control
          </div>

          <h1
            className="fade-up"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              color: 'var(--text-primary)',
              animationDelay: '0.1s',
            }}
          >
            Manage College Complaints{' '}
            <span className="gradient-text">Seamlessly</span>
          </h1>

          <p
            className="fade-up"
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: 560,
              margin: '0 auto 2.5rem',
              lineHeight: 1.75,
              animationDelay: '0.2s',
            }}
          >
            A centralized platform where students raise issues, staff resolve them,
            and admins gain full visibility — all in one place.
          </p>

          <div className="fade-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.3s' }}>
            <Link href="/register">
              <button className="btn-primary" id="hero-register-btn" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                Start for Free <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/login">
              <button className="btn-secondary" id="hero-login-btn" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                Sign In
              </button>
            </Link>
          </div>
        </section>

        {/* ── Stats ── */}
        <section style={{ display: 'flex', justifyContent: 'center', gap: '2rem', padding: '2rem', flexWrap: 'wrap' }}>
          {stats.map((s) => (
            <div key={s.label} className="glass-card fade-up" style={{ padding: '1.5rem 3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }} className="gradient-text">{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── Features ── */}
        <section style={{ padding: '4rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '3rem', color: 'var(--text-primary)' }}>
            Everything you need, <span className="gradient-text">built in</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="glass-card fade-up"
                  style={{ padding: '2rem', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      background: `${f.color}22`,
                      border: `1px solid ${f.color}44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <Icon size={22} color={f.color} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Role highlights ── */}
        <section style={{ padding: '4rem 2rem', maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '3rem', color: 'var(--text-primary)' }}>
            Built for <span className="gradient-text">every role</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { role: 'Student', color: '#6366f1', points: ['Submit complaints by category & urgency', 'Track status in real-time', 'Chat with staff via comment threads'] },
              { role: 'Staff', color: '#f59e0b', points: ['See department-assigned tickets', 'Update status: In Progress → Resolved', 'Communicate with students directly'] },
              { role: 'Admin', color: '#10b981', points: ['Manage all users and roles', 'Assign complaints to departments', 'View college-wide analytics'] },
            ].map((r) => (
              <div key={r.role} className="glass-card" style={{ padding: '1.5rem 2rem', display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ minWidth: 90 }}>
                  <span className="badge" style={{ background: `${r.color}22`, color: r.color, border: `1px solid ${r.color}44`, fontSize: '0.8rem' }}>{r.role}</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                  {r.points.map((p) => (
                    <li key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={14} color={r.color} /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Footer ── */}
        <section style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div className="glass-card" style={{ maxWidth: 600, margin: '0 auto', padding: '3rem 2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Ready to get started?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Register your college account and start managing complaints today.
            </p>
            <Link href="/register">
              <button className="btn-primary" id="cta-register-btn" style={{ padding: '0.875rem 2.5rem', fontSize: '1rem' }}>
                Create Account <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
