import { Link } from 'react-router-dom';
import { PhoneIcon, MailIcon, MapPinIcon, ArrowRightIcon } from '../common/Icons';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBar}>
        <div className="container">
          <div className={styles.ctaStrip}>
            <div>
              <h3 className={styles.ctaTitle}>Ready to solve your plumbing problem?</h3>
              <p className={styles.ctaSub}>Same-day service available across the Fraser Valley.</p>
            </div>
            <a href="tel:6043742457" className="btn-primary">
              <PhoneIcon size={18} />
              Call 604-374-2457
            </a>
          </div>
        </div>
      </div>

      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.brand}>
              <div className={styles.logoText}>
                <span className={styles.logoMain}>RIDGE</span>
                <span className={styles.logoSub}>PLUMBING</span>
              </div>
              <p className={styles.brandDesc}>
                Local plumbing company proudly serving the Fraser Valley. Licensed, insured, and dedicated to getting the job done right.
              </p>
              <div className={styles.contact}>
                <a href="tel:6043742457" className={styles.contactItem}>
                  <PhoneIcon size={16} color="var(--steel)" />
                  <span>604-374-2457</span>
                </a>
                <a href="mailto:kylecrawford007@gmail.com" className={styles.contactItem}>
                  <MailIcon size={16} color="var(--steel)" />
                  <span>kylecrawford007@gmail.com</span>
                </a>
                <div className={styles.contactItem}>
                  <MapPinIcon size={16} color="var(--steel)" />
                  <span>Fraser Valley, BC</span>
                </div>
              </div>
            </div>

            <div className={styles.col}>
              <h4 className={styles.colTitle}>Quick Links</h4>
              <ul className={styles.linkList}>
                {[['Home', '/'], ['Services', '/services'], ['Testimonials', '/testimonials'], ['Contact', '/contact']].map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className={styles.link}>
                      <ArrowRightIcon size={14} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.col}>
              <h4 className={styles.colTitle}>Our Services</h4>
              <ul className={styles.linkList}>
                {['Service Plumbing', 'Plumbing Installs', 'Hot Water Tank Replacement', 'Emergency Plumbing'].map(s => (
                  <li key={s}>
                    <Link to="/services" className={styles.link}>
                      <ArrowRightIcon size={14} />
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.col}>
              <h4 className={styles.colTitle}>Special Offer</h4>
              <div className={styles.offerCard}>
                <div className={styles.offerBadge}>Limited Time</div>
                <p className={styles.offerText}>Hot water tank installs</p>
                <p className={styles.offerPrice}>From $1,799</p>
                <Link to="/contact" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}>
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>© {new Date().getFullYear()} Ridge Plumbing. All rights reserved. Fraser Valley, BC.</p>
          <Link to="/admin/login" className={styles.adminLink}>Admin</Link>
        </div>
      </div>
    </footer>
  );
}
