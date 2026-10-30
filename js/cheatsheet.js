import { escapeHtml, debounce } from './utils.js';

const sections = [
  {
    id: 'char-classes',
    title: 'Character Classes', 
    color: 'accent', 
    items: [
      ['.', 'Any character (except newline \\n)'],
      ['\\d', 'Digit [0-9]'],
      ['\\D', 'Non-digit [^0-9]'],
      ['\\w', 'Word character [a-zA-Z0-9_]'],
      ['\\W', 'Non-word character'],
      ['\\s', 'Whitespace character (spaces, tabs, newlines)'],
      ['\\S', 'Non-whitespace character'],
      ['[abc]', 'Character set: a, b, or c'],
      ['[^abc]', 'Negated set: any character except a, b, or c'],
      ['[a-z]', 'Character range: lowercase a through z'],
      ['\\p{L}', 'Unicode letter (requires u flag)'],
    ]
  },
  {
    id: 'anchors',
    title: 'Anchors', 
    color: 'green', 
    items: [
      ['^', 'Beginning of line / string'],
      ['$', 'End of line / string'],
      ['\\b', 'Word boundary (between \\w and \\W)'],
      ['\\B', 'Non-word boundary'],
      ['\\A / \\Z', 'String start/end anchors (PCRE/Python specific)', true],
    ]
  },
  {
    id: 'quantifiers',
    title: 'Quantifiers', 
    color: 'amber', 
    items: [
      ['*', '0 or more occurrences (greedy)'],
      ['+', '1 or more occurrences (greedy)'],
      ['?', '0 or 1 occurrence (optional)'],
      ['{n}', 'Exactly n occurrences'],
      ['{n,}', 'At least n occurrences'],
      ['{n,m}', 'Between n and m occurrences'],
      ['*?', '0 or more occurrences (lazy / non-greedy)'],
      ['+?', '1 or more occurrences (lazy / non-greedy)'],
      ['??', '0 or 1 occurrence (lazy / non-greedy)'],
    ]
  },
  {
    id: 'groups',
    title: 'Groups & Alternation', 
    color: 'purple', 
    items: [
      ['(abc)', 'Capturing group'],
      ['(?:abc)', 'Non-capturing group'],
      ['(?<name>abc)', 'Named capturing group'],
      ['\\1', 'Backreference to capturing group #1'],
      ['\\k<name>', 'Backreference to named group'],
      ['a|b', 'Alternation: match branch a OR branch b'],
    ]
  },
  {
    id: 'lookaround',
    title: 'Lookaround Assertions', 
    color: 'red', 
    items: [
      ['(?=abc)', 'Positive lookahead: followed by abc'],
      ['(?!abc)', 'Negative lookahead: NOT followed by abc'],
      ['(?<=abc)', 'Positive lookbehind: preceded by abc'],
      ['(?<!abc)', 'Negative lookbehind: NOT preceded by abc'],
    ]
  },
  {
    id: 'flags',
    title: 'Flags', 
    color: 'text', 
    items: [
      ['g', 'Global: find all matches rather than stopping at the first'],
      ['i', 'Case-insensitive matching'],
      ['m', 'Multiline: ^ and $ match line boundaries'],
      ['s', 'DotAll: dot (.) matches newline \\n as well'],
      ['u', 'Unicode: enable full UTF-16 surrogate handling and \\p{...}'],
      ['d', 'HasIndices: expose .indices start/end match offsets'],
      ['y', 'Sticky: match strictly at the lastIndex cursor position'],
    ]
  },
  {
    id: 'js-api',
    title: 'JavaScript API', 
    color: 'accent', 
    isCodeOnly: true,
    items: [
      ['re.test(str)', 'Returns boolean indicating match presence'],
      ['str.match(re)', 'Returns array of match results'],
      ['str.matchAll(re)', 'Returns iterator of all match objects with groups'],
      ['str.replace(re, sub)', 'Replaces matches with replacement string/function'],
      ['str.search(re)', 'Returns index of first match or -1'],
      ['str.split(re)', 'Splits string into array by pattern separator'],
    ]
  },
];

