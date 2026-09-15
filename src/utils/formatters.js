import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDate(isoString) {
  if (!isoString) return '';
  try {
    const date = typeof isoString === 'string' ? parseISO(isoString) : isoString;
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoString;
  }
}

export function formatRelativeTime(isoString) {
  if (!isoString) return '';
  try {
    const date = typeof isoString === 'string' ? parseISO(isoString) : isoString;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return isoString;
  }
}

export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `₹${amount}`;
  }
}

export function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  try {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
    }
    if (num >= 100000) {
      return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  } catch {
    return num.toString();
  }
}

export function getInitials(name) {
  if (!name) return 'A';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
