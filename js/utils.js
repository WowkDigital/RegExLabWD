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

/**
 * Synthesizes a futuristic cyberpunk neon success chime (two-tone rising synth).
 */
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
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // Glides to A5
    
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
// REAL-TIME REGEX EXPLAINER / PARSER
// ============================================================
/**
 * Analyzes regex tokens and returns human-readable breakdowns.
 * @param {string} pattern 
 * @returns {Array<{raw: string, desc: string}>}
 */
export function explainRegex(pattern) {
  if (!pattern) return [];
  const tokens = [];
  let i = 0;
  const len = pattern.length;

  while (i < len && tokens.length < 15) {
    const ch = pattern[i];

    if (ch === '^') {
      tokens.push({ raw: '^', desc: 'Line / string start anchor' });
      i++;
    } else if (ch === '$') {
      tokens.push({ raw: '$', desc: 'Line / string end anchor' });
      i++;
    } else if (ch === '.') {
      tokens.push({ raw: '.', desc: 'Any character wildcard' });
      i++;
    } else if (ch === '\\') {
      const next = pattern[i + 1] || '';
      const pair = '\\' + next;
      const shorthands = {
        '\\d': 'Any digit [0-9]',
        '\\D': 'Any non-digit',
        '\\w': 'Word char [a-zA-Z0-9_]',
        '\\W': 'Non-word char',
        '\\s': 'Whitespace (space, tab, nl)',
        '\\S': 'Non-whitespace',
        '\\b': 'Word boundary position',
        '\\B': 'Non-word boundary',
        '\\n': 'Newline character',
        '\\t': 'Tab character'
      };
      if (shorthands[pair]) {
        tokens.push({ raw: pair, desc: shorthands[pair] });
        i += 2;
      } else if (/[1-9]/.test(next)) {
        tokens.push({ raw: pair, desc: `Backreference to group #${next}` });
        i += 2;
      } else {
        tokens.push({ raw: pair, desc: `Escaped literal "${next}"` });
        i += 2;
      }
    } else if (ch === '[') {
      let closeIdx = pattern.indexOf(']', i + 1);
      if (closeIdx === -1) closeIdx = len;
      const classBody = pattern.slice(i, closeIdx + 1);
      const isNeg = classBody.startsWith('[^');
      tokens.push({
        raw: classBody,
        desc: isNeg ? 'Negated character set' : 'Character set / range'
      });
      i = closeIdx + 1;
    } else if (ch === '(') {
      if (pattern.startsWith('(?:', i)) {
        tokens.push({ raw: '(?:...)', desc: 'Non-capturing group' });
        i += 3;
      } else if (pattern.startsWith('(?=', i)) {
        tokens.push({ raw: '(?=...)', desc: 'Positive lookahead' });
        i += 3;
      } else if (pattern.startsWith('(?!', i)) {
        tokens.push({ raw: '(?!...)', desc: 'Negative lookahead' });
        i += 3;
      } else if (pattern.startsWith('(?<=', i)) {
        tokens.push({ raw: '(?<=...)', desc: 'Positive lookbehind' });
        i += 4;
      } else if (pattern.startsWith('(?<!', i)) {
        tokens.push({ raw: '(?<!...)', desc: 'Negative lookbehind' });
        i += 4;
      } else if (pattern.startsWith('(?<', i)) {
        tokens.push({ raw: '(?<name>...)', desc: 'Named capturing group' });
        i += 3;
      } else {
        tokens.push({ raw: '(...)', desc: 'Capturing group' });
        i++;
      }
    } else if (ch === ')') {
      i++;
    } else if (ch === '|') {
      tokens.push({ raw: '|', desc: 'Logical OR (alternation)' });
      i++;
    } else if (ch === '*' || ch === '+' || ch === '?') {
      const isLazy = pattern[i + 1] === '?';
      const raw = isLazy ? ch + '?' : ch;
      const descMap = {
        '*': '0 or more occurrences (greedy)',
        '*?': '0 or more occurrences (lazy)',
        '+': '1 or more occurrences (greedy)',
        '+?': '1 or more occurrences (lazy)',
        '?': 'Optional: 0 or 1 occurrence',
        '??': 'Optional: 0 or 1 (lazy)'
      };
      tokens.push({ raw, desc: descMap[raw] || 'Quantifier' });
      i += isLazy ? 2 : 1;
    } else if (ch === '{') {
      let closeIdx = pattern.indexOf('}', i);
      if (closeIdx === -1) closeIdx = len;
      const quant = pattern.slice(i, closeIdx + 1);
      tokens.push({ raw: quant, desc: `Repetition quantifier ${quant}` });
      i = closeIdx + 1;
    } else {
      // Gather literal sequence
      let lit = ch;
      i++;
      while (i < len && !/[\\^$.*+?()[\]{}|]/.test(pattern[i])) {
        lit += pattern[i];
        i++;
      }
      tokens.push({ raw: lit, desc: `Literal text "${lit}"` });
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
