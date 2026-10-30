/**
 * Escapes HTML characters to prevent rendering issues or XSS vulnerabilities.
 * @param {string} str 
 * @returns {string}
 */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Creates a debounced version of a function that delays execution.
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export function debounce(func, wait = 150) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Highlights RegEx matches within text by wrapping them in <mark class="match-highlight"> tags.
 * Supports zero-length matches (e.g. ^, $, \b, lookaheads) without corrupting text with spaces.
 * @param {string} text 
 * @param {RegExp} re 
 * @returns {string}
 */
export function highlightMatches(text, re) {
  const parts = [];
  let lastIdx = 0;
  let m;
  const flags = re.flags.includes('g') ? re.flags : re.flags + 'g';
  let safeRe;
  try {
    safeRe = new RegExp(re.source, flags);
  } catch (e) {
    return escapeHtml(text);
  }

  safeRe.lastIndex = 0;
  let count = 0;

  while ((m = safeRe.exec(text)) !== null && count < 300) {
    if (m.index > lastIdx) {
      parts.push(escapeHtml(text.slice(lastIdx, m.index)));
    }

    if (m[0].length === 0) {
      // Zero-length match representation
      parts.push('<mark class="match-highlight zero-width-match" title="Zero-length match"></mark>');
      safeRe.lastIndex = m.index + 1;
    } else {
      parts.push(`<mark class="match-highlight">${escapeHtml(m[0])}</mark>`);
    }

    lastIdx = m.index + m[0].length;
    count++;

    if (safeRe.lastIndex <= m.index) {
      safeRe.lastIndex = m.index + 1;
    }
  }

  if (lastIdx < text.length) {
    parts.push(escapeHtml(text.slice(lastIdx)));
  }

  return parts.join('');
}

/**
 * Applies a regex pattern to text and inserts the highlighted HTML into a DOM target element.
 * @param {string} pattern 
 * @param {string} flags 
 * @param {string} text 
 * @param {string} targetId 
 */
export function applyRegex(pattern, flags, text, targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  if (!pattern) { 
    el.innerHTML = escapeHtml(text); 
    return; 
  }
  try {
    const re = new RegExp(pattern, flags);
    el.innerHTML = highlightMatches(text, re);
  } catch (e) {
    el.innerHTML = escapeHtml(text);
  }
}
