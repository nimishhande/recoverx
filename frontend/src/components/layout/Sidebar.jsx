import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  LayoutDashboard,
  FolderKanban,
  Clock,
  PieChart,
  Brain,
  LogOut,
  Settings
} from 'lucide-react';

const navItems = [
  {
    section: 'Overview',
    links: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/projects', label: 'Projects', icon: FolderKanban },
    ]
  },
  {
    section: 'Tracking',
    links: [
      { to: '/time-tracking', label: 'Time Tracking', icon: Clock },
    ]
  },
  {
    section: 'Intelligence',
    links: [
      { to: '/portfolio', label: 'Portfolio', icon: PieChart },
      { to: '/insights', label: 'AI Insights', icon: Brain },
    ]
  }
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`rx-sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <aside className={`rx-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="rx-sidebar-header">
          <div className="rx-sidebar-logo">
            <div className="rx-sidebar-logo-icon">
              <TrendingUp size={20} />
            </div>
            <span className="rx-sidebar-logo-text">ProfitLens</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="rx-sidebar-nav">
          {navItems.map((section) => (
            <React.Fragment key={section.section}>
              <div className="rx-sidebar-section-label">{section.section}</div>
              {section.links.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rx-nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={onClose}
                >
                  <span className="rx-nav-icon">
                    <item.icon size={18} />
                  </span>
                  {item.label}
                </NavLink>
              ))}
            </React.Fragment>
          ))}
        </nav>

        {/* Footer */}
        <div className="rx-sidebar-footer">
          <div className="rx-sidebar-user">
            <div className="rx-sidebar-avatar">
              {(() => {
                if (!user) return 'PL';
                let rawName = user.firstname;
                if (!rawName || rawName.toLowerCase() === 'user' || rawName.trim() === '') {
                  rawName = user.email ? user.email.split('@')[0] : 'U';
                }
                return `${rawName[0].toUpperCase()}${user.lastname?.[0] || ''}`;
              })()}
            </div>
            <div className="rx-sidebar-user-info">
              <div className="rx-sidebar-user-name">
                {(() => {
                  if (!user) return 'ProfitLens User';
                  let rawName = user.firstname;
                  if (!rawName || rawName.toLowerCase() === 'user' || rawName.trim() === '') {
                    rawName = user.email ? user.email.split('@')[0] : 'User';
                  }
                  const displayFirst = rawName !== 'User' ? (rawName.charAt(0).toUpperCase() + rawName.slice(1)) : 'User';
                  return `${displayFirst} ${user.lastname || ''}`.trim();
                })()}
              </div>
              <div className="rx-sidebar-user-role">{user?.role || 'Freelancer'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="rx-btn-logout-sidebar">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
