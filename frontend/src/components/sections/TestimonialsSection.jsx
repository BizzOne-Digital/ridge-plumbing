import { StarIcon } from '../common/Icons';
import styles from './TestimonialsSection.module.css';

const FALLBACK = [
  { _id: '1', name: 'Sarah M.', location: 'Abbotsford, BC', rating: 5, review: 'Ridge Plumbing saved the day! Their team arrived within hours and fixed our burst pipe quickly. Absolutely professional from start to finish.', service: 'Emergency Repair' },
  { _id: '2', name: 'James T.', location: 'Mission, BC', rating: 5, review: 'Had my hot water tank replaced same day. Price was fair, work was clean, and Kyle was great to deal with. Highly recommend.', service: 'Hot Water Tank' },
  { _id: '3', name: 'Linda R.', location: 'Chilliwack, BC', rating: 5, review: 'We used Ridge Plumbing for a full bathroom renovation install. Every fixture was done perfectly. Will 100% be calling them again.', service: 'Plumbing Install' },
];

function Stars({ rating }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} size={16} color="#F59E0B" filled={i < rating} />
      ))}
    </div>
  );
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function TestimonialsSection({ testimonials, limit }) {
  const items = (testimonials && testimonials.length > 0) ? testimonials : FALLBACK;
  const display = limit ? items.slice(0, limit) : items;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <div className="section-tag">Customer Reviews</div>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real reviews from real Fraser Valley homeowners.</p>
        </div>
        <div className={styles.grid}>
          {display.map((t) => (
            <div key={t._id} className={styles.card}>
              <Stars rating={t.rating} />
              <p className={styles.review}>"{t.review}"</p>
              <div className={styles.author}>
                {t.avatar?.url ? (
                  <img src={t.avatar.url} alt={t.name} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarInitials}>{getInitials(t.name)}</div>
                )}
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.location}>{t.location}</div>
                  {t.service && <div className={styles.serviceTag}>{t.service}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
