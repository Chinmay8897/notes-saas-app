import React, { useState, useEffect } from 'react';
import { invitationService } from '../../services/invitations';
import InviteUserModal from './InviteUserModal';

function InvitationsList() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({});
  const [showInviteModal, setShowInviteModal] = useState(false);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const result = await invitationService.getInvitations(statusFilter, 1, 10);
      setInvitations(result.invitations);
      setPagination(result.pagination);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [statusFilter]);

  const handleInviteSent = (newInvitation) => {
    setInvitations(prev => [newInvitation, ...prev]);
  };

  const getStatusBadge = (invitation) => {
    if (invitation.isExpired) {
      return <span className="status-badge status-expired">Expired</span>;
    }

    switch (invitation.status) {
      case 'pending':
        return <span className="status-badge status-pending">Pending</span>;
      case 'accepted':
        return <span className="status-badge status-accepted">Accepted</span>;
      default:
        return <span className="status-badge status-default">{invitation.status}</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyInviteLink = (invitation) => {
    const inviteLink = `${window.location.origin}/invite/${invitation.inviteToken}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert('Invite link copied to clipboard!');
    });
  };

  if (loading) {
    return <div className="loading">Loading invitations...</div>;
  }

  return (
    <div className="invitations-section">
      <div className="invitations-header">
        <h2>User Invitations</h2>
        <button
          onClick={() => setShowInviteModal(true)}
          className="btn-primary"
        >
          Invite User
        </button>
      </div>

      <div className="invitations-filters">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Invitations</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {invitations.length === 0 ? (
        <div className="no-invitations">
          No invitations found. {statusFilter === 'all' ? 'Start by inviting a user!' : `No ${statusFilter} invitations.`}
        </div>
      ) : (
        <div className="invitations-table">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Invited By</th>
                <th>Sent</th>
                <th>Expires</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invitation) => (
                <tr key={invitation.id}>
                  <td>{invitation.email}</td>
                  <td>
                    <span className={`role-badge role-${invitation.role}`}>
                      {invitation.role}
                    </span>
                  </td>
                  <td>{getStatusBadge(invitation)}</td>
                  <td>{invitation.invitedBy}</td>
                  <td>{formatDate(invitation.createdAt)}</td>
                  <td>{formatDate(invitation.expiresAt)}</td>
                  <td>
                    {invitation.status === 'pending' && !invitation.isExpired && (
                      <button
                        onClick={() => copyInviteLink(invitation)}
                        className="btn-link"
                        title="Copy invite link"
                      >
                        Copy Link
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInviteSent={handleInviteSent}
      />
    </div>
  );
}

export default InvitationsList;