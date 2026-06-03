// ── Shared form validation rules ─────────────────────────────
// Each rule returns '' (valid) or an error string

export const rules = {
  name: (v) => {
    if (!v?.trim()) return 'Full name is required';
    if (v.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s'.'-]+$/.test(v.trim())) return 'Name should contain only letters';
    return '';
  },

  email: (v) => {
    if (!v?.trim()) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Enter a valid email address (e.g. name@example.com)';
    return '';
  },

  phone: (v, required = true) => {
    if (!v?.trim()) return required ? 'Mobile number is required' : '';
    const digits = v.replace(/\D/g, '');
    if (digits.length !== 10) return 'Enter a valid 10-digit mobile number';
    if (!/^[6-9]/.test(digits)) return 'Mobile number must start with 6, 7, 8 or 9';
    return '';
  },

  pin: (v) => {
    if (!v?.trim()) return '';   // optional
    if (!/^\d{6}$/.test(v.trim())) return 'PIN code must be exactly 6 digits';
    return '';
  },

  pan: (v) => {
    if (!v?.trim()) return '';   // optional
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v.trim().toUpperCase())) return 'Invalid PAN format (e.g. ABCDE1234F)';
    return '';
  },

  amount: (v, min = 1) => {
    if (!v && v !== 0) return 'Donation amount is required';
    if (isNaN(Number(v)) || Number(v) < 1) return 'Please enter a valid amount';
    if (Number(v) < min) return `Minimum donation amount is ₹${Number(min).toLocaleString('en-IN')}`;
    return '';
  },

  required: (v, label = 'This field') => {
    if (!v?.toString().trim()) return `${label} is required`;
    return '';
  },

  date: (v, label = 'Date') => {
    if (!v) return `${label} is required`;
    return '';
  },

  checkoutAfterCheckin: (checkin, checkout) => {
    if (!checkin || !checkout) return '';
    if (new Date(checkout) <= new Date(checkin)) return 'Check-out must be after check-in date';
    return '';
  },

  message: (v, minLen = 10) => {
    if (!v?.trim()) return 'Message is required';
    if (v.trim().length < minLen) return `Message must be at least ${minLen} characters`;
    return '';
  },
};

// Returns true if any error string is non-empty
export function hasErrors(errs) {
  return Object.values(errs).some((e) => !!e);
}
