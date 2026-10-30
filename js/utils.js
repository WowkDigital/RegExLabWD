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

// ============================================================
// FLAG DEFINITIONS & UI GENERATOR [[Icon] [Flag]]
// ============================================================
export const AVAILABLE_FLAGS = [
  { flag: 'g', icon: 'globe', name: 'Global', desc: 'Match all occurrences across text' },
  { flag: 'i', icon: 'type', name: 'Case-Insensitive', desc: 'Ignore uppercase vs lowercase' },
  { flag: 'm', icon: 'align-left', name: 'Multiline', desc: '^ and $ match line boundaries' },
  { flag: 's', icon: 'sparkles', name: 'DotAll', desc: 'Dot (.) matches newlines too' },
  { flag: 'u', icon: 'languages', name: 'Unicode', desc: 'Enable full Unicode handling' },
  { flag: 'y', icon: 'pin', name: 'Sticky', desc: 'Match strictly at current lastIndex' },
  { flag: 'd', icon: 'hash', name: 'Indices', desc: 'Expose start/end match slice indices' }
];

export function renderFlagButtonsHtml(activeFlags = '', scope = '', onToggleFnName = 'toggleFlag', allowedFlags = ['g', 'i', 'm', 's', 'u'], showLabels = true) {
  const filtered = AVAILABLE_FLAGS.filter(f => allowedFlags.includes(f.flag));
  
  let html = `<div class="flags-button-group" id="flags-group-${scope}">`;
  filtered.forEach(f => {
    const isActive = activeFlags.includes(f.flag);
    html += `
      <button type="button" 
        class="flag-btn ${isActive ? 'active' : ''}" 
        id="flag-btn-${scope}-${f.flag}"
        onclick="${onToggleFnName}('${scope}', '${f.flag}')" 
        title="${f.name} (${f.flag}): ${f.desc}"
        aria-pressed="${isActive}"
        aria-label="Flag ${f.flag}: ${f.name}">
        <i data-lucide="${f.icon}"></i>
        <span class="flag-char">${f.flag}</span>
        ${showLabels ? `<span class="flag-label">${f.name}</span>` : ''}
      </button>
    `;
  });
  html += `</div>`;
  return html;
}

// ============================================================
// AUDIO SFX ENGINE (Web Audio API Synthesizer)
// ============================================================
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isAudioMuted() {
  return localStorage.getItem('regex_muted') === 'true';
}

export function setAudioMuted(muted) {
  localStorage.setItem('regex_muted', muted ? 'true' : 'false');
}

export function playSuccessChime() {
  if (isAudioMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Oscillator 1 (D5 ~ 587 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Oscillator 2 harmonic shimmer (E6 ~ 1318 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1174.66, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.25);
    
    gain2.gain.setValueAtTime(0, now + 0.08);
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.08);
    osc2.stop(now + 0.4);
  } catch (e) {
    // Audio context may be blocked by autoplay policies
  }
}

// ============================================================
// REAL-TIME REGEX EXPLAINER / PARSER WITH SEMANTIC TYPES
// ============================================================
/**
 * Analyzes regex tokens and returns human-readable breakdowns with semantic color types.
 * @param {string} pattern 
 * @returns {Array<{raw: string, desc: string, type: string, typeLabel: string}>}
 */
