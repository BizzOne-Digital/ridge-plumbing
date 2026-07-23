import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/sections/Hero';
import ServicesSection from '../components/sections/ServicesSection';
import WhyUs from '../components/sections/WhyUs';
import BeforeAfterSection from '../components/sections/BeforeAfterSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import OfferBanner from '../components/sections/OfferBanner';
import { ArrowRightIcon, PhoneIcon } from '../components/common/Icons';
import api from '../utils/api';
import styles from './Home.module.css';

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data.data)).catch(() => {});
    api.get('/services').then(r => setServices(r.data.data)).catch(() => setServices([]));
    api.get('/testimonials').then(r => setTestimonials(r.data.data)).catch(() => {});
  }, []);

  return (
    <>
      <Hero settings={settings} />
      <ServicesSection services={services} />
      <WhyUs />
      <OfferBanner settings={settings} />

      <BeforeAfterSection />

      <TestimonialsSection testimonials={testimonials} limit={3} />

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.ctaTitle}>Got a Plumbing Problem?</h2>
              <p className={styles.ctaSub}>Call us or send a message — we'll get back to you fast.</p>
            </div>
            <div className={styles.ctaActions}>
              <Link to="/contact" className="btn-primary">
                Get a Free Quote <ArrowRightIcon size={16} />
              </Link>
              <a href="tel:6043742457" className="btn-outline-white">
                <PhoneIcon size={16} /> 604-374-2457
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
