import { Link } from 'react-router-dom';
import { WrenchIcon, DropletIcon, ToolIcon, ArrowRightIcon } from '../common/Icons';
import styles from './ServicesSection.module.css';

const iconMap = {
  wrench: WrenchIcon,
  droplet: DropletIcon,
  tool: ToolIcon
};

const FALLBACK_SERVICES = [
  {
    _id: '1', title: 'Service Plumbing', icon: 'wrench', slug: 'service-plumbing',
    shortDescription: 'Fast, reliable repairs for leaks, fixtures, drains, and more.',
    image: { url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80&fit=crop' }
  },
  {
    _id: '2', title: 'Plumbing Installs', icon: 'tool', slug: 'plumbing-installs',
    shortDescription: 'Professional installation of fixtures, appliances, and full systems.',
    image: { url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80&fit=crop' }
  },
  {
    _id: '3', title: 'Hot Water Tank Replacement', icon: 'droplet', slug: 'hot-water-tank',
    shortDescription: 'Same-day hot water tank replacement starting from $1,799.',
    image: { url: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&q=80&fit=crop' }
  }
];

export default function ServicesSection({ services }) {
  const displayServices = (services && services.length > 0) ? services : FALLBACK_SERVICES;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <div className="section-tag">What We Do</div>
            <h2 className="section-title">Plumbing Services<br />You Can Count On</h2>
          </div>
          <div className={styles.headerRight}>
            <p className="section-subtitle">Serving the Fraser Valley with quality workmanship and honest pricing on every job.</p>
            <Link to="/services" className="btn-secondary">View All Services</Link>
          </div>
        </div>

        <div className={styles.grid}>
          {displayServices.map((service, i) => {
            const Icon = iconMap[service.icon] || WrenchIcon;
            const imgUrl = service.image?.url || `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop`;
            return (
              <div key={service._id || i} className={styles.card}>
                <div className={styles.cardImg}>
                  <img src={imgUrl} alt={service.title} />
                  <div className={styles.cardImgOverlay} />
                  <div className={styles.iconBadge}>
                    <Icon size={22} color="var(--steel)" />
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                  <p className={styles.cardDesc}>{service.shortDescription}</p>
                  <Link to={`/services`} className={styles.cardLink}>
                    Learn more <ArrowRightIcon size={15} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