export function explainRegex(pattern) {
  if (!pattern) return [];
  const tokens = [];
  let i = 0;
  const len = pattern.length;

  while (i < len && tokens.length < 20) {
    const ch = pattern[i];

    if (ch === '^') {
      tokens.push({ raw: '^', desc: 'Line / string start anchor', type: 'anchor', typeLabel: 'Anchor' });
      i++;
    } else if (ch === '$') {
      tokens.push({ raw: '$', desc: 'Line / string end anchor', type: 'anchor', typeLabel: 'Anchor' });
      i++;
    } else if (ch === '.') {
      tokens.push({ raw: '.', desc: 'Any character wildcard (except newline)', type: 'class', typeLabel: 'Wildcard' });
      i++;
    } else if (ch === '\\') {
      const next = pattern[i + 1] || '';
      const pair = '\\' + next;
      const shorthands = {
        '\\d': { desc: 'Digit [0-9]', type: 'class', label: 'Digit' },
        '\\D': { desc: 'Non-digit [^0-9]', type: 'class', label: 'Non-Digit' },
        '\\w': { desc: 'Word character [a-zA-Z0-9_]', type: 'class', label: 'Word' },
        '\\W': { desc: 'Non-word character', type: 'class', label: 'Non-Word' },
        '\\s': { desc: 'Whitespace (space, tab, nl)', type: 'class', label: 'Whitespace' },
        '\\S': { desc: 'Non-whitespace character', type: 'class', label: 'Non-Space' },
        '\\b': { desc: 'Word boundary transition', type: 'anchor', label: 'Boundary' },
        '\\B': { desc: 'Non-word boundary transition', type: 'anchor', label: 'Non-Bound' },
        '\\n': { desc: 'Newline character', type: 'class', label: 'Newline' },
        '\\t': { desc: 'Tab character', type: 'class', label: 'Tab' }
      };

      if (shorthands[pair]) {
        tokens.push({ raw: pair, desc: shorthands[pair].desc, type: shorthands[pair].type, typeLabel: shorthands[pair].label });
        i += 2;
      } else if (/[1-9]/.test(next)) {
        tokens.push({ raw: pair, desc: `Backreference to group #${next}`, type: 'group', typeLabel: 'Backref' });
        i += 2;
      } else {
        tokens.push({ raw: pair, desc: `Escaped literal character "${next}"`, type: 'literal', typeLabel: 'Escape' });
        i += 2;
      }
    } else if (ch === '[') {
      let closeIdx = pattern.indexOf(']', i + 1);
      if (closeIdx === -1) closeIdx = len;
      const classBody = pattern.slice(i, closeIdx + 1);
      const isNeg = classBody.startsWith('[^');
      tokens.push({
        raw: classBody,
        desc: isNeg ? 'Negated character set (match any NOT listed)' : 'Character set / range (match one of set)',
        type: 'class',
        typeLabel: isNeg ? 'Neg Set' : 'Char Set'
      });
      i = closeIdx + 1;
    } else if (ch === '(') {
      if (pattern.startsWith('(?:', i)) {
        tokens.push({ raw: '(?:', desc: 'Start non-capturing group', type: 'group', typeLabel: 'Non-Capture' });
        i += 3;
      } else if (pattern.startsWith('(?=', i)) {
        tokens.push({ raw: '(?=', desc: 'Start positive lookahead', type: 'lookaround', typeLabel: 'Lookahead +' });
        i += 3;
      } else if (pattern.startsWith('(?!', i)) {
        tokens.push({ raw: '(?!', desc: 'Start negative lookahead', type: 'lookaround', typeLabel: 'Lookahead -' });
        i += 3;
      } else if (pattern.startsWith('(?<=', i)) {
        tokens.push({ raw: '(?<=', desc: 'Start positive lookbehind', type: 'lookaround', typeLabel: 'Lookbehind +' });
        i += 4;
      } else if (pattern.startsWith('(?<!', i)) {
        tokens.push({ raw: '(?<!', desc: 'Start negative lookbehind', type: 'lookaround', typeLabel: 'Lookbehind -' });
        i += 4;
      } else if (pattern.startsWith('(?<', i)) {
        tokens.push({ raw: '(?<name>', desc: 'Start named capturing group', type: 'group', typeLabel: 'Named Group' });
        i += 3;
      } else {
        tokens.push({ raw: '(', desc: 'Start capturing group', type: 'group', typeLabel: 'Group' });
        i++;
      }
    } else if (ch === ')') {
      tokens.push({ raw: ')', desc: 'End group boundary', type: 'group', typeLabel: 'Group End' });
      i++;
    } else if (ch === '|') {
      tokens.push({ raw: '|', desc: 'Logical OR (alternation branch)', type: 'alt', typeLabel: 'Alternation' });
      i++;
    } else if (ch === '*' || ch === '+' || ch === '?') {
      const isLazy = pattern[i + 1] === '?';
      const raw = isLazy ? ch + '?' : ch;
      const descMap = {
        '*': '0 or more times (greedy)',
        '*?': '0 or more times (lazy)',
        '+': '1 or more times (greedy)',
        '+?': '1 or more times (lazy)',
        '?': 'Optional: 0 or 1 time (greedy)',
        '??': 'Optional: 0 or 1 time (lazy)'
      };
      tokens.push({ raw, desc: descMap[raw] || 'Quantifier', type: 'quant', typeLabel: 'Quantifier' });
      i += isLazy ? 2 : 1;
    } else if (ch === '{') {
      let closeIdx = pattern.indexOf('}', i);
      if (closeIdx === -1) closeIdx = len;
      const quant = pattern.slice(i, closeIdx + 1);
      tokens.push({ raw: quant, desc: `Repetition quantifier ${quant}`, type: 'quant', typeLabel: 'Repetition' });
      i = closeIdx + 1;
    } else {
      let lit = ch;
      i++;
      while (i < len && !/[\\^$.*+?()[\]{}|]/.test(pattern[i])) {
        lit += pattern[i];
        i++;
      }
      tokens.push({ raw: lit, desc: `Literal text "${lit}"`, type: 'literal', typeLabel: 'Literal' });
    }
  }

  return tokens;
}

