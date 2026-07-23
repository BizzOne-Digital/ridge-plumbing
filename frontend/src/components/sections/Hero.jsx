import { Link } from 'react-router-dom';
import { PhoneIcon, CheckIcon, ArrowRightIcon, ShieldCheckIcon, ClockIcon, AwardIcon } from '../common/Icons';
import styles from './Hero.module.css';

const HERO_IMAGE = '/hero.png';
const HERO_IMAGE_MOBILE = '/mobile-hero.png';

const badges = [
  { icon: <ShieldCheckIcon size={16} color="var(--steel)" />, text: 'Licensed & Insured' },
  { icon: <ClockIcon size={16} color="var(--steel)" />, text: 'Same-Day Service' },
  { icon: <AwardIcon size={16} color="var(--steel)" />, text: '10+ Years Experience' }
];

const checks = [
  'Service plumbing & emergency repairs',
  'Full plumbing installs & renovations',
  'Hot water tank replacement from $1,799'
];

export default function Hero({ settings }) {
  const headline = settings?.heroHeadline || "Fraser Valley's Trusted Plumber";
  const sub = settings?.heroSubheadline || 'Service, installs, hot water tanks — done right, on time.';
  const offer = settings?.specialOffer || 'Hot water tank installs from $1,799';
  const showOffer = settings?.showSpecialOffer !== false;

  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <picture>
          <source media="(max-width: 768px)" srcSet={HERO_IMAGE_MOBILE} />
          <img src={HERO_IMAGE} alt="Plumber at work" className={styles.bgImg} />
        </picture>
        <div className={styles.overlay} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          {showOffer && (
            <div className={styles.offerPill} style={{ animationDelay: '0s' }}>
              <span className={styles.offerDot} />
              {offer}
            </div>
          )}

          <h1 className={styles.headline}>
            {headline.split(' ').map((word, i) => (
              <span key={i} className={i >= headline.split(' ').length - 2 ? styles.highlight : ''}>
                {word}{' '}
              </span>
            ))}
          </h1>

          <p className={styles.sub}>{sub}</p>

          <ul className={styles.checks}>
            {checks.map((c, i) => (
              <li key={i} className={styles.checkItem}>
                <span className={styles.checkIcon}><CheckIcon size={14} color="white" /></span>
                {c}
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <Link to="/contact" className={`btn-primary ${styles.ctaPrimary}`}>
              Get a Free Quote
              <ArrowRightIcon size={16} />
            </Link>
            <a href="tel:6043742457" className={styles.ctaPhone}>
              <span className={styles.phoneCircle}><PhoneIcon size={18} color="white" /></span>
              <span>
                <span className={styles.phoneLabel}>Call Us Now</span>
                <span className={styles.phoneNum}>604-374-2457</span>
              </span>
            </a>
          </div>

          <div className={styles.badges}>
            {badges.map((b, i) => (
              <div key={i} className={styles.badge}>
                {b.icon}
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.stat}>
            <span className={styles.statNum}>500+</span>
            <span className={styles.statLabel}>Happy Customers</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>10+</span>
            <span className={styles.statLabel}>Years Experience</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>24/7</span>
            <span className={styles.statLabel}>Emergency Line</span>
          </div>
        </div>
      </div>
    </section>
  );
}
