import { useEffect, useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const STATUS_COLOR = { pending: '#f59e0b', resolved: '#10b981', completed: '#6366f1' };

export default function AdminPanel() {
  const [tab, setTab] = useState('issues');
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [buses, setBuses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [emergency, setEmergency] = useState([]);

  const loadAll = () => {
    API.get('/issues').then(r => setIssues(r.data)).catch(() => {});
    API.get('/users').then(r => setUsers(r.data)).catch(() => {});
    API.get('/places').then(r => setPlaces(r.data)).catch(() => {});
    API.get('/buses').then(r => setBuses(r.data)).catch(() => {});
    API.get('/alerts').then(r => setAlerts(r.data)).catch(() => {});
    API.get('/emergency').then(r => setEmergency(r.data)).catch(() => {});
  };

  useEffect(() => { loadAll(); }, []);

  const resolve = async (id) => { await API.put(`/issues/${id}`, { status: 'resolved' }); toast.success('Marked resolved'); loadAll(); };
  const complete = async (id) => { await API.put(`/issues/${id}`, { status: 'completed' }); toast.success('Marked completed'); loadAll(); };
  const deleteIssue = async (id) => { await API.delete(`/issues/${id}`); toast.success('Deleted'); loadAll(); };
  const deleteUser = async (name) => { await API.delete(`/users/${name}`); toast.success('User deleted'); loadAll(); };
  const deletePlace = async (id) => { await API.delete(`/places/${id}`); toast.success('Place deleted'); loadAll(); };
  const deleteBus = async (id) => { await API.delete(`/buses/${id}`); toast.success('Bus deleted'); loadAll(); };
  const deleteAlert = async (id) => { await API.delete(`/alerts/${id}`); toast.success('Alert deleted'); loadAll(); };

  const card = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', marginBottom: '0.75rem', boxShadow: 'var(--shadow)' };
  const tabs = ['issues', 'users', 'places', 'buses', 'alerts', 'emergency'];

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🔒 Admin Control Center</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[{ icon: '👥', val: users.length, lbl: 'Total Users' }, { icon: '📝', val: issues.length, lbl: 'Total Issues' }, { icon: '⏳', val: issues.filter(i => i.status === 'pending').length, lbl: 'Pending' }, { icon: '🏛️', val: places.length, lbl: 'Places' }].map(s => (
          <div key={s.lbl} style={{ ...card, textAlign: 'center', background: 'linear-gradient(135deg,var(--accent),#8b5cf6)', border: 'none' }}>
            <div style={{ fontSize: '2rem' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{s.val}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none', background: tab === t ? 'linear-gradient(135deg,var(--accent),#8b5cf6)' : 'var(--bg-secondary)', color: tab === t ? '#fff' : 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {tab === 'issues' && (
        <div>
          {issues.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No issues</p> : issues.map(i => (
            <div key={i.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{i.category}</strong>
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: `${STATUS_COLOR[i.status]}22`, color: STATUS_COLOR[i.status] }}>{i.status}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>👤 {i.name} | 📍 {i.location}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>📝 {i.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {i.status === 'pending' && <button onClick={() => resolve(i.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>✅ Resolve</button>}
                {i.status === 'resolved' && <button onClick={() => complete(i.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(99,102,241,0.15)', border: '1px solid #6366f1', color: '#6366f1', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🏆 Complete</button>}
                <button onClick={() => deleteIssue(i.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div>
          {users.filter(u => u.role === 'user').map(u => (
            <div key={u.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>{u.name}</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{u.phone} | Joined: {new Date(u.created_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => deleteUser(u.name)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'places' && (
        <div>
          {places.map(p => (
            <div key={p.id} style={{ ...card, display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img src={p.image} alt={p.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '10px' }} onError={e => e.target.src = 'https://via.placeholder.com/80'} />
              <div style={{ flex: 1 }}>
                <strong style={{ color: 'var(--text-primary)' }}>{p.icon} {p.name}</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📍 {p.address}</p>
              </div>
              <button onClick={() => deletePlace(p.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'buses' && (
        <div>
          {buses.map(b => (
            <div key={b.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><strong style={{ color: 'var(--text-primary)' }}>🚌 Bus {b.number}</strong><p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{b.route} | {b.time}</p></div>
              <button onClick={() => deleteBus(b.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'alerts' && (
        <div>
          {alerts.map(a => (
            <div key={a.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><strong style={{ color: 'var(--text-primary)' }}>{a.type === 'warning' ? '⚠️' : a.type === 'success' ? '✅' : 'ℹ️'} {a.message}</strong></div>
              <button onClick={() => deleteAlert(a.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'emergency' && (
        <div>
          {emergency.map(e => (
            <div key={e.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><strong style={{ color: 'var(--text-primary)' }}>{e.service}</strong><p style={{ color: 'var(--accent)', fontWeight: 700 }}>{e.number}</p></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
