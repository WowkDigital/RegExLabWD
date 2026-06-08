/**
 * Escapes HTML characters to prevent rendering problems or XSS.
 * @param {string} str 
 * @returns {string}
 */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Highlights RegEx matches within text by wrapping them in <mark class="match-highlight"> tags.
 * @param {string} text 
 * @param {RegExp} re 
 * @returns {string}
 */
export function highlightMatches(text, re) {
  const parts = [];
  let lastIdx = 0;
  let m;
  const safeRe = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  safeRe.lastIndex = 0;
  let count = 0;
  while ((m = safeRe.exec(text)) !== null && count < 200) {
    if (m.index > lastIdx) parts.push(escapeHtml(text.slice(lastIdx, m.index)));
    parts.push(`<mark class="match-highlight">${escapeHtml(m[0] || ' ')}</mark>`);
    lastIdx = safeRe.lastIndex;
    if (!safeRe.flags.includes('g') || m[0] === '') break;
    count++;
  }
  if (lastIdx < text.length) parts.push(escapeHtml(text.slice(lastIdx)));
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
  if (!pattern) { el.innerHTML = escapeHtml(text); return; }
  try {
    const re = new RegExp(pattern, flags);
    el.innerHTML = highlightMatches(text, re);
  } catch (e) {
    el.innerHTML = escapeHtml(text);
  }
}
