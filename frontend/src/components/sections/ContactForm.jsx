import { useState } from 'react';
import { PhoneIcon, MailIcon, MapPinIcon, CheckIcon, ArrowRightIcon } from '../common/Icons';
import api from '../../utils/api';
import styles from './ContactForm.module.css';

const services = [
  { value: 'service-plumbing', label: 'Service Plumbing' },
  { value: 'installs', label: 'Plumbing Installs' },
  { value: 'hot-water-tank', label: 'Hot Water Tank' },
  { value: 'emergency', label: 'Emergency Repair' },
  { value: 'other', label: 'Other' }
];

export default function ContactForm({ settings }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const phone = settings?.phone || '604-374-2457';
  const email = settings?.email || 'kylecrawford007@gmail.com';
  const address = settings?.address || 'Fraser Valley, BC';

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in your name, email, and phone number.');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      await api.post('/leads', form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch {
      setStatus('idle');
      setError('Something went wrong. Please call us directly.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.infoPanel}>
        <h3 className={styles.infoTitle}>Get in Touch</h3>
        <p className={styles.infoSub}>We respond to all inquiries within a few hours during business hours.</p>
        <div className={styles.contacts}>
          <a href={`tel:${phone.replace(/-/g, '')}`} className={styles.contactRow}>
            <div className={styles.contactIcon}><PhoneIcon size={20} color="var(--steel)" /></div>
            <div>
              <div className={styles.contactLabel}>Phone</div>
              <div className={styles.contactValue}>{phone}</div>
            </div>
          </a>
          <a href={`mailto:${email}`} className={styles.contactRow}>
            <div className={styles.contactIcon}><MailIcon size={20} color="var(--steel)" /></div>
            <div>
              <div className={styles.contactLabel}>Email</div>
              <div className={styles.contactValue}>{email}</div>
            </div>
          </a>
          <div className={styles.contactRow}>
            <div className={styles.contactIcon}><MapPinIcon size={20} color="var(--steel)" /></div>
            <div>
              <div className={styles.contactLabel}>Service Area</div>
              <div className={styles.contactValue}>{address}</div>
            </div>
          </div>
        </div>
        <div className={styles.hours}>
          <h4 className={styles.hoursTitle}>Business Hours</h4>
          {[['Mon – Fri', '7:00 AM – 6:00 PM'], ['Saturday', '8:00 AM – 4:00 PM'], ['Sunday', 'Emergency only']].map(([day, time]) => (
            <div key={day} className={styles.hoursRow}>
              <span className={styles.hoursDay}>{day}</span>
              <span className={styles.hoursTime}>{time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formPanel}>
        {status === 'success' ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}><CheckIcon size={28} color="white" /></div>
            <h3 className={styles.successTitle}>Request Received!</h3>
            <p className={styles.successMsg}>Thanks for reaching out. We will be in touch within a few hours. For urgent issues call <a href="tel:6043742457">{phone}</a>.</p>
            <button className="btn-primary" onClick={() => setStatus('idle')}>Send Another Request</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <h3 className={styles.formTitle}>Request a Free Quote</h3>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Full Name *</label>
                <input className={styles.input} name="name" value={form.name} onChange={handleChange} placeholder="John Smith" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone Number *</label>
                <input className={styles.input} name="phone" value={form.phone} onChange={handleChange} placeholder="604-000-0000" required />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email Address *</label>
              <input className={styles.input} type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Service Needed</label>
              <select className={styles.input} name="service" value={form.service} onChange={handleChange}>
                <option value="">Select a service...</option>
                {services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Message</label>
              <textarea className={styles.textarea} name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your plumbing issue or project..." rows={4} />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : <><span>Send Request</span><ArrowRightIcon size={16} /></>}
            </button>
            <p className={styles.disclaimer}>We typically respond within 2–4 business hours.</p>
          </form>
        )}
      </div>
    </div>
  );
}
