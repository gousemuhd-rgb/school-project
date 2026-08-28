/**
 * DashboardLayout.js — Main shell with sidebar navigation.
 * Wraps all authenticated pages.
 */

import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['student', 'staff', 'admin'] },
  { href: '/complaints/new', label: 'New Complaint', icon: PlusCircle, roles: ['student'] },
  { href: '/admin/users', label: 'Manage Users', icon: Users, roles: ['admin'] },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const visibleLinks = navLinks.filter((l) => l.roles.includes(user?.role));

  const roleColors = {
    student: 'bg-indigo-500/20 text-indigo-300',
    staff: 'bg-amber-500/20 text-amber-300',
    admin: 'bg-emerald-500/20 text-emerald-300',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 260,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: sidebarOpen ? 0 : undefined,
          bottom: 0,
          zIndex: 50,
          transition: 'transform 0.3s ease',
        }}
        className="hidden md:flex"
      >
        <SidebarContent
          user={user}
          visibleLinks={visibleLinks}
          router={router}
          handleLogout={handleLogout}
          roleColors={roleColors}
        />
      </aside>

      {/* ── Mobile Sidebar ── */}
      <aside
        style={{
          width: 260,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: sidebarOpen ? 0 : -280,
          zIndex: 50,
          transition: 'left 0.3s ease',
        }}
        className="md:hidden"
      >
        <SidebarContent
          user={user}
          visibleLinks={visibleLinks}
          router={router}
          handleLogout={handleLogout}
          roleColors={roleColors}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* ── Main content ── */}
      <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column' }} className="md:ml-[260px] ml-0">
        {/* Mobile topbar */}
        <div
          className="md:hidden flex items-center gap-3 px-4 py-3"
          style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-glass)' }}
        >
          <button onClick={() => setSidebarOpen(true)} style={{ color: 'var(--text-secondary)' }}>
            <Menu size={22} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '1rem' }} className="gradient-text">ComplaintMS</span>
        </div>

        <main style={{ flex: 1, padding: '2rem', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ user, visibleLinks, router, handleLogout, roleColors, onClose }) {
  return (
    <>
      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>ComplaintMS</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>College System</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
        )}
      </div>

      {/* User badge */}
      {user && (
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-glass)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Signed in as</div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
          <span
            className={`badge ${roleColors[user.role] || ''}`}
            style={{ fontSize: '0.65rem', padding: '0.15rem 0.6rem' }}
          >
            {user.role}
          </span>
        </div>
      )}

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {visibleLinks.map(({ href, label, icon: Icon }) => {
          const active = router.pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 400,
                color: active ? 'white' : 'var(--text-secondary)',
                background: active ? 'var(--accent-gradient)' : 'transparent',
                textDecoration: 'none',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-glass)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#f87171',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </>
  );
}
