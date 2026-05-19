import React from 'react';
import { Bell, Briefcase } from 'lucide-react';

const Navbar = ({ title }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  return (
    <div style={styles.navbar}>
      <div style={styles.left}>
        <h2 style={styles.title}>{title || 'ConstructOps Dashboard'}</h2>
      </div>

      <div style={styles.right}>
        {user && (
          <div style={styles.companyBadge}>
            <Briefcase size={16} />
            <span>{user.companyName}</span>
          </div>
        )}

        <div style={styles.notificationIcon}>
          <Bell size={20} />
          <span style={styles.dot}></span>
        </div>

        <div style={styles.profileSection}>
          <div style={styles.divider}></div>
          <div style={styles.details}>
            <span style={styles.name}>{user ? user.name : 'User'}</span>
            <span style={styles.role}>{user ? user.role.toUpperCase() : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    height: '70px',
    backgroundColor: 'var(--bg-white)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 900,
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--dark-graphite)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  companyBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.4rem 0.8rem',
    backgroundColor: 'var(--bg-light)',
    border: '1px solid var(--border-color)',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: 'var(--dark-graphite)',
  },
  notificationIcon: {
    position: 'relative',
    cursor: 'pointer',
    color: 'var(--dark-graphite-text)',
    padding: '4px',
    borderRadius: '50%',
    transition: 'background var(--transition-fast)',
    ':hover': {
      backgroundColor: 'var(--bg-light)',
    },
  },
  dot: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-orange)',
    border: '2px solid var(--bg-white)',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  divider: {
    height: '24px',
    width: '1px',
    backgroundColor: 'var(--border-color)',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'right',
  },
  name: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--dark-graphite)',
  },
  role: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
};

export default Navbar;
