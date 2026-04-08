import { useEffect, useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const STATUS_COLOR = { pending: '#f59e0b', resolved: '#10b981', completed: '#6366f1' };

export default function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    API.get('/issues').then(r => setIssues(r.data)).catch(() => toast.error('Failed to load issues')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const deleteIssue = async (id) => {
    if (!window.confirm('Delete this issue?')) return;
    try { await API.delete(`/issues/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const card = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow)', marginBottom: '1rem' };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading issues...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>📋 My Issues</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Track your reported city issues</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ label: 'Total', val: issues.length, color: 'var(--accent)' }, { label: '⏳ Pending', val: issues.filter(i => i.status === 'pending').length, color: '#f59e0b' }, { label: '✅ Resolved', val: issues.filter(i => i.status === 'resolved').length, color: '#10b981' }, { label: '🏆 Completed', val: issues.filter(i => i.status === 'completed').length, color: '#6366f1' }].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.75rem 1.5rem', textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {issues.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
          <h3 style={{ color: 'var(--text-primary)' }}>No Issues Reported</h3>
          <p>You haven't reported any issues yet</p>
        </div>
      ) : issues.map(issue => (
        <div key={issue.id} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{issue.category}</div>
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: `${STATUS_COLOR[issue.status]}22`, color: STATUS_COLOR[issue.status] }}>{issue.status}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>📍 {issue.location}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>📝 {issue.description}</p>
          {issue.solution && <div style={{ background: 'rgba(16,185,129,0.12)', borderLeft: '4px solid #10b981', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '0.5rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>✅ Admin Solution: {issue.solution}</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Reported: {new Date(issue.created_at).toLocaleDateString()}</span>
            <button onClick={() => deleteIssue(issue.id)} style={{ padding: '0.4rem 0.9rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
