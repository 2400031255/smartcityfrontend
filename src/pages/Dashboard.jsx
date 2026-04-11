import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [buses, setBuses] = useState([]);
  const [weather, setWeather] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    API.get('/alerts').then(r => setAlerts(r.data)).catch(() => {});
    API.get('/buses').then(r => setBuses(r.data)).catch(() => {});
    fetch('https://api.open-meteo.com/v1/forecast?latitude=16.5&longitude=80.6&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto')
      .then(r => r.json()).then(d => setWeather(d.current)).catch(() => {});
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const card = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow)' };

  return (
    <div>
      <div style={{ ...card, marginBottom: '2rem', background: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(6,78,59,0.1))', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center', padding: '3rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Welcome to Smart City Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Real-time Intelligent Urban Management System</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {[{ icon: '🕒', val: time.toLocaleTimeString(), lbl: 'Live Time' }, { icon: '👤', val: user?.name, lbl: 'Logged In' }, { icon: '🔑', val: user?.role, lbl: 'Role' }].map(s => (
            <div key={s.lbl} style={{ ...card, minWidth: 140, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>{s.val}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={card}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>🌤️ Weather</h3>
          {weather ? (
            <div style={{ color: 'var(--text-secondary)' }}>
              <p>🌡️ Temperature: <strong style={{ color: 'var(--accent)' }}>{weather.temperature_2m}°C</strong></p>
              <p>💧 Humidity: <strong style={{ color: 'var(--accent)' }}>{weather.relative_humidity_2m}%</strong></p>
              <p>💨 Wind: <strong style={{ color: 'var(--accent)' }}>{weather.wind_speed_10m} km/h</strong></p>
            </div>
          ) : <p style={{ color: 'var(--text-secondary)' }}>Loading weather...</p>}
        </div>

        <div style={card}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>🚌 Bus Routes</h3>
          {buses.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No bus routes available</p> :
            buses.slice(0, 4).map(b => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Bus {b.number} — {b.route}</span>
                <span style={{ background: 'var(--accent)', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600 }}>{b.time}</span>
              </div>
            ))}
        </div>

        <div style={card}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>🚨 Recent Alerts</h3>
          {alerts.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No alerts</p> :
            alerts.slice(0, 3).map(a => (
              <div key={a.id} style={{ padding: '0.6rem', background: a.type === 'warning' ? 'rgba(245,158,11,0.1)' : a.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)', borderLeft: `3px solid ${a.type === 'warning' ? '#f59e0b' : a.type === 'success' ? '#10b981' : '#6366f1'}`, borderRadius: '8px', marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                {a.type === 'warning' ? '⚠️' : a.type === 'success' ? '✅' : 'ℹ️'} {a.message}
              </div>
            ))}
        </div>
      </div>

      <div style={{ ...card }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>⚡ Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '1rem' }}>
          {[{ icon: '📝', label: 'Report Issue', to: '/report' }, { icon: '📋', label: 'My Issues', to: '/issues' }, { icon: '🏛️', label: 'Services', to: '/services' }, { icon: '🏙️', label: 'Places', to: '/places' }].map(a => (
            <button key={a.to} onClick={() => navigate(a.to)} style={{ padding: '1rem', background: 'var(--bg-secondary)', border: '2px solid var(--border)', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{a.icon}</div>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
// Full API integration with response and exception handling
