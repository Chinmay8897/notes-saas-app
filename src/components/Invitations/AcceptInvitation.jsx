import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invitationService } from '../../services/invitations';
import { useAuth } from '../../context/AuthContext';

function AcceptInvitation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchInvitationDetails = async () => {
      try {
        const result = await invitationService.getInvitationDetails(token);
        setInvitation(result.invitation);

        if (!result.invitation.canBeAccepted) {
          setError(
            result.invitation.isExpired
              ? 'This invitation has expired'
              : 'This invitation is no longer valid'
          );
        }
      } catch (error) {
        setError(error.response?.data?.error || 'Invalid invitation');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInvitationDetails();
    } else {
      setError('No invitation token provided');
      setLoading(false);
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await invitationService.acceptInvitation(
        token,
        formData.password,
        formData.confirmPassword
      );

      // Store the authentication data
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      // Update auth context would be handled by the login method if we had one
      // For now, we'll redirect and let the app handle authentication

      alert('Welcome! Your account has been created successfully.');
      navigate('/');

    } catch (error) {
      setError(error.response?.data?.error || 'Failed to accept invitation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="accept-invitation-container">
        <div className="accept-invitation-card">
          <div className="loading">Loading invitation...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="accept-invitation-container">
        <div className="accept-invitation-card">
          <h1>Invitation Error</h1>
          <div className="error-message">{error}</div>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="accept-invitation-container">
      <div className="accept-invitation-card">
        <h1>Join {invitation.tenant.name}</h1>
        <p>You've been invited to join <strong>{invitation.tenant.name}</strong> as a <strong>{invitation.role}</strong>.</p>
        <p>Invitation from: <strong>{invitation.invitedBy}</strong></p>

        <form onSubmit={handleSubmit} className="accept-invitation-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={invitation.email}
              disabled
              className="disabled-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Create Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !formData.password || !formData.confirmPassword}
            className="btn-primary btn-full-width"
          >
            {submitting ? 'Creating Account...' : 'Accept Invitation & Create Account'}
          </button>
        </form>

        <div className="invitation-details">
          <p><small>This invitation expires on {new Date(invitation.expiresAt).toLocaleDateString()}</small></p>
        </div>
      </div>
    </div>
  );
}

export default AcceptInvitation;