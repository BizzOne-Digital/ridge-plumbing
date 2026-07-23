import { Link } from 'react-router-dom';
import { PhoneIcon, ArrowRightIcon, DropletIcon } from '../common/Icons';
import styles from './OfferBanner.module.css';

export default function OfferBanner({ settings }) {
  const offer = settings?.specialOffer || 'Hot water tank installs from $1,799';
  if (!settings?.showSpecialOffer) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <DropletIcon size={32} color="white" />
          </div>
          <div className={styles.content}>
            <div className={styles.badge}>Limited Time Offer</div>
            <h3 className={styles.title}>{offer}</h3>
            <p className={styles.sub}>
              Supply and install included. Same-day availability. Licensed and insured.
            </p>
          </div>
          <div className={styles.actions}>
            <Link to="/contact" className={styles.btnWhite}>
              Get a Quote <ArrowRightIcon size={16} />
            </Link>
            <a href="tel:6043742457" className={styles.btnOutline}>
              <PhoneIcon size={16} /> Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