// ============================================================
// CODE GENERATOR FOR MULTIPLE LANGUAGES
// ============================================================
export function generateCodeSnippet(pattern, flags, lang) {
  const p = pattern || '';
  const fl = flags || '';
  
  switch (lang) {
    case 'javascript':
      return `// JavaScript / TypeScript\nconst regex = /${p}/${fl};\nconst text = "Your text here";\n\n// 1. Test presence:\nconst isMatch = regex.test(text);\n\n// 2. Extract matches:\nconst matches = [...text.matchAll(regex)];\nconsole.log(matches);`;
    
    case 'python': {
      const pyFlags = [];
      if (fl.includes('i')) pyFlags.push('re.IGNORECASE');
      if (fl.includes('m')) pyFlags.push('re.MULTILINE');
      if (fl.includes('s')) pyFlags.push('re.DOTALL');
      const flagStr = pyFlags.length > 0 ? ', ' + pyFlags.join(' | ') : '';
      return `# Python 3\nimport re\n\npattern = re.compile(r'${p}'${flagStr})\ntext = "Your text here"\n\n# 1. Find all matches:\nmatches = pattern.findall(text)\nprint(matches)\n\n# 2. Iterate match objects:\nfor match in pattern.finditer(text):\n    print(match.group(0), match.span())`;
    }

    case 'php':
      return `<?php\n// PHP (PCRE)\n$pattern = '/${p.replace(/\//g, '\\/')}/${fl}';\n$text = "Your text here";\n\npreg_match_all($pattern, $text, $matches, PREG_SET_ORDER);\nprint_r($matches);\n?>`;

    case 'go':
      return `package main\n\nimport (\n\t"fmt"\n\t"regexp"\n)\n\nfunc main() {\n\tre := regexp.MustCompile(\`${p}\`)\n\ttext := "Your text here"\n\n\tmatches := re.FindAllString(text, -1)\n\tfmt.Println(matches)\n}`;

    case 'java':
      return `// Java\nimport java.util.regex.*;\n\npublic class RegexExample {\n    public static void main(String[] args) {\n        Pattern pattern = Pattern.compile("${p.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}");\n        Matcher matcher = pattern.matcher("Your text here");\n        \n        while (matcher.find()) {\n            System.out.println("Match: " + matcher.group());\n        }\n    }\n}`;

    default:
      return `/${p}/${fl}`;
  }
}
