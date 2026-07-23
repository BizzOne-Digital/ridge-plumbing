import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { UploadIcon, TrashIcon, ImageIcon } from '../../components/common/Icons';
import styles from './AdminGallery.module.css';

const CATEGORIES = ['service', 'install', 'hot-water-tank', 'team', 'other'];

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('other');
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');

  const fetch = () => api.get('/gallery?all=1').then(r => setItems(r.data.data)).catch(() => {});
  useEffect(() => { fetch(); }, []);

  const handleUpload = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true); setMsg('');
    let uploaded = 0;
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append('image', file);
        fd.append('category', category);
        fd.append('title', title || file.name.split('.')[0]);
        await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        uploaded++;
      } catch {}
    }
    setMsg(`${uploaded} of ${files.length} image(s) uploaded.`);
    setUploading(false);
    fetch();
    e.target.value = '';
  };

  const del = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    await api.delete(`/gallery/${id}`);
    fetch();
  };

  return (
    <AdminLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Gallery</h1>
            <p className={styles.sub}>Upload photos of your work to display on the website.</p>
          </div>
        </div>

        <div className={styles.uploadCard}>
          <div className={styles.uploadOptions}>
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select className={styles.input} value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
              </select>
            </div>
            <div className={styles.field} style={{ flex: 1 }}>
              <label className={styles.label}>Title (optional)</label>
              <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Photo title..." />
            </div>
          </div>
          <label className={styles.uploadZone}>
            <UploadIcon size={36} color={uploading ? 'var(--gray-300)' : 'var(--steel)'} />
            <span className={styles.uploadMain}>{uploading ? 'Uploading to Cloudinary...' : 'Click to upload images'}</span>
            <span className={styles.uploadSub}>JPG, PNG, WEBP — Multiple files supported — max 5MB each</span>
            <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
          </label>
          {msg && <div className={styles.msgBox}>{msg}</div>}
        </div>

        <div className={styles.grid}>
          {items.length === 0 && (
            <div className={styles.empty}>
              <ImageIcon size={40} color="var(--gray-300)" />
              <p>No gallery images yet. Upload some photos above.</p>
            </div>
          )}
          {items.map(item => (
            <div key={item._id} className={styles.imageCard}>
              <img src={item.image.url} alt={item.title || 'Gallery'} className={styles.img} />
              <div className={styles.imageOverlay}>
                <button className={styles.deleteBtn} onClick={() => del(item._id)}><TrashIcon size={16} /></button>
              </div>
              {item.category && <div className={styles.catTag}>{item.category.replace(/-/g, ' ')}</div>}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
