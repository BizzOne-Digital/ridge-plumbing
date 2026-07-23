import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { PlusIcon, EditIcon, TrashIcon, StarIcon } from '../../components/common/Icons';
import styles from './AdminTestimonials.module.css';

const EMPTY = { name: '', location: '', rating: 5, review: '', service: '', isActive: true, isFeatured: false };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [filter, setFilter] = useState('pending');

  const fetch = () => api.get('/testimonials?all=1').then(r => setItems(r.data.data)).catch(() => {});
  useEffect(() => { fetch(); }, []);

  const pendingCount = items.filter(t => !t.isActive).length;
  const display = filter === 'all' ? items : filter === 'pending' ? items.filter(t => !t.isActive) : items.filter(t => t.isActive);

  const approve = async (id) => { await api.put(`/testimonials/${id}`, { isActive: true }); fetch(); };

  const openNew = () => { setEditing('new'); setForm(EMPTY); setAvatarFile(null); setMsg(''); };
  const openEdit = (t) => { setEditing(t._id); setForm({ name: t.name, location: t.location || '', rating: t.rating, review: t.review, service: t.service || '', isActive: t.isActive, isFeatured: t.isFeatured }); setAvatarFile(null); setMsg(''); };
  const close = () => { setEditing(null); setAvatarFile(null); setMsg(''); };

  const handleSave = async () => {
    if (!form.name || !form.review) { setMsg('Name and review are required.'); return; }
    setSaving(true); setMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatarFile) fd.append('avatar', avatarFile);
      if (editing === 'new') await api.post('/testimonials', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.put(`/testimonials/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      await fetch(); close();
    } catch (e) { setMsg('Error saving.'); }
    finally { setSaving(false); }
  };

  const del = async (id) => { if (!window.confirm('Delete?')) return; await api.delete(`/testimonials/${id}`); fetch(); };

  return (
    <AdminLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Testimonials</h1>
            <p className={styles.sub}>Manage customer reviews shown on your website.</p>
          </div>
          <button className={styles.addBtn} onClick={openNew}><PlusIcon size={16} /> Add Review</button>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tabBtn} ${filter === 'pending' ? styles.tabActive : ''}`} onClick={() => setFilter('pending')}>
            Pending {pendingCount > 0 && <span className={styles.tabBadge}>{pendingCount}</span>}
          </button>
          <button className={`${styles.tabBtn} ${filter === 'active' ? styles.tabActive : ''}`} onClick={() => setFilter('active')}>Approved</button>
          <button className={`${styles.tabBtn} ${filter === 'all' ? styles.tabActive : ''}`} onClick={() => setFilter('all')}>All</button>
        </div>

        {editing && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>{editing === 'new' ? 'Add Review' : 'Edit Review'}</h2>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>Customer Name *</label>
                <input className={styles.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Location</label>
                <input className={styles.input} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Abbotsford, BC" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Service</label>
                <input className={styles.input} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} placeholder="Hot Water Tank" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Rating</label>
                <div className={styles.ratingRow}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))} className={styles.starBtn}>
                      <StarIcon size={24} color="#F59E0B" filled={n <= form.rating} />
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.label}>Review *</label>
                <textarea className={styles.textarea} value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} rows={3} placeholder="Customer's review text..." />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Avatar Photo (optional)</label>
                <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files[0])} className={styles.fileInput} />
              </div>
              <div className={styles.checkRow}>
                <label className={styles.checkLabel}><input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} /> Active</label>
                <label className={styles.checkLabel}><input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} /> Featured</label>
              </div>
            </div>
            {msg && <div className={styles.error}>{msg}</div>}
            <div className={styles.formActions}>
              <button className={styles.cancelBtn} onClick={close}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Review'}</button>
            </div>
          </div>
        )}

        <div className={styles.list}>
          {display.length === 0 && <div className={styles.empty}>{filter === 'pending' ? 'No pending reviews to approve.' : 'No testimonials yet. Add customer reviews to build trust.'}</div>}
          {display.map(t => (
            <div key={t._id} className={`${styles.row} ${!t.isActive ? styles.inactive : ''}`}>
              <div className={styles.stars}>
                {[1,2,3,4,5].map(n => <StarIcon key={n} size={13} color="#F59E0B" filled={n <= t.rating} />)}
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{t.name} <span className={styles.loc}>{t.location}</span></div>
                <div className={styles.review}>"{t.review.slice(0, 100)}{t.review.length > 100 ? '...' : ''}"</div>
              </div>
              {t.service && <span className={styles.svcTag}>{t.service}</span>}
              <span className={t.isActive ? styles.activePill : styles.inactivePill}>{t.isActive ? 'Approved' : 'Pending'}</span>
              <div className={styles.actions}>
                {!t.isActive && <button className={styles.approveBtn} onClick={() => approve(t._id)}>Approve</button>}
                <button className={styles.editBtn} onClick={() => openEdit(t)}><EditIcon size={14} /></button>
                <button className={styles.delBtn} onClick={() => del(t._id)}><TrashIcon size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
