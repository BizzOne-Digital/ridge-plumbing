import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon } from '../components/common/Icons';
import api from '../utils/api';
import styles from './Gallery.module.css';

const CATEGORIES = ['all', 'service', 'install', 'hot-water-tank', 'team', 'other'];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/gallery').then(r => setItems(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const display = category === 'all' ? items : items.filter(i => i.category === category);

  return (
    <>
      <div className={styles.pageHero}>
        <div className="container">
          <div className="section-tag">Our Work</div>
          <h1 className={styles.pageTitle}>Quality You Can See</h1>
          <p className={styles.pageSub}>Real photos from real jobs across the Fraser Valley.</p>
        </div>
      </div>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.filters}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`${styles.filterBtn} ${category === c ? styles.active : ''}`}
                onClick={() => setCategory(c)}
              >
                {c.replace(/-/g, ' ')}
              </button>
            ))}
          </div>

          {!loading && display.length === 0 && (
            <div className={styles.empty}>
              <ImageIcon size={40} color="var(--gray-300)" />
              <p>No photos in this category yet.</p>
            </div>
          )}

          <div className={styles.grid}>
            {display.map(item => (
              <div key={item._id} className={styles.item}>
                <img src={item.image.url} alt={item.title || 'Ridge Plumbing work'} loading="lazy" />
                {item.title && <div className={styles.caption}>{item.title}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className="text-center">
            <h2 className={styles.ctaTitle}>Like What You See?</h2>
            <p className={styles.ctaSub}>Get a free quote for your next plumbing project.</p>
            <Link to="/contact" className="btn-primary" style={{ marginTop: '1.5rem' }}>Get a Free Quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
