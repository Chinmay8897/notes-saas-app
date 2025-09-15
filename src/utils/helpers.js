import { VALIDATION, ERROR_MESSAGES } from './constants';

// Date and Time Helpers
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options })
    .format(new Date(date));
};

export const formatRelativeTime = (date) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now - targetDate;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;

  if (diffInMs < minute) {
    return 'Just now';
  } else if (diffInMs < hour) {
    const minutes = Math.floor(diffInMs / minute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInMs < day) {
    const hours = Math.floor(diffInMs / hour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInMs < week) {
    const days = Math.floor(diffInMs / day);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInMs < month) {
    const weeks = Math.floor(diffInMs / week);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
  }
};

// Validation Helpers
export const validateEmail = (email) => {
  if (!email) return { isValid: false, error: 'Email is required' };
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true, error: null };
};

export const validatePassword = (password) => {
  if (!password) return { isValid: false, error: 'Password is required' };
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`
    };
  }
  return { isValid: true, error: null };
};

export const validateNoteTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Title is required' };
  }
  if (title.length > VALIDATION.NOTE_TITLE_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Title must be less than ${VALIDATION.NOTE_TITLE_MAX_LENGTH} characters`
    };
  }
  return { isValid: true, error: null };
};

export const validateNoteContent = (content) => {
  if (!content || content.trim().length === 0) {
    return { isValid: false, error: 'Content is required' };
  }
  if (content.length > VALIDATION.NOTE_CONTENT_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Content must be less than ${VALIDATION.NOTE_CONTENT_MAX_LENGTH} characters`
    };
  }
  return { isValid: true, error: null };
};

// String Helpers
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Storage Helpers
export const setStorageItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error setting storage item:', error);
    return false;
  }
};

export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting storage item:', error);
    return defaultValue;
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing storage item:', error);
    return false;
  }
};

// Array Helpers
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Debounce Helper
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Error Handling Helpers
export const getErrorMessage = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return error.message || ERROR_MESSAGES.NETWORK_ERROR;
    }
  }

  return error.message || ERROR_MESSAGES.NETWORK_ERROR;
};

// Permission Helpers
export const hasPermission = (userRole, permission) => {
  const rolePermissions = {
    admin: [
      'create_notes', 'read_notes', 'update_notes', 'delete_notes',
      'upgrade_tenant', 'invite_users', 'manage_users'
    ],
    member: ['create_notes', 'read_notes', 'update_notes', 'delete_notes']
  };

  return rolePermissions[userRole]?.includes(permission) || false;
};

// Plan Helpers
export const canCreateNote = (currentCount, tenantPlan, noteLimit) => {
  if (tenantPlan === 'pro') return true;
  return currentCount < (noteLimit || 3);
};

export const getUsagePercentage = (current, limit) => {
  if (!limit) return 0;
  return Math.min((current / limit) * 100, 100);
};

// URL Helpers
export const buildUrl = (base, params = {}) => {
  const url = new URL(base, window.location.origin);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

// Copy to Clipboard
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};
