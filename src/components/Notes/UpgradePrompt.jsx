import React from 'react';

function UpgradePrompt({ onUpgrade, canUpgrade }) {
  return (
    <div className="upgrade-prompt">
      <div className="upgrade-content">
        <h3>🚀 Note Limit Reached!</h3>
        <p>You've reached your free plan limit. Upgrade to Pro for unlimited notes!</p>

        <div className="upgrade-features">
          <ul>
            <li>✅ Unlimited notes</li>
            <li>✅ Priority support</li>
            <li>✅ Advanced features</li>
          </ul>
        </div>

        {canUpgrade ? (
          <button onClick={onUpgrade} className="upgrade-button">
            Upgrade to Pro
          </button>
        ) : (
          <p className="upgrade-notice">
            Contact your admin to upgrade to the Pro plan.
          </p>
        )}
      </div>
    </div>
  );
}

export default UpgradePrompt;
