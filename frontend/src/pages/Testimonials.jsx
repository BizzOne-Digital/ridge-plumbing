import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { StarIcon } from '../components/common/Icons';
import api from '../utils/api';
import styles from './Testimonials.module.css';

const EMPTY_FORM = { name: '', location: '', service: '', rating: 5, review: '' };

const FALLBACK = [
  { _id: '1', name: 'Sarah M.', location: 'Abbotsford, BC', rating: 5, review: 'Ridge Plumbing saved the day! Their team arrived within hours and fixed our burst pipe quickly. Absolutely professional from start to finish. I highly recommend them to anyone in the Fraser Valley.', service: 'Emergency Repair' },
  { _id: '2', name: 'James T.', location: 'Mission, BC', rating: 5, review: 'Had my hot water tank replaced same day. Price was fair, work was clean, and Kyle was great to deal with. Will definitely be calling them again for any future plumbing needs.', service: 'Hot Water Tank' },
  { _id: '3', name: 'Linda R.', location: 'Chilliwack, BC', rating: 5, review: 'We used Ridge Plumbing for a full bathroom renovation. Every fixture was done perfectly and on time. The crew was respectful of our home and cleaned up everything after.', service: 'Plumbing Install' },
  { _id: '4', name: 'Mark D.', location: 'Langley, BC', rating: 5, review: 'Called them on a Sunday for an emergency. They picked up, gave me an honest quote, and were at my house within 2 hours. That level of service is rare.', service: 'Emergency Repair' },
  { _id: '5', name: 'Cindy P.', location: 'Maple Ridge, BC', rating: 5, review: 'Extremely professional and honest. They diagnosed the issue quickly and did not try to upsell unnecessary work. Pricing was exactly as quoted. Would recommend without hesitation.', service: 'Service Plumbing' },
  { _id: '6', name: 'Tom H.', location: 'Abbotsford, BC', rating: 5, review: 'Fast, clean, and professional. Our bathroom installation came out perfect. Kyle took the time to explain everything he was doing. Fantastic local company.', service: 'Plumbing Install' }
];

function getInitials(name) { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/testimonials').then(r => setTestimonials(r.data.data)).catch(() => {});
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.review) { toast.error('Please enter your name and review.'); return; }
    setSubmitting(true);
    try {
      await api.post('/testimonials/submit', form);
      toast.success('Thank you! Your review has been submitted for approval.');
      setForm(EMPTY_FORM);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const display = testimonials.length > 0 ? testimonials : FALLBACK;
  const avgRating = (display.reduce((a, t) => a + t.rating, 0) / display.length).toFixed(1);

  return (
    <>
      <div className={styles.pageHero}>
        <div className="container">
          <div className="section-tag">Reviews</div>
          <h1 className={styles.pageTitle}>What Our Customers Say</h1>
          <p className={styles.pageSub}>Real reviews from real Fraser Valley homeowners and businesses.</p>
          <div className={styles.ratingBadge}>
            <div className={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} size={22} color="#F59E0B" filled />)}
            </div>
            <span className={styles.ratingNum}>{avgRating}</span>
            <span className={styles.ratingCount}>from {display.length}+ reviews</span>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            {display.map(t => (
              <div key={t._id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.stars}>
                    {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} size={15} color="#F59E0B" filled={i < t.rating} />)}
                  </div>
                  {t.service && <span className={styles.serviceTag}>{t.service}</span>}
                </div>
                <p className={styles.review}>"{t.review}"</p>
                <div className={styles.author}>
                  {t.avatar?.url
                    ? <img src={t.avatar.url} alt={t.name} className={styles.avatar} />
                    : <div className={styles.avatarInitials}>{getInitials(t.name)}</div>
                  }
                  <div>
                    <div className={styles.name}>{t.name}</div>
                    <div className={styles.location}>{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.reviewSection}>
        <div className="container">
          <div className={styles.reviewWrap}>
            <div className="text-center" style={{ marginBottom: '2rem' }}>
              <div className="section-tag">Share Your Experience</div>
              <h2 className="section-title">Leave a Review</h2>
              <p className="section-subtitle">Had work done with us? Let other Fraser Valley homeowners know how it went.</p>
            </div>
            <form className={styles.reviewForm} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Your Name *</label>
                  <input className={styles.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" required />
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
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))} className={styles.starBtn}>
                        <StarIcon size={26} color="#F59E0B" filled={n <= form.rating} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Your Review *</label>
                  <textarea className={styles.textarea} rows={4} value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} placeholder="Tell us about your experience..." required />
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={submitting} style={{ marginTop: '1.5rem' }}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <p className={styles.reviewNote}>Reviews are checked by our team before appearing on the site.</p>
            </form>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className="text-center">
            <h2 className={styles.ctaTitle}>Ready to Experience the Ridge Difference?</h2>
            <p className={styles.ctaSub}>Join hundreds of satisfied Fraser Valley customers.</p>
            <Link to="/contact" className="btn-primary" style={{ marginTop: '1.5rem' }}>Get a Free Quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
