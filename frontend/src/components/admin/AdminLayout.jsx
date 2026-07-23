import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BarChartIcon, UsersIcon, WrenchIcon, StarIcon,
  ImageIcon, SettingsIcon, LogOutIcon, HomeIcon, MenuIcon, XIcon
} from '../../components/common/Icons';
import styles from './AdminLayout.module.css';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: BarChartIcon, end: true },
  { to: '/admin/leads', label: 'Leads', icon: UsersIcon },
  { to: '/admin/services', label: 'Services', icon: WrenchIcon },
  { to: '/admin/testimonials', label: 'Testimonials', icon: StarIcon },
  { to: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon }
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className={styles.layout}>
      <header className={styles.mobileTopbar}>
        <div className={styles.mobileBrand}>
          <div className={styles.brandIcon}><WrenchIcon size={16} color="white" /></div>
          <span className={styles.brandName}>Ridge Plumbing</span>
        </div>
        <button className={styles.menuBtn} onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <MenuIcon size={22} />
        </button>
      </header>

      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}><WrenchIcon size={18} color="white" /></div>
            <div>
              <div className={styles.brandName}>Ridge Plumbing</div>
              <div className={styles.brandRole}>Admin Panel</div>
            </div>
            <button className={styles.closeBtn} onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <XIcon size={20} />
            </button>
          </div>
          <nav className={styles.nav}>
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className={styles.sidebarBottom}>
          <a href="/" target="_blank" rel="noreferrer" className={styles.viewSite}>
            <HomeIcon size={16} /> View Site
          </a>
          <div className={styles.userRow}>
            <div className={styles.userAvatar}>{user?.name?.[0]?.toUpperCase() || 'A'}</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user?.name || 'Admin'}</div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
              <LogOutIcon size={16} />
            </button>
          </div>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
