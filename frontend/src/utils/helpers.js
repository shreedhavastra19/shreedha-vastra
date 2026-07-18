// ================================================================
// Shreedha Vastra — Shared Utility Helpers
// ================================================================

// Formats a number as Indian Rupees, e.g. 249900 -> "₹2,49,900"
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

// Formats an ISO date string into a readable date, e.g. "2 Jul 2026"
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Truncates text to a max length, appending an ellipsis
export const truncate = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

// Site-wide constants
export const COLLECTIONS = [
  'Suit Sets',
  'Kurta Sets',
  'Cord Sets',
  'Festive Collection',
  'Wedding Collection',
  'Raja Rani Collection',
  'New Arrivals',
  'Best Sellers',
];

export const SIZES = ['M', 'L', 'XL', 'XXL'];

export const ORDER_STATUSES = [
  'Processing',
  'Confirmed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Returned',
];
