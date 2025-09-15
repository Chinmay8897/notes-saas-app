import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const TEST_ACCOUNTS = [
  { email: 'admin@acme.test', role: 'Admin', tenant: 'Acme' },
  { email: 'user@acme.test', role: 'Member', tenant: 'Acme' },
  { email: 'admin@globex.test', role: 'Admin', tenant: 'Globex' },
  { email: 'user@globex.test', role: 'Member', tenant: 'Globex' },
];

function Login() {
  const [formData, setFormData] = useState({ email: '', password: 'password' });
  const { login, loading, error, user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // Error handled by context
    }
  };

  const handleTestAccountClick = (email) => {
    setFormData(prev => ({ ...prev, email }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>SaaS Notes</h1>
        <p>Multi-tenant notes application</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              placeholder="Select a test account below"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="test-accounts">
          <h3>Test Accounts (password: password)</h3>
          <div className="account-grid">
            {TEST_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                onClick={() => handleTestAccountClick(account.email)}
                className="account-button"
              >
                <div className="account-email">{account.email}</div>
                <div className="account-details">{account.role} - {account.tenant}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
