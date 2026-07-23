import { ShieldCheckIcon, ClockIcon, ThumbsUpIcon, ZapIcon } from '../common/Icons';
import styles from './WhyUs.module.css';

const SIDE_IMAGE = '/about.png';

const reasons = [
  {
    icon: <ShieldCheckIcon size={24} color="var(--steel)" />,
    title: 'Licensed & Fully Insured',
    desc: 'Every job is covered. We carry full liability insurance so you have complete peace of mind.'
  },
  {
    icon: <ClockIcon size={24} color="var(--steel)" />,
    title: 'Same-Day Service Available',
    desc: 'We know plumbing problems can not wait. Call us and we will be there fast.'
  },
  {
    icon: <ThumbsUpIcon size={24} color="var(--steel)" />,
    title: 'Honest, Upfront Pricing',
    desc: 'No hidden fees. You will know the price before we start — and we stick to it.'
  },
  {
    icon: <ZapIcon size={24} color="var(--steel)" />,
    title: 'Fraser Valley Local',
    desc: 'We live and work here too. Supporting local means faster response and real accountability.'
  }
];

export default function WhyUs() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.imageCol}>
            <div className={styles.imgWrap}>
              <img src={SIDE_IMAGE} alt="Professional plumber at work" className={styles.img} />
            </div>
            <div className={styles.badge}>
              <span className={styles.badgeNum}>10+</span>
              <span className={styles.badgeText}>Years Serving<br />Fraser Valley</span>
            </div>
          </div>
          <div className={styles.content}>
            <div className="section-tag">Why Ridge Plumbing</div>
            <h2 className="section-title">The Plumber Your Neighbours Trust</h2>
            <p className="section-subtitle">
              We are a local Fraser Valley company built on quality work, fair pricing, and showing up when we say we will.
            </p>
            <div className={styles.reasons}>
              {reasons.map((r, i) => (
                <div key={i} className={styles.reasonItem}>
                  <div className={styles.reasonIcon}>{r.icon}</div>
                  <div>
                    <h4 className={styles.reasonTitle}>{r.title}</h4>
                    <p className={styles.reasonDesc}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
