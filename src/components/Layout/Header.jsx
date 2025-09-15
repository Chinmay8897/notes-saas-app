import React from 'react';
import { useAuth } from '../../hooks/useAuth';

function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <h1 className="app-title">
            <span className="brand-icon">📝</span>
            SaaS Notes
          </h1>
        </div>

        <nav className="header-nav">
          <div className="user-info">
            <div className="user-details">
              <span className="user-email">{user?.email}</span>
              <div className="user-meta">
                <span className="user-role">{user?.role}</span>
                <span className="tenant-separator">•</span>
                <span className="tenant-name">{user?.tenant?.name}</span>
                <span className={`plan-badge ${user?.tenant?.plan}`}>
                  {user?.tenant?.plan?.toUpperCase()}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="logout-btn"
              title="Logout"
            >
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
