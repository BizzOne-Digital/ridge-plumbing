import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WrenchIcon, DropletIcon, ToolIcon, CheckIcon, ArrowRightIcon, PhoneIcon } from '../components/common/Icons';
import OfferBanner from '../components/sections/OfferBanner';
import api from '../utils/api';
import styles from './Services.module.css';

const iconMap = { wrench: WrenchIcon, droplet: DropletIcon, tool: ToolIcon };

const FALLBACK = [
  {
    _id: '1', title: 'Service Plumbing', icon: 'wrench', slug: 'service-plumbing',
    shortDescription: 'Fast, reliable repairs for leaks, fixtures, drains, and more.',
    description: 'From dripping faucets to full pipe repairs, our licensed plumbers diagnose and fix plumbing issues efficiently. We serve residential and light commercial properties across the Fraser Valley.',
    image: { url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80&fit=crop' },
    features: ['Leak detection & repair', 'Faucet & fixture repair', 'Drain cleaning', 'Pipe replacement', 'Toilet repairs']
  },
  {
    _id: '2', title: 'Plumbing Installs', icon: 'tool', slug: 'plumbing-installs',
    shortDescription: 'Professional installation for renovations and new builds.',
    description: 'Whether you are renovating or building new, we handle all plumbing installations including sinks, toilets, showers, dishwashers, and complete rough-in work done to code.',
    image: { url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&fit=crop' },
    features: ['Sink & faucet install', 'Toilet installation', 'Shower & tub fitting', 'Dishwasher hookup', 'Bathroom rough-in']
  },
  {
    _id: '3', title: 'Hot Water Tank Replacement', icon: 'droplet', slug: 'hot-water-tank',
    shortDescription: 'Same-day hot water tank replacement from $1,799.',
    description: 'We supply and install leading hot water tank brands with same-day service available. Our team removes your old unit and has your new one running fast. Ask about our current special pricing.',
    image: { url: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=800&q=80&fit=crop' },
    features: ['Supply & install included', 'Same-day availability', 'Old tank disposal', 'All major brands', 'Warranty provided']
  }
];

export default function Services() {
  const [services, setServices] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.data)).catch(() => setServices([]));
    api.get('/settings').then(r => setSettings(r.data.data)).catch(() => {});
    window.scrollTo(0, 0);
  }, []);

  const display = services === null ? null : (services.length > 0 ? services : FALLBACK);

  return (
    <>
      <div className={styles.pageHero}>
        <div className="container">
          <div className="section-tag">What We Offer</div>
          <h1 className={styles.pageTitle}>Our Plumbing Services</h1>
          <p className={styles.pageSub}>Licensed, insured, and ready to help across the entire Fraser Valley.</p>
        </div>
      </div>

      <section className={styles.servicesSection}>
        <div className="container">
          {display?.map((service, i) => {
            const Icon = iconMap[service.icon] || WrenchIcon;
            const features = service.features || [];
            const imgUrl = service.image?.url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop';
            const isReverse = i % 2 !== 0;
            return (
              <div key={service._id} className={`${styles.serviceRow} ${isReverse ? styles.reverse : ''}`}>
                <div className={styles.serviceImg}>
                  <img src={imgUrl} alt={service.title} />
                </div>
                <div className={styles.serviceContent}>
                  <div className={styles.serviceIconWrap}><Icon size={28} color="var(--steel)" /></div>
                  <h2 className={styles.serviceTitle}>{service.title}</h2>
                  <p className={styles.serviceDesc}>{service.description}</p>
                  {features.length > 0 && (
                    <ul className={styles.featureList}>
                      {features.map((f, fi) => (
                        <li key={fi} className={styles.featureItem}>
                          <span className={styles.featureCheck}><CheckIcon size={13} color="white" /></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className={styles.serviceActions}>
                    <Link to="/contact" className="btn-primary">
                      Get a Quote <ArrowRightIcon size={16} />
                    </Link>
                    <a href="tel:6043742457" className="btn-secondary">
                      <PhoneIcon size={16} /> Call Us
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <OfferBanner settings={settings} />
    </>
  );
}
