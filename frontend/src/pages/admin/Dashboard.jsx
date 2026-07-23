import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import styles from './Dashboard.module.css';
import { UsersIcon, PhoneIcon, CheckIcon, BarChartIcon } from '../../components/common/Icons';

const STATUS_COLORS = { new: '#3B82F6', contacted: '#F59E0B', quoted: '#8B5CF6', won: '#10B981', lost: '#EF4444' };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/leads/stats'), api.get('/leads?limit=8')])
      .then(([s, l]) => { setStats(s.data.data); setLeads(l.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div className={styles.loading}>Loading dashboard...</div></AdminLayout>;

  const statCards = [
    { label: 'Total Leads', value: stats?.total || 0, icon: <UsersIcon size={20} color="var(--steel)" />, color: 'blue' },
    { label: 'New Leads', value: stats?.new || 0, icon: <BarChartIcon size={20} color="#3B82F6" />, color: 'indigo' },
    { label: 'This Month', value: stats?.thisMonth || 0, icon: <PhoneIcon size={20} color="#8B5CF6" />, color: 'purple' },
    { label: 'Won Jobs', value: stats?.won || 0, icon: <CheckIcon size={20} color="#10B981" />, color: 'green' }
  ];

  return (
    <AdminLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.sub}>Overview of your leads and activity.</p>
        </div>

        <div className={styles.statsGrid}>
          {statCards.map((card, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statIcon}>{card.icon}</div>
              <div>
                <div className={styles.statNum}>{card.value}</div>
                <div className={styles.statLabel}>{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Recent Leads</h2>
            <a href="/admin/leads" className={styles.viewAll}>View all leads</a>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th><th>Phone</th><th>Service</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr><td colSpan={5} className={styles.empty}>No leads yet. Share your website to start getting inquiries.</td></tr>
                ) : leads.map(lead => (
                  <tr key={lead._id}>
                    <td><div className={styles.leadName}>{lead.name}</div><div className={styles.leadEmail}>{lead.email}</div></td>
                    <td>{lead.phone}</td>
                    <td>{lead.service?.replace(/-/g, ' ') || '—'}</td>
                    <td>
                      <span className={styles.statusBadge} style={{ background: STATUS_COLORS[lead.status] + '20', color: STATUS_COLORS[lead.status] }}>
                        {lead.status}
                      </span>
                    </td>
                    <td className={styles.dateCell}>{new Date(lead.createdAt).toLocaleDateString('en-CA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
