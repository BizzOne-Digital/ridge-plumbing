import styles from './BeforeAfterSection.module.css';

const DEFAULT_PAIRS = [
  {
    before: '/bef1.png',
    after: '/bef2.png',
    label: 'Kitchen Pipe Repair'
  },
  {
   before: '/bef3.png',
    after: '/bef4.png',
    label: 'Bathroom Re-Pipe'
  }
];

export default function BeforeAfterSection({ pairs = DEFAULT_PAIRS }) {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          <div className="section-tag">Real Results</div>
          <h2 className="section-title">Before &amp; After</h2>
          <p className="section-subtitle">See the difference a professional plumbing job makes.</p>
        </div>

        <div className={styles.wide}>
        <div className={styles.grid}>
          {pairs.map((pair, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.imagesRow}>
                <div className={styles.imgCol}>
                  <span className={styles.tag}>Before</span>
                  <img src={pair.before} alt={`${pair.label} before`} className={styles.img} />
                </div>
                <div className={styles.imgCol}>
                  <span className={`${styles.tag} ${styles.tagAfter}`}>After</span>
                  <img src={pair.after} alt={`${pair.label} after`} className={styles.img} />
                </div>
              </div>
              <p className={styles.label}>{pair.label}</p>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
