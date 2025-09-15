import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

function Sidebar() {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      active: true
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: '📝',
      active: true
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      active: user?.role === 'admin'
    }
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="toggle-icon">
            {isCollapsed ? '→' : '←'}
          </span>
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map(item => (
            item.active && (
              <li key={item.id} className="nav-item">
                <a
                  href={`#${item.id}`}
                  className={`nav-link ${item.id === 'notes' ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="nav-label">{item.label}</span>
                  )}
                </a>
              </li>
            )
          ))}
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="tenant-info">
            <div className="tenant-card">
              <div className="tenant-header">
                <span className="tenant-icon">🏢</span>
                <div className="tenant-details">
                  <h4>{user?.tenant?.name}</h4>
                  <p className="tenant-plan">{user?.tenant?.plan} Plan</p>
                </div>
              </div>

              {user?.tenant?.plan === 'free' && (
                <div className="plan-usage">
                  <div className="usage-info">
                    <span>Notes Limit</span>
                    <span>{user?.tenant?.noteLimit || 3}</span>
                  </div>
                  <div className="upgrade-hint">
                    <small>Upgrade for unlimited notes</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
