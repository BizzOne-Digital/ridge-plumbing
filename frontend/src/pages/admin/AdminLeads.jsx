import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { TrashIcon, EditIcon } from '../../components/common/Icons';
import styles from './AdminLeads.module.css';

const STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'];
const STATUS_COLORS = { new: '#3B82F6', contacted: '#F59E0B', quoted: '#8B5CF6', won: '#10B981', lost: '#EF4444' };

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const fetch = async () => {
    setLoading(true);
    const url = filter ? `/leads?status=${filter}` : '/leads';
    const res = await api.get(url);
    setLeads(res.data.data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [filter]);

  const updateStatus = async (id, status) => {
    await api.put(`/leads/${id}`, { status });
    setLeads(l => l.map(lead => lead._id === id ? { ...lead, status } : lead));
    if (selected?._id === id) setSelected(s => ({ ...s, status }));
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    await api.delete(`/leads/${id}`);
    setLeads(l => l.filter(lead => lead._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  return (
    <AdminLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Leads</h1>
            <p className={styles.sub}>{leads.length} total enquiries</p>
          </div>
          <div className={styles.filters}>
            <button className={`${styles.filterBtn} ${!filter ? styles.filterActive : ''}`} onClick={() => setFilter('')}>All</button>
            {STATUSES.map(s => (
              <button key={s} className={`${styles.filterBtn} ${filter === s ? styles.filterActive : ''}`} onClick={() => setFilter(s)} style={filter === s ? { background: STATUS_COLORS[s] + '20', color: STATUS_COLORS[s], borderColor: STATUS_COLORS[s] + '40' } : {}}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.list}>
            {loading && <div className={styles.empty}>Loading...</div>}
            {!loading && leads.length === 0 && <div className={styles.empty}>No leads found.</div>}
            {leads.map(lead => (
              <div key={lead._id} className={`${styles.leadCard} ${selected?._id === lead._id ? styles.selected : ''}`} onClick={() => setSelected(lead)}>
                <div className={styles.leadTop}>
                  <div className={styles.leadName}>{lead.name}</div>
                  <span className={styles.statusPill} style={{ background: STATUS_COLORS[lead.status] + '20', color: STATUS_COLORS[lead.status] }}>{lead.status}</span>
                </div>
                <div className={styles.leadMeta}>{lead.phone} · {lead.service?.replace(/-/g, ' ') || 'General'}</div>
                <div className={styles.leadDate}>{new Date(lead.createdAt).toLocaleDateString('en-CA')}</div>
              </div>
            ))}
          </div>

          {selected ? (
            <div className={styles.detail}>
              <div className={styles.detailHeader}>
                <div>
                  <h2 className={styles.detailName}>{selected.name}</h2>
                  <div className={styles.detailDate}>{new Date(selected.createdAt).toLocaleString('en-CA')}</div>
                </div>
                <button className={styles.deleteBtn} onClick={() => deleteLead(selected._id)}><TrashIcon size={16} /></button>
              </div>
              <div className={styles.detailGrid}>
                <InfoRow label="Email" value={<a href={`mailto:${selected.email}`}>{selected.email}</a>} />
                <InfoRow label="Phone" value={<a href={`tel:${selected.phone}`}>{selected.phone}</a>} />
                <InfoRow label="Service" value={selected.service?.replace(/-/g, ' ') || '—'} />
                <InfoRow label="Source" value={selected.source || 'website'} />
              </div>
              {selected.message && (
                <div className={styles.messageBox}>
                  <div className={styles.messageLabel}>Message</div>
                  <p className={styles.messageText}>{selected.message}</p>
                </div>
              )}
              <div className={styles.statusSection}>
                <div className={styles.statusLabel}>Update Status</div>
                <div className={styles.statusBtns}>
                  {STATUSES.map(s => (
                    <button key={s} className={`${styles.statusBtn} ${selected.status === s ? styles.statusBtnActive : ''}`}
                      style={selected.status === s ? { background: STATUS_COLORS[s], color: 'white', borderColor: STATUS_COLORS[s] } : {}}
                      onClick={() => updateStatus(selected._id, s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.detailEmpty}>
              <EditIcon size={32} color="var(--gray-300)" />
              <p>Select a lead to view details</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: '0.75rem' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ fontSize: '0.9rem', color: 'var(--gray-800)', fontWeight: 500 }}>{value}</div>
    </div>
  );
}
