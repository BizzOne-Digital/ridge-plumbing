import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import styles from './AdminSettings.module.css';

export default function AdminSettings() {
  const [form, setForm] = useState({
    businessName: '', tagline: '', phone: '', email: '', address: '', serviceArea: '',
    heroHeadline: '', heroSubheadline: '', specialOffer: '', showSpecialOffer: true,
    metaTitle: '', metaDescription: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/settings').then(r => { setForm(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (typeof v !== 'object') fd.append(k, v); });
      if (logoFile) fd.append('logo', logoFile);
      await api.put('/settings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Settings saved successfully.');
    } catch { setMsg('Error saving settings.'); }
    finally { setSaving(false); }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  if (loading) return <AdminLayout><div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.sub}>Configure your website content and business information.</p>
        </div>

        <div className={styles.sections}>
          <SettingsCard title="Business Information">
            <div className={styles.grid}>
              <Field label="Business Name"><input className={styles.input} value={form.businessName} onChange={e => set('businessName', e.target.value)} /></Field>
              <Field label="Tagline"><input className={styles.input} value={form.tagline} onChange={e => set('tagline', e.target.value)} /></Field>
              <Field label="Phone"><input className={styles.input} value={form.phone} onChange={e => set('phone', e.target.value)} /></Field>
              <Field label="Email"><input className={styles.input} value={form.email} onChange={e => set('email', e.target.value)} /></Field>
              <Field label="Address / Location"><input className={styles.input} value={form.address} onChange={e => set('address', e.target.value)} /></Field>
              <Field label="Service Area"><input className={styles.input} value={form.serviceArea} onChange={e => set('serviceArea', e.target.value)} /></Field>
            </div>
          </SettingsCard>

          <SettingsCard title="Hero Section">
            <div className={styles.stack}>
              <Field label="Main Headline"><input className={styles.input} value={form.heroHeadline} onChange={e => set('heroHeadline', e.target.value)} /></Field>
              <Field label="Sub-headline"><input className={styles.input} value={form.heroSubheadline} onChange={e => set('heroSubheadline', e.target.value)} /></Field>
            </div>
          </SettingsCard>

          <SettingsCard title="Special Offer">
            <div className={styles.stack}>
              <label className={styles.checkLabel}>
                <input type="checkbox" checked={form.showSpecialOffer} onChange={e => set('showSpecialOffer', e.target.checked)} />
                Show special offer banner
              </label>
              <Field label="Offer Text"><input className={styles.input} value={form.specialOffer} onChange={e => set('specialOffer', e.target.value)} placeholder="Hot water tank installs from $1,799" /></Field>
            </div>
          </SettingsCard>

          <SettingsCard title="Logo">
            <div className={styles.stack}>
              {form.logo?.url && <img src={form.logo.url} alt="Current logo" style={{ height: '60px', objectFit: 'contain', borderRadius: '6px' }} />}
              <Field label="Upload New Logo">
                <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} className={styles.fileInput} />
              </Field>
              {logoFile && <div className={styles.note}>New logo will be uploaded on save.</div>}
            </div>
          </SettingsCard>

          <SettingsCard title="SEO / Meta">
            <div className={styles.stack}>
              <Field label="Page Title"><input className={styles.input} value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} /></Field>
              <Field label="Meta Description"><textarea className={`${styles.input} ${styles.textarea}`} value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} rows={2} /></Field>
            </div>
          </SettingsCard>
        </div>

        {msg && <div className={msg.includes('success') ? styles.success : styles.error}>{msg}</div>}
        <div className={styles.saveRow}>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

function SettingsCard({ title, children }) {
  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-100)', padding: '1.75rem' }}>
      <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--gray-100)' }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>{label}</label>
      {children}
    </div>
  );
}
