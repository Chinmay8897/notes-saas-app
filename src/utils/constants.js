// API Configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:3001/api';

// Authentication
export const TOKEN_STORAGE_KEY = 'token';
export const USER_STORAGE_KEY = 'user';
export const TOKEN_REFRESH_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours

// Subscription Plans
export const PLANS = {
  FREE: 'free',
  PRO: 'pro'
};

export const PLAN_LIMITS = {
  [PLANS.FREE]: {
    notes: 3,
    name: 'Free Plan',
    description: 'Perfect for getting started'
  },
  [PLANS.PRO]: {
    notes: null, // unlimited
    name: 'Pro Plan',
    description: 'For power users and teams'
  }
};

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member'
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'create_notes',
    'read_notes',
    'update_notes',
    'delete_notes',
    'upgrade_tenant',
    'invite_users',
    'manage_users'
  ],
  [ROLES.MEMBER]: [
    'create_notes',
    'read_notes',
    'update_notes',
    'delete_notes'
  ]
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NOTE_TITLE_MAX_LENGTH: 200,
  NOTE_CONTENT_MAX_LENGTH: 10000,
  TENANT_SLUG_REGEX: /^[a-z0-9-]+$/,
  TENANT_SLUG_MIN_LENGTH: 2,
  TENANT_SLUG_MAX_LENGTH: 50
};

// UI Constants
export const TOAST_DURATION = 5000;
export const DEBOUNCE_DELAY = 300;
export const PAGINATION_PAGE_SIZE = 20;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOTE_LIMIT_REACHED: 'You have reached your note limit. Upgrade to Pro for unlimited notes.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  NOTE_CREATED: 'Note created successfully!',
  NOTE_UPDATED: 'Note updated successfully!',
  NOTE_DELETED: 'Note deleted successfully!',
  TENANT_UPGRADED: 'Successfully upgraded to Pro plan!',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'You have been logged out.'
};

// Test Accounts
export const TEST_ACCOUNTS = [
  {
    email: 'admin@acme.test',
    password: 'password',
    role: 'Admin',
    tenant: 'Acme Corporation'
  },
  {
    email: 'user@acme.test',
    password: 'password',
    role: 'Member',
    tenant: 'Acme Corporation'
  },
  {
    email: 'admin@globex.test',
    password: 'password',
    role: 'Admin',
    tenant: 'Globex Corporation'
  },
  {
    email: 'user@globex.test',
    password: 'password',
    role: 'Member',
    tenant: 'Globex Corporation'
  }
];

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'saas_notes_token',
  USER_DATA: 'saas_notes_user',
  THEME_PREFERENCE: 'saas_notes_theme',
  SIDEBAR_COLLAPSED: 'saas_notes_sidebar_collapsed'
};