const POPULAR_PATTERNS = [
  ['Email (RFC 5322 standard)', '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'],
  ['URL (HTTP/HTTPS)', 'https?:\\/\\/[\\w.-]+(?:\\/[\\S]*)?'],
  ['IPv4 Address', '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b'],
  ['Hex Color Code', '#[0-9a-fA-F]{3,6}'],
  ['ISO Date (YYYY-MM-DD)', '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])'],
  ['Phone Number (E.164 / Int.)', '(?:\\+?\\d{1,3}[\\s-]?)?\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{3,4}'],
  ['PESEL (Polish National ID)', '\\b\\d{2}(?:0[1-9]|1[0-2]|2[1-9]|3[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{5}\\b'],
  ['NIP (Tax Identification)', '\\b(?:\\d{3}-\\d{3}-\\d{2}-\\d{2}|\\d{3}-\\d{2}-\\d{2}-\\d{3}|\\d{10})\\b'],
];

/**
 * Renders the Cheatsheet view.
 */
export function renderCheatsheet() {
  const main = document.getElementById('lesson-content');
  if (!main) return;

  main.innerHTML = `
    <div class="fade-in">
      <div style="margin-bottom:24px;">
        <h1 style="font-family:'Orbitron',sans-serif;font-size:22px;color:var(--accent);margin-bottom:8px;font-weight:700;">
          <i data-lucide="scroll-text" style="width:22px;height:22px;display:inline-block;vertical-align:-3px;margin-right:8px;color:var(--accent);"></i>RegEx Cheatsheet
        </h1>
        <p style="color:var(--text2);font-size:14px;line-height:1.6;">Quick reference guide for JavaScript Regular Expressions and production-ready patterns.</p>
      </div>

      <!-- SEARCH BAR -->
      <div class="cheatsheet-search-wrapper">
        <i data-lucide="search" class="cheatsheet-search-icon"></i>
        <input type="text" id="cs-search" class="cheatsheet-search-input" placeholder="Search tokens, symbols, flags, anchors..." aria-label="Search cheatsheet" oninput="debouncedFilterCheatsheet()">
      </div>

      <div class="cheatsheet-grid">
        ${sections.map(sec => `
          <div class="glass-card cheatsheet-card">
            <div class="cheatsheet-card-header" style="color:var(--${sec.color === 'accent2' ? 'accent' : sec.color === 'text' ? 'text' : sec.color});">
              <span>${sec.title}</span>
            </div>
            <div class="cheatsheet-card-content">
              ${sec.items.map(([sym, desc, disableTest]) => {
                const canTest = !sec.isCodeOnly && !disableTest;
                return `
                <div class="cheatsheet-item">
                  <div class="cheatsheet-item-left">
                    <code class="cheatsheet-item-code">${escapeHtml(sym)}</code>
                    <span class="cheatsheet-item-desc" title="${escapeHtml(desc)}">${escapeHtml(desc)}</span>
                  </div>
                  <div class="cheatsheet-item-actions">
                    <button class="cheatsheet-action-btn copy-btn" title="Copy to clipboard" aria-label="Copy ${escapeHtml(sym)}" data-text="${escapeHtml(sym)}">
                      <i data-lucide="copy" style="width:12px;height:12px;"></i>
                    </button>
                    ${canTest ? `
                    <button class="cheatsheet-action-btn test-btn" title="Test in Playground" aria-label="Test ${escapeHtml(sym)} in Playground" data-pattern="${escapeHtml(sym)}">
                      <i data-lucide="flask-conical" style="width:12px;height:12px;"></i>
                    </button>` : ''}
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>`).join('')}
      </div>

      <!-- MOST POPULAR PATTERNS -->
      <div class="glass-card" id="popular-patterns-section" style="margin-top:28px; padding:24px;">
        <div style="font-family:'Orbitron',sans-serif; font-size:13px; color:var(--amber); text-transform:uppercase; letter-spacing:1px; margin-bottom:16px; display:flex; align-items:center; gap:8px; font-weight:700;">
          <i data-lucide="star" style="width:15px;height:15px;color:var(--amber);"></i> Production-Ready Patterns
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap:12px;">
          ${POPULAR_PATTERNS.map(([name, pat]) => {
            return `
            <div class="popular-pattern-card" style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 16px; background:var(--surface2-solid); border:1px solid var(--border); border-radius:8px; transition:all 0.2s;">
               <div style="min-width:0; flex:1;">
                <span class="popular-pattern-name" style="color:var(--text3); font-size:11px; text-transform:uppercase; font-family:'Orbitron',sans-serif; letter-spacing:0.5px; font-weight:600; display:block; margin-bottom:4px;">${escapeHtml(name)}</span>
                <code class="popular-pattern-code" style="color:var(--accent); font-size:12px; font-family:'JetBrains Mono',monospace; word-break:break-all; display:block;">${escapeHtml(pat)}</code>
              </div>
              <div style="display:flex; gap:6px;">
                <button class="btn btn-ghost copy-btn" style="padding:6px; border-radius:6px;" title="Copy pattern" aria-label="Copy ${escapeHtml(name)}" data-text="${escapeHtml(pat)}">
                  <i data-lucide="copy" style="width:13px;height:13px;"></i>
                </button>
                <button class="btn btn-ghost test-btn" style="padding:6px; border-radius:6px;" title="Test in Playground" aria-label="Test ${escapeHtml(name)} in Playground" data-pattern="${escapeHtml(pat)}">
                  <i data-lucide="flask-conical" style="width:13px;height:13px;"></i>
                </button>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;

  // Attach event handlers cleanly
  main.querySelectorAll('.copy-btn').forEach(btn => {
    btn.onclick = () => copyPattern(btn.dataset.text);
  });
  main.querySelectorAll('.test-btn').forEach(btn => {
    btn.onclick = () => testPattern(btn.dataset.pattern);
  });

  lucide.createIcons();
}

/**
 * Filter the cheatsheet based on the search input query.
 */
export function filterCheatsheet() {
  const searchInput = document.getElementById('cs-search');
  if (!searchInput) return;
  const query = searchInput.value.toLowerCase().trim();

  // 1. Filter regular cheatsheet cards
  const cards = document.querySelectorAll('.cheatsheet-grid .cheatsheet-card');
  cards.forEach(card => {
    const headerEl = card.querySelector('.cheatsheet-card-header');
    if (!headerEl) return;

    const cardTitle = headerEl.textContent.toLowerCase();
    const items = card.querySelectorAll('.cheatsheet-item');
    let cardHasMatches = cardTitle.includes(query);

    items.forEach(item => {
      const codeEl = item.querySelector('.cheatsheet-item-code');
      const descEl = item.querySelector('.cheatsheet-item-desc');
      if (!codeEl || !descEl) return;

      const code = codeEl.textContent.toLowerCase();
      const desc = descEl.textContent.toLowerCase();
      const itemMatches = code.includes(query) || desc.includes(query);

      item.style.display = (query === '' || itemMatches) ? '' : 'none';
      if (itemMatches) {
        cardHasMatches = true;
      }
    });

    card.style.display = (query === '' || cardHasMatches) ? '' : 'none';
  });

  // 2. Filter popular patterns
  const popularCards = document.querySelectorAll('.popular-pattern-card');
  let visiblePopularCount = 0;
  popularCards.forEach(card => {
    const nameEl = card.querySelector('.popular-pattern-name');
    const codeEl = card.querySelector('.popular-pattern-code');
    if (!nameEl || !codeEl) return;

    const name = nameEl.textContent.toLowerCase();
    const code = codeEl.textContent.toLowerCase();
    const matches = name.includes(query) || code.includes(query);

    card.style.display = (query === '' || matches) ? '' : 'none';
    if (query === '' || matches) {
      visiblePopularCount++;
    }
  });

  const popularSection = document.getElementById('popular-patterns-section');
  if (popularSection) {
    popularSection.style.display = (query === '' || visiblePopularCount > 0) ? '' : 'none';
  }
}

export const debouncedFilterCheatsheet = debounce(filterCheatsheet, 100);

/**
 * Copy text to clipboard and show toast feedback.
 */
export function copyPattern(text) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.background = 'var(--green)';
    toast.style.color = '#03070c';
    toast.style.padding = '10px 18px';
    toast.style.borderRadius = '8px';
    toast.style.fontFamily = 'Plus Jakarta Sans, sans-serif';
    toast.style.fontSize = '13px';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 8px 24px rgba(0, 255, 136, 0.25)';
    toast.style.zIndex = '9999';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.innerHTML = `<i data-lucide="check" style="width:14px;height:14px;"></i> Copied to clipboard!`;

    document.body.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  });
}

/**
 * Transfer a pattern to the playground and switch view.
 */
export function testPattern(pat) {
  if (window.setView) {
    window.setView('playground');
  }
  const patInput = document.getElementById('pg-pattern');
  const flagsInput = document.getElementById('pg-flags');
  if (patInput) patInput.value = pat;
  if (flagsInput) flagsInput.value = 'g';
  if (window.runPlayground) window.runPlayground();
}

// Bind to window for HTML inline event handlers
window.renderCheatsheet = renderCheatsheet;
window.filterCheatsheet = filterCheatsheet;
window.debouncedFilterCheatsheet = debouncedFilterCheatsheet;
window.copyPattern = copyPattern;
window.testPattern = testPattern;
