import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { PlusIcon, EditIcon, TrashIcon, UploadIcon, ImageIcon } from '../../components/common/Icons';
import styles from './AdminServices.module.css';

const ICONS = ['wrench', 'droplet', 'tool'];
const EMPTY = { title: '', shortDescription: '', description: '', icon: 'wrench', order: 0, isActive: true, isFeatured: false };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetch = () => api.get('/services?all=1').then(r => setServices(r.data.data)).catch(() => {});

  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing('new'); setForm(EMPTY); setImageFile(null); setImagePreview(''); setMsg(''); };
  const openEdit = (s) => { setEditing(s._id); setForm({ title: s.title, shortDescription: s.shortDescription || '', description: s.description, icon: s.icon, order: s.order, isActive: s.isActive, isFeatured: s.isFeatured }); setImagePreview(s.image?.url || ''); setImageFile(null); setMsg(''); };
  const closeForm = () => { setEditing(null); setImageFile(null); setImagePreview(''); setMsg(''); };

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.title || !form.description) { setMsg('Title and description are required.'); return; }
    setSaving(true); setMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editing === 'new') await api.post('/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.put(`/services/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      await fetch();
      setMsg('Saved successfully.');
      closeForm();
    } catch (e) {
      setMsg(e.response?.data?.message || 'Error saving service.');
    } finally { setSaving(false); }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    await api.delete(`/services/${id}`);
    fetch();
  };

  return (
    <AdminLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Services</h1>
            <p className={styles.sub}>Manage the services shown on your website.</p>
          </div>
          <button className={styles.addBtn} onClick={openNew}><PlusIcon size={16} /> Add Service</button>
        </div>

        {editing && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>{editing === 'new' ? 'Add New Service' : 'Edit Service'}</h2>
            <div className={styles.formGrid}>
              <div className={styles.formLeft}>
                <div className={styles.field}>
                  <label className={styles.label}>Title *</label>
                  <input className={styles.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Hot Water Tank Replacement" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Short Description</label>
                  <input className={styles.input} value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="One-line summary for the service card" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Full Description *</label>
                  <textarea className={styles.textarea} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Detailed description shown on the Services page..." rows={4} />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Icon</label>
                    <select className={styles.input} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}>
                      {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Display Order</label>
                    <input className={styles.input} type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
                  </div>
                </div>
                <div className={styles.checkRow}>
                  <label className={styles.checkLabel}>
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                    Active (visible on site)
                  </label>
                  <label className={styles.checkLabel}>
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                    Featured
                  </label>
                </div>
              </div>

              <div className={styles.formRight}>
                <label className={styles.label}>Service Image (Cloudinary)</label>
                <div className={styles.imageUpload}>
                  {imagePreview ? (
                    <div className={styles.imagePreview}>
                      <img src={imagePreview} alt="Preview" />
                      <button className={styles.removeImage} onClick={() => { setImageFile(null); setImagePreview(''); }}>Remove</button>
                    </div>
                  ) : (
                    <label className={styles.uploadArea}>
                      <ImageIcon size={32} color="var(--gray-300)" />
                      <span className={styles.uploadText}>Click to upload image</span>
                      <span className={styles.uploadHint}>JPG, PNG, WEBP — max 5MB</span>
                      <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              </div>
            </div>
            {msg && <div className={msg.includes('uccessfully') ? styles.success : styles.error}>{msg}</div>}
            <div className={styles.formActions}>
              <button className={styles.cancelBtn} onClick={closeForm}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </div>
        )}

        <div className={styles.servicesList}>
          {services.length === 0 && <div className={styles.empty}>No services yet. Add your first service above.</div>}
          {services.map(s => (
            <div key={s._id} className={`${styles.serviceRow} ${!s.isActive ? styles.inactive : ''}`}>
              {s.image?.url ? <img src={s.image.url} alt={s.title} className={styles.serviceThumb} /> : <div className={styles.serviceThumbEmpty}><ImageIcon size={20} color="var(--gray-300)" /></div>}
              <div className={styles.serviceInfo}>
                <div className={styles.serviceName}>{s.title}</div>
                <div className={styles.serviceDesc}>{s.shortDescription || s.description?.slice(0, 80) + '...'}</div>
              </div>
              <div className={styles.serviceMeta}>
                <span className={s.isActive ? styles.activePill : styles.inactivePill}>{s.isActive ? 'Active' : 'Hidden'}</span>
                {s.isFeatured && <span className={styles.featuredPill}>Featured</span>}
              </div>
              <div className={styles.serviceActions}>
                <button className={styles.editBtn} onClick={() => openEdit(s)}><EditIcon size={15} /></button>
                <button className={styles.delBtn} onClick={() => deleteService(s._id)}><TrashIcon size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
