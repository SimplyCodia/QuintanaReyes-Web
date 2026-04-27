/**
 * Client-side input sanitization to prevent XSS, SQL injection,
 * and other injection attacks before sending data to the backend.
 *
 * NOTE: The backend (express-validator + escape) is the primary defense.
 * These are an additional client-side layer.
 */

// Patterns that indicate script injection / XSS
const XSS_PATTERN =
  /<script[\s>]|javascript:|on\w+\s*=|<iframe|<object|<embed|<svg[\s/].*on|<img[^>]+onerror|document\.(cookie|write|location)|window\.(location|open)|eval\s*\(|alert\s*\(|prompt\s*\(|confirm\s*\(/i;

// Patterns that indicate SQL injection attempts
const SQL_INJECTION_PATTERN =
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b\s+(ALL|FROM|INTO|TABLE|WHERE|SET|VALUES)|\b(OR|AND)\b\s+\d+\s*=\s*\d+|--|;.*\b(DROP|DELETE|UPDATE|INSERT)\b|'\s*(OR|AND)\s+')/i;

// Null bytes and other control characters (except newline/tab for textareas)
const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;

/**
 * Check if a string contains potentially malicious content.
 * Returns an error message key if dangerous, or null if clean.
 */
export function detectInjection(
  value: string,
): 'xss' | 'sql' | 'control' | null {
  if (CONTROL_CHARS.test(value)) return 'control';
  if (XSS_PATTERN.test(value)) return 'xss';
  if (SQL_INJECTION_PATTERN.test(value)) return 'sql';
  return null;
}

/** Strip HTML tags from a string */
export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validate phone: digits, spaces, +, -, (, ) only */
export function isValidPhone(phone: string): boolean {
  return /^[0-9+\-() ]{6,30}$/.test(phone);
}

/** Validate name: letters, spaces, hyphens, apostrophes, accented chars */
export function isValidName(name: string): boolean {
  return /^[\p{L}\s'\-.,]{2,200}$/u.test(name);
}
