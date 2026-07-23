import { useEffect, useState } from 'react';
import ContactForm from '../components/sections/ContactForm';
import api from '../utils/api';
import styles from './Contact.module.css';

export default function Contact() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data.data)).catch(() => {});
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className={styles.pageHero}>
        <div className="container">
          <div className="section-tag">Contact Us</div>
          <h1 className={styles.pageTitle}>Let's Solve Your Plumbing Problem</h1>
          <p className={styles.pageSub}>Fill out the form below and we'll be in touch within a few hours.</p>
        </div>
      </div>
      <section className={styles.section}>
        <div className="container">
          <ContactForm settings={settings} />
        </div>
      </section>
    </>
  );
}
