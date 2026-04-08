import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const userLinks = [
    { to: '/dashboard', label: '🏙️ Dashboard' },
    { to: '/places',    label: '🏛️ Places' },
    { to: '/services',  label: '🏛️ Services' },
    { to: '/report',    label: '📝 Report' },
    { to: '/issues',    label: '📋 My Issues' },
  ];

  const adminLinks = [
    { to: '/dashboard', label: '🏙️ Dashboard' },
    { to: '/admin',     label: '🔒 Admin' },
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border)', padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow)' }}>
        <div style={{ fontWeight: 900, fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--accent), #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🏙️ Smart City
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: '0.45rem 0.9rem', borderRadius: '10px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
              background: location.pathname === l.to ? 'linear-gradient(135deg, var(--accent), #8b5cf6)' : 'transparent',
              color: location.pathname === l.to ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user?.name}</span>
          <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: user?.role === 'admin' ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.2)', color: user?.role === 'admin' ? '#f59e0b' : 'var(--accent)', fontWeight: 700 }}>{user?.role}</span>
          <button onClick={handleLogout} style={{ padding: '0.4rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Logout</button>
        </div>
      </nav>
      <main style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
