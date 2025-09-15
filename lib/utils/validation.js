export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateNoteData = (title, content) => {
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (!content || content.trim().length === 0) {
    errors.push('Content is required');
  } else if (content.length > 10000) {
    errors.push('Content must be less than 10,000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateTenantSlug = (slug) => {
  const slugRegex = /^[a-z0-9-]+$/;
  return slug && slugRegex.test(slug) && slug.length >= 2 && slug.length <= 50;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic XSS characters
    .substring(0, 10000); // Limit length
};

export const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
