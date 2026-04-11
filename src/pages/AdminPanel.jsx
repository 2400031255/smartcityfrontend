import { useEffect, useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const STATUS_COLOR = { pending: '#f59e0b', resolved: '#10b981', completed: '#6366f1' };

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
    <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: 480, border: '1px solid var(--border)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const inp = { width: '100%', padding: '0.75rem 1rem', border: '2px solid var(--border)', borderRadius: '12px', fontSize: '0.9rem', background: 'var(--input-bg)', color: 'var(--text-primary)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem' };
const lbl = { display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' };
const btnPrimary = { padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,var(--accent),#8b5cf6)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', width: '100%' };

export default function AdminPanel() {
  const [tab, setTab] = useState('issues');
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [buses, setBuses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [emergency, setEmergency] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  // ── READ (GET) via Spring Boot @GetMapping ──
  const loadAll = () => {
    API.get('/issues').then(r => setIssues(r.data)).catch(() => {});
    API.get('/users').then(r => setUsers(r.data)).catch(() => {});
    API.get('/places').then(r => setPlaces(r.data)).catch(() => {});
    API.get('/buses').then(r => setBuses(r.data)).catch(() => {});
    API.get('/alerts').then(r => setAlerts(r.data)).catch(() => {});
    API.get('/emergency').then(r => setEmergency(r.data)).catch(() => {});
  };

  useEffect(() => { loadAll(); }, []);

  // ── UPDATE (PUT) via Spring Boot @PutMapping ──
  const resolve = async (id) => {
    await API.put(`/issues/${id}`, { status: 'resolved' });
    toast.success('Marked resolved'); loadAll();
  };
  const complete = async (id) => {
    await API.put(`/issues/${id}`, { status: 'completed' });
    toast.success('Marked completed'); loadAll();
  };

  // ── DELETE via Spring Boot @DeleteMapping ──
  const deleteIssue = async (id) => { await API.delete(`/issues/${id}`); toast.success('Issue deleted'); loadAll(); };
  const deleteUser = async (name) => { await API.delete(`/users/${name}`); toast.success('User deleted'); loadAll(); };
  const deletePlace = async (id) => { await API.delete(`/places/${id}`); toast.success('Place deleted'); loadAll(); };
  const deleteBus = async (id) => { await API.delete(`/buses/${id}`); toast.success('Bus deleted'); loadAll(); };
  const deleteAlert = async (id) => { await API.delete(`/alerts/${id}`); toast.success('Alert deleted'); loadAll(); };
  const deleteEmergency = async (id) => { await API.delete(`/emergency/${id}`); toast.success('Deleted'); loadAll(); };

  // ── CREATE (POST) via Spring Boot @PostMapping ──
  const handleCreate = async () => {
    setLoading(true);
    try {
      if (modal === 'addPlace') {
        await API.post('/places', form);
        toast.success('Place added');
      } else if (modal === 'addBus') {
        await API.post('/buses', form);
        toast.success('Bus added');
      } else if (modal === 'addAlert') {
        await API.post('/alerts', form);
        toast.success('Alert added');
      } else if (modal === 'addEmergency') {
        await API.post('/emergency', form);
        toast.success('Emergency number added');
      } else if (modal === 'addSolution') {
        await API.put(`/issues/${form.id}`, { solution: form.solution, priority: form.priority });
        toast.success('Solution added');
      }
      setModal(null); setForm({});
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally { setLoading(false); }
  };

  const card = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', marginBottom: '0.75rem', boxShadow: 'var(--shadow)' };
  const tabs = ['issues', 'users', 'places', 'buses', 'alerts', 'emergency'];

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🔒 Admin Control Center</h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[{ icon: '👥', val: users.length, lbl: 'Total Users' }, { icon: '📝', val: issues.length, lbl: 'Total Issues' }, { icon: '⏳', val: issues.filter(i => i.status === 'pending').length, lbl: 'Pending' }, { icon: '🏛️', val: places.length, lbl: 'Places' }].map(s => (
          <div key={s.lbl} style={{ ...card, textAlign: 'center', background: 'linear-gradient(135deg,var(--accent),#8b5cf6)', border: 'none' }}>
            <div style={{ fontSize: '2rem' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{s.val}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none', background: tab === t ? 'linear-gradient(135deg,var(--accent),#8b5cf6)' : 'var(--bg-secondary)', color: tab === t ? '#fff' : 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {/* ── ISSUES TAB ── */}
      {tab === 'issues' && (
        <div>
          {issues.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No issues</p> : issues.map(i => (
            <div key={i.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{i.category}</strong>
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: `${STATUS_COLOR[i.status]}22`, color: STATUS_COLOR[i.status] }}>{i.status}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>👤 {i.name} | 📱 {i.phone}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>📍 {i.location}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>📝 {i.description}</p>
              {i.solution && <div style={{ background: 'rgba(16,185,129,0.12)', borderLeft: '4px solid #10b981', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '0.5rem', fontSize: '0.82rem', color: 'var(--text-primary)' }}>✅ Solution: {i.solution}</div>}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {/* @PutMapping("/{id}") - Add Solution */}
                <button onClick={() => { setModal('addSolution'); setForm({ id: i.id, solution: i.solution || '', priority: i.priority || 'medium' }); }} style={{ padding: '0.4rem 0.8rem', background: 'rgba(99,102,241,0.15)', border: '1px solid #6366f1', color: '#6366f1', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🔧 {i.solution ? 'Edit Solution' : 'Add Solution'}</button>
                {/* @PutMapping("/{id}") - Resolve */}
                {i.status === 'pending' && <button onClick={() => resolve(i.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>✅ Resolve</button>}
                {/* @PutMapping("/{id}") - Complete */}
                {i.status === 'resolved' && <button onClick={() => complete(i.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(99,102,241,0.15)', border: '1px solid #6366f1', color: '#6366f1', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🏆 Complete</button>}
                {/* @DeleteMapping("/{id}") */}
                <button onClick={() => deleteIssue(i.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── USERS TAB ── */}
      {tab === 'users' && (
        <div>
          {users.filter(u => u.role === 'user').map(u => (
            <div key={u.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>👤 {u.name}</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>📱 {u.phone} | Joined: {new Date(u.created_at).toLocaleDateString()}</p>
              </div>
              {/* @DeleteMapping("/{name}") */}
              <button onClick={() => deleteUser(u.name)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🗑️ Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* ── PLACES TAB ── */}
      {tab === 'places' && (
        <div>
          {/* @PostMapping */}
          <button onClick={() => { setModal('addPlace'); setForm({ name: '', image: '', description: '', address: '', icon: '🏛️' }); }} style={{ ...btnPrimary, width: 'auto', marginBottom: '1rem', padding: '0.6rem 1.5rem' }}>+ Add Place</button>
          {places.map(p => (
            <div key={p.id} style={{ ...card, display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img src={p.image} alt={p.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '10px' }} onError={e => e.target.src = 'https://via.placeholder.com/80'} />
              <div style={{ flex: 1 }}>
                <strong style={{ color: 'var(--text-primary)' }}>{p.icon} {p.name}</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📍 {p.address}</p>
              </div>
              {/* @DeleteMapping("/{id}") */}
              <button onClick={() => deletePlace(p.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {/* ── BUSES TAB ── */}
      {tab === 'buses' && (
        <div>
          {/* @PostMapping */}
          <button onClick={() => { setModal('addBus'); setForm({ number: '', route: '', time: '' }); }} style={{ ...btnPrimary, width: 'auto', marginBottom: '1rem', padding: '0.6rem 1.5rem' }}>+ Add Bus Route</button>
          {buses.map(b => (
            <div key={b.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>🚌 Bus {b.number}</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{b.route} | {b.time}</p>
              </div>
              {/* @DeleteMapping("/{id}") */}
              <button onClick={() => deleteBus(b.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {/* ── ALERTS TAB ── */}
      {tab === 'alerts' && (
        <div>
          {/* @PostMapping */}
          <button onClick={() => { setModal('addAlert'); setForm({ type: 'warning', message: '' }); }} style={{ ...btnPrimary, width: 'auto', marginBottom: '1rem', padding: '0.6rem 1.5rem' }}>+ Add Alert</button>
          {alerts.map(a => (
            <div key={a.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><strong style={{ color: 'var(--text-primary)' }}>{a.type === 'warning' ? '⚠️' : a.type === 'success' ? '✅' : 'ℹ️'} {a.message}</strong></div>
              {/* @DeleteMapping("/{id}") */}
              <button onClick={() => deleteAlert(a.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {/* ── EMERGENCY TAB ── */}
      {tab === 'emergency' && (
        <div>
          {/* @PostMapping */}
          <button onClick={() => { setModal('addEmergency'); setForm({ service: '', number: '', address: '' }); }} style={{ ...btnPrimary, width: 'auto', marginBottom: '1rem', padding: '0.6rem 1.5rem' }}>+ Add Emergency Number</button>
          {emergency.map(e => (
            <div key={e.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>{e.service}</strong>
                <p style={{ color: 'var(--accent)', fontWeight: 700 }}>{e.number}</p>
                {e.address && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📍 {e.address}</p>}
              </div>
              {/* @DeleteMapping("/{id}") */}
              <button onClick={() => deleteEmergency(e.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {/* ── MODALS for CREATE (POST) via Spring Boot @PostMapping ── */}

      {/* Add Solution Modal - @PutMapping("/{id}") IssueController */}
      {modal === 'addSolution' && (
        <Modal title="🔧 Add Solution" onClose={() => setModal(null)}>
          <label style={lbl}>Priority</label>
          <select style={inp} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          <label style={lbl}>Solution</label>
          <textarea style={{ ...inp, height: 100, resize: 'vertical' }} placeholder="Describe the solution..." value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} />
          <button style={btnPrimary} onClick={handleCreate} disabled={loading}>{loading ? 'Saving...' : 'Save Solution'}</button>
        </Modal>
      )}

      {/* Add Place Modal - @PostMapping TouristPlaceController */}
      {modal === 'addPlace' && (
        <Modal title="🏛️ Add Tourist Place" onClose={() => setModal(null)}>
          <label style={lbl}>Place Name</label>
          <input style={inp} placeholder="e.g. Kanaka Durga Temple" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <label style={lbl}>Image URL</label>
          <input style={inp} placeholder="https://..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          <label style={lbl}>Description</label>
          <textarea style={{ ...inp, height: 80, resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <label style={lbl}>Address</label>
          <input style={inp} placeholder="Full address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <button style={btnPrimary} onClick={handleCreate} disabled={loading}>{loading ? 'Adding...' : 'Add Place'}</button>
        </Modal>
      )}

      {/* Add Bus Modal - @PostMapping BusController */}
      {modal === 'addBus' && (
        <Modal title="🚌 Add Bus Route" onClose={() => setModal(null)}>
          <label style={lbl}>Bus Number</label>
          <input style={inp} placeholder="e.g. 99" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} />
          <label style={lbl}>Route</label>
          <input style={inp} placeholder="e.g. Station to Temple" value={form.route} onChange={e => setForm({ ...form, route: e.target.value })} />
          <label style={lbl}>Timing</label>
          <input style={inp} placeholder="e.g. Every 15 min" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
          <button style={btnPrimary} onClick={handleCreate} disabled={loading}>{loading ? 'Adding...' : 'Add Bus Route'}</button>
        </Modal>
      )}

      {/* Add Alert Modal - @PostMapping AlertController */}
      {modal === 'addAlert' && (
        <Modal title="🚨 Add Alert" onClose={() => setModal(null)}>
          <label style={lbl}>Alert Type</label>
          <select style={inp} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="warning">⚠️ Warning</option>
            <option value="info">ℹ️ Info</option>
            <option value="success">✅ Success</option>
          </select>
          <label style={lbl}>Message</label>
          <input style={inp} placeholder="Alert message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          <button style={btnPrimary} onClick={handleCreate} disabled={loading}>{loading ? 'Adding...' : 'Add Alert'}</button>
        </Modal>
      )}

      {/* Add Emergency Modal - @PostMapping EmergencyController */}
      {modal === 'addEmergency' && (
        <Modal title="📞 Add Emergency Number" onClose={() => setModal(null)}>
          <label style={lbl}>Service Name</label>
          <input style={inp} placeholder="e.g. Police" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} />
          <label style={lbl}>Phone Number</label>
          <input style={inp} placeholder="e.g. 100" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} />
          <label style={lbl}>Address</label>
          <input style={inp} placeholder="Station address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <button style={btnPrimary} onClick={handleCreate} disabled={loading}>{loading ? 'Adding...' : 'Add Emergency Number'}</button>
        </Modal>
      )}
    </div>
  );
}
// Complete CRUD via Spring Boot REST API
