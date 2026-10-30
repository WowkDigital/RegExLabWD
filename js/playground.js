import { escapeHtml, debounce, generateCodeSnippet, renderFlagButtonsHtml, explainRegex } from './utils.js';

let activePlaygroundTab = 'matches'; // 'matches' | 'replace'
let currentCodeExportLang = 'javascript';

/**
 * Helper to highlight a single match, wrapping internal capturing groups in colored spans.
 */
function highlightMatchWithGroups(match) {
  const matchText = match[0];

  if (!matchText || matchText.length === 0) {
    return `<mark class="match-highlight zero-width-match" title="Zero-length match"></mark>`;
  }

  if (!match.indices || match.indices.length <= 1) {
    return `<mark class="match-highlight">${escapeHtml(matchText)}</mark>`;
  }

  const matchStart = match.index;
  const charTags = Array.from({ length: matchText.length }, () => ({ open: '', close: '' }));

  for (let g = 1; g < match.indices.length; g++) {
    const range = match.indices[g];
    if (!range) continue;

    const startInMatch = range[0] - matchStart;
    const endInMatch = range[1] - matchStart;

    if (startInMatch >= 0 && endInMatch <= matchText.length && endInMatch > startInMatch) {
      charTags[startInMatch].open += `<span class="group-highlight-${g % 5}" title="Group ${g}">`;
      charTags[endInMatch - 1].close = `</span>` + charTags[endInMatch - 1].close;
    }
  }

  let result = '';
  for (let i = 0; i < matchText.length; i++) {
    result += charTags[i].open + escapeHtml(matchText[i]) + charTags[i].close;
  }

  return `<mark class="match-highlight group-highlight-0">${result}</mark>`;
}

/**
 * Highlight matches across the entire text using group indices.
 */
function highlightAllPlaygroundMatches(text, re) {
  const parts = [];
  let lastIdx = 0;
  let m;

  const flags = re.flags.includes('g') ? re.flags : re.flags + 'g';
  const safeFlags = flags.includes('d') ? flags : flags + 'd';

  let safeRe;
  try {
    safeRe = new RegExp(re.source, safeFlags);
  } catch (e) {
    safeRe = re;
  }

  safeRe.lastIndex = 0;
  let count = 0;

  while ((m = safeRe.exec(text)) !== null && count < 300) {
    if (m.index > lastIdx) {
      parts.push(escapeHtml(text.slice(lastIdx, m.index)));
    }

    parts.push(highlightMatchWithGroups(m));
    lastIdx = m.index + m[0].length;

    if (m[0].length === 0) {
      safeRe.lastIndex = m.index + 1;
    }

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

const QUICK_PATTERNS = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'gi' },
  { label: 'URL', pattern: 'https?:\\/\\/[\\w.-]+(?:\\/[\\S]*)?', flags: 'gi' },
  { label: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
  { label: 'Hex Color', pattern: '#[0-9a-fA-F]{3,6}', flags: 'gi' },
  { label: 'ISO Date', pattern: '\\d{4}-\\d{2}-\\d{2}', flags: 'g' },
  { label: 'Word (5+ chars)', pattern: '\\b\\w{5,}\\b', flags: 'g' }
];

/**
 * Renders the Playground view.
 */
export function renderPlayground() {
  const main = document.getElementById('lesson-content');
  if (!main) return;

  const isSimplified = localStorage.getItem('regex_simplified') !== 'false';
  const initialFlags = 'g';

  main.innerHTML = `
    <div class="fade-in">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
        <div>
          <h1 style="font-family:'Orbitron',sans-serif;font-size:22px;color:var(--accent);margin-bottom:6px;font-weight:700;">
            <i data-lucide="flask-conical" style="width:22px;height:22px;display:inline-block;vertical-align:-3px;margin-right:8px;color:var(--accent);"></i>RegEx Playground & Laboratory
          </h1>
          <p style="color:var(--text2);font-size:14px;line-height:1.6;">Live pattern tester with interactive flag buttons, real-time syntax color highlighting, string substitution preview, ReDoS latency profiler, and code exporter.</p>
        </div>

        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost" onclick="openCodeExportModal()" style="font-size:12px;display:flex;align-items:center;gap:6px;color:var(--accent);">
            <i data-lucide="code" style="width:14px;height:14px;"></i> Export as Code
          </button>
        </div>
      </div>

      <div class="playground-grid">
        <!-- LEFT COLUMN: INPUTS -->
        <div class="playground-column">
          <div class="glass-card" style="padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <label for="pg-pattern" class="exercise-label" style="margin-bottom:0;">RegEx Pattern</label>
              <span style="font-size:10px;color:var(--text3);">Hover tokens to inspect relationship</span>
            </div>

            <!-- REGEX PATTERN INPUT -->
            <div class="pattern-wrapper" id="pg-wrap" style="margin-bottom:8px;">
              <span class="slash">/</span>
              <input type="text" id="pg-pattern" class="pattern-input" placeholder="enter regular expression..." aria-label="Regular expression pattern" oninput="debouncedRunPlayground()">
              <span class="slash">/</span>
              <input type="hidden" id="pg-flags" value="${initialFlags}">
            </div>

            <!-- SYNTAX TOKEN MIRROR RIBBON -->
            <div id="pg-syntax-mirror" class="pattern-syntax-mirror" style="display:none;margin-bottom:8px;"></div>

            <!-- INTERACTIVE FLAG BUTTONS BAR [[Icon] [Flag]] -->
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
              <span style="font-size:11px;color:var(--text3);font-family:'Orbitron',sans-serif;font-weight:700;">Flags:</span>
              ${renderFlagButtonsHtml(initialFlags, 'pg', 'togglePlaygroundFlag', ['g', 'i', 'm', 's', 'u', 'y', 'd'], isSimplified)}
            </div>

            <div id="pg-error" style="font-size:12px;color:var(--red);margin-top:4px;min-height:16px;font-family:'JetBrains Mono',monospace;"></div>

            <!-- REAL-TIME EXPLAINER WITH HOVER LINKING -->
            <div id="pg-explainer" style="display:none;" class="regex-explainer-box"></div>

            <!-- REPLACEMENT STRING INPUT -->
            <div style="margin-top:14px;">
              <label for="pg-replacement" class="exercise-label" style="display:flex;justify-content:space-between;">
                <span>Replacement String (Substitution)</span>
                <span style="font-size:10px;color:var(--text3);text-transform:none;">Use $1, $2 or $&</span>
              </label>
              <div class="pattern-wrapper" style="margin-bottom:4px;">
                <input type="text" id="pg-replacement" class="pattern-input" placeholder="e.g. [$1] or $<name>" aria-label="Replacement template string" oninput="debouncedRunPlayground()" style="padding:8px 12px;font-family:'JetBrains Mono',monospace;">
              </div>
            </div>
            
            <div style="margin-top:16px;">
              <div class="exercise-label">Quick Templates</div>
              <div class="quick-patterns-container" id="quick-patterns-box"></div>
            </div>
          </div>

          <div class="glass-card" style="padding:20px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <label for="pg-text" class="exercise-label" style="margin-bottom:0;">Target Text Stream</label>
              <button class="btn btn-ghost" style="font-size:11px;padding:4px 8px;border-radius:4px;" onclick="clearPlaygroundText()" aria-label="Clear test text">
                Clear
              </button>
            </div>
            <textarea id="pg-text" class="test-textarea" rows="8" oninput="debouncedRunPlayground()" placeholder="Enter text to test..." aria-label="Test text">The quick brown fox jumps over the lazy dog.
Pack my box with five dozen liquor jugs.
Contact: netrunner.zero@subgrid.io, tel: +48 555-0199.
Payload tag: #00e5ff (timestamp: 2026-10-30).</textarea>
          </div>
        </div>

        <!-- RIGHT COLUMN: RESULTS -->
        <div class="playground-column">
          <div class="glass-card" style="padding:20px;">
            <div class="playground-tab-bar">
              <button class="pg-sub-tab ${activePlaygroundTab === 'matches' ? 'active' : ''}" onclick="switchPlaygroundTab('matches')">
                <i data-lucide="eye" style="width:12px;height:12px;display:inline-block;vertical-align:-1px;"></i> Matches & Groups
              </button>
              <button class="pg-sub-tab ${activePlaygroundTab === 'replace' ? 'active' : ''}" onclick="switchPlaygroundTab('replace')">
                <i data-lucide="replace" style="width:12px;height:12px;display:inline-block;vertical-align:-1px;"></i> Replace Output
              </button>
            </div>

            <!-- METRICS BAR -->
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
              <div id="pg-match-info"></div>
              <div id="pg-benchmark-info"></div>
            </div>

            <!-- TAB 1: MATCHES -->
            <div id="pg-tab-matches" style="${activePlaygroundTab === 'matches' ? 'display:block;' : 'display:none;'}">
              <div class="test-display" id="pg-display" style="min-height:120px;"></div>
            </div>

            <!-- TAB 2: REPLACEMENT -->
            <div id="pg-tab-replace" style="${activePlaygroundTab === 'replace' ? 'display:block;' : 'display:none;'}">
              <div class="test-display" id="pg-replace-display" style="min-height:120px;color:var(--green);"></div>
            </div>
          </div>

          <div class="glass-card" id="pg-groups" style="display:none;padding:20px;">
            <div class="exercise-label">Capturing Groups Breakdown</div>
            <div id="pg-groups-list" class="group-caps-container"></div>
          </div>
        </div>
      </div>

      <!-- MODAL CONTAINER FOR CODE EXPORT -->
      <div id="code-export-modal" style="display:none;"></div>
    </div>`;

  const qBox = document.getElementById('quick-patterns-box');
  if (qBox) {
    qBox.innerHTML = '';
    QUICK_PATTERNS.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-ghost quick-pattern-btn';
      btn.textContent = item.label;
      btn.onclick = () => loadQuickPattern(item.pattern, item.flags);
      qBox.appendChild(btn);
    });
  }

  lucide.createIcons();
  runPlayground();
}

/**
 * Toggles an individual flag for the playground input via button click [[Icon] [Flag]].
 */
export function togglePlaygroundFlag(scope, flag) {
  const flagsInput = document.getElementById('pg-flags');
  if (!flagsInput) return;

  let current = flagsInput.value || '';
  if (current.includes(flag)) {
    current = current.replace(new RegExp(flag, 'g'), '');
  } else {
    current += flag;
  }
  flagsInput.value = current;

  const btn = document.getElementById(`flag-btn-pg-${flag}`);
  if (btn) {
    const isActive = current.includes(flag);
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  }

  runPlayground();
}

export function highlightPlaygroundToken(tokenIdx) {
  const mirror = document.getElementById('pg-syntax-mirror');
  const explainer = document.getElementById('pg-explainer');
  if (mirror) {
    const el = mirror.querySelector(`[data-tok-idx="${tokenIdx}"]`);
    if (el) el.classList.add('linked-active');
  }
  if (explainer) {
    const el = explainer.querySelector(`[data-tok-idx="${tokenIdx}"]`);
    if (el) el.classList.add('linked-active');
  }
}

export function unhighlightPlaygroundToken() {
  const mirror = document.getElementById('pg-syntax-mirror');
  const explainer = document.getElementById('pg-explainer');
  if (mirror) {
    mirror.querySelectorAll('.linked-active').forEach(el => el.classList.remove('linked-active'));
  }
  if (explainer) {
    explainer.querySelectorAll('.linked-active').forEach(el => el.classList.remove('linked-active'));
  }
}

export function switchPlaygroundTab(tab) {
  activePlaygroundTab = tab;
  const tabMatches = document.getElementById('pg-tab-matches');
  const tabReplace = document.getElementById('pg-tab-replace');
  document.querySelectorAll('.pg-sub-tab').forEach((b, i) => {
    b.classList.toggle('active', (tab === 'matches' && i === 0) || (tab === 'replace' && i === 1));
  });

  if (tabMatches && tabReplace) {
    tabMatches.style.display = tab === 'matches' ? 'block' : 'none';
    tabReplace.style.display = tab === 'replace' ? 'block' : 'none';
  }
}

export function loadQuickPattern(pat, flags) {
  const patInput = document.getElementById('pg-pattern');
  const flagsInput = document.getElementById('pg-flags');
  if (patInput) patInput.value = pat;
  if (flagsInput) {
    flagsInput.value = flags;
    ['g', 'i', 'm', 's', 'u', 'y', 'd'].forEach(f => {
      const btn = document.getElementById(`flag-btn-pg-${f}`);
      if (btn) {
        const isActive = flags.includes(f);
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
      }
    });
  }
  runPlayground();
}

export function clearPlaygroundText() {
  const textEl = document.getElementById('pg-text');
  if (textEl) {
    textEl.value = '';
    runPlayground();
  }
}

/**
 * Runs evaluation with performance profiler, syntax mirror, and live explainer.
 */
export function runPlayground() {
  const patternEl = document.getElementById('pg-pattern');
  const flagsEl = document.getElementById('pg-flags');
  const textEl = document.getElementById('pg-text');
  const replacementEl = document.getElementById('pg-replacement');
  const display = document.getElementById('pg-display');
  const replaceDisplay = document.getElementById('pg-replace-display');
  const errorEl = document.getElementById('pg-error');
  const matchInfo = document.getElementById('pg-match-info');
  const benchmarkInfo = document.getElementById('pg-benchmark-info');
  const wrap = document.getElementById('pg-wrap');
  const mirrorBox = document.getElementById('pg-syntax-mirror');
  const explainerBox = document.getElementById('pg-explainer');

  if (!patternEl || !flagsEl || !textEl || !display) return;

  const pattern = patternEl.value;
  const flags = flagsEl.value;
  const text = textEl.value;
  const replacement = replacementEl ? replacementEl.value : '';

  // Render Syntax Mirror & Explainer
  if (pattern) {
    const tokens = explainRegex(pattern);
    if (mirrorBox) {
      mirrorBox.style.display = 'flex';
      mirrorBox.innerHTML = tokens.map((t, tIdx) => `
        <span class="mirror-token tok-${t.type}" 
          data-tok-idx="${tIdx}" 
          onmouseenter="highlightPlaygroundToken(${tIdx})" 
          onmouseleave="unhighlightPlaygroundToken()"
          title="${t.typeLabel}: ${escapeHtml(t.desc)}">
          ${escapeHtml(t.raw)}
        </span>
      `).join('');
    }

    if (explainerBox) {
      explainerBox.style.display = 'flex';
      explainerBox.innerHTML = `
        <div class="explainer-title">
          <i data-lucide="terminal" style="width:11px;height:11px;"></i> Live Pattern Structure Analysis
        </div>
        <div class="explainer-tokens-flow">
          ${tokens.map((t, tIdx) => `
            <div class="explainer-token-pill tok-${t.type}" 
              data-tok-idx="${tIdx}"
              onmouseenter="highlightPlaygroundToken(${tIdx})" 
              onmouseleave="unhighlightPlaygroundToken()">
              <span class="token-type-tag">${t.typeLabel}</span>
              <span class="token-raw">${escapeHtml(t.raw)}</span>
              <span class="token-desc">${escapeHtml(t.desc)}</span>
            </div>
          `).join('')}
        </div>
      `;
      lucide.createIcons();
    }
  } else {
    if (mirrorBox) mirrorBox.style.display = 'none';
    if (explainerBox) explainerBox.style.display = 'none';
  }

  if (!pattern) {
    display.innerHTML = escapeHtml(text);
    if (replaceDisplay) replaceDisplay.textContent = text;
    if (errorEl) errorEl.textContent = '';
    if (matchInfo) matchInfo.innerHTML = '';
    if (benchmarkInfo) benchmarkInfo.innerHTML = '';
    if (wrap) wrap.classList.remove('error');
    const groupsEl = document.getElementById('pg-groups');
    if (groupsEl) groupsEl.style.display = 'none';
    return;
  }

  let re;
  const tStart = performance.now();

  try {
    const safeFlags = flags.includes('d') ? flags : flags + 'd';
    re = new RegExp(pattern, safeFlags);
    if (errorEl) errorEl.textContent = '';
    if (wrap) wrap.classList.remove('error');
  } catch (e) {
    if (errorEl) {
      errorEl.innerHTML = `<span style="display:flex;align-items:center;gap:4px;"><i data-lucide="alert-triangle" style="width:12px;height:12px;"></i> ${escapeHtml(e.message)}</span>`;
      lucide.createIcons();
    }
    if (wrap) wrap.classList.add('error');
    display.innerHTML = escapeHtml(text);
    if (replaceDisplay) replaceDisplay.textContent = text;
    const groupsEl = document.getElementById('pg-groups');
    if (groupsEl) groupsEl.style.display = 'none';
    if (benchmarkInfo) benchmarkInfo.innerHTML = '';
    return;
  }

  display.innerHTML = highlightAllPlaygroundMatches(text, re);

  // Replacement preview
  if (replaceDisplay) {
    try {
      const repRe = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      replaceDisplay.textContent = text.replace(repRe, replacement);
    } catch {
      replaceDisplay.textContent = text;
    }
  }

  const safeFlags = flags.includes('g') ? flags : flags + 'g';
  const matchFlags = safeFlags.includes('d') ? safeFlags : safeFlags + 'd';
  let allMatches = [];
  try {
    allMatches = [...text.matchAll(new RegExp(re.source, matchFlags))];
  } catch (e) {
    // Fallback
  }

  const tEnd = performance.now();
  const latency = (tEnd - tStart).toFixed(2);

  if (benchmarkInfo) {
    const isSlow = latency > 15;
    benchmarkInfo.innerHTML = `
      <span class="benchmark-badge" style="${isSlow ? 'color:var(--amber);border-color:var(--amber);' : ''}">
        <i data-lucide="${isSlow ? 'alert-triangle' : 'zap'}" style="width:11px;height:11px;"></i>
        ${latency} ms ${isSlow ? '(high backtracking)' : ''}
      </span>
    `;
    lucide.createIcons();
  }

  if (matchInfo) {
    matchInfo.innerHTML = allMatches.length > 0
      ? `<span class="match-badge">${allMatches.length} match${allMatches.length === 1 ? '' : 'es'}</span>`
      : `<span class="match-badge no-match">No matches</span>`;
  }

  // Capturing groups
  const hasGroups = allMatches.some(m => m.length > 1 || m.groups);
  const groupsEl = document.getElementById('pg-groups');
  const groupsList = document.getElementById('pg-groups-list');

  if (groupsEl && groupsList) {
    if (hasGroups && allMatches.length > 0) {
      groupsEl.style.display = 'block';
      let html = '';
      allMatches.slice(0, 15).forEach((m, i) => {
        html += `<div class="group-cap-item">`;
        html += `<span style="color:var(--text3);font-weight:600;">Match ${i + 1}:</span> <span style="color:var(--accent);font-family:'JetBrains Mono',monospace;font-weight:600;">"${escapeHtml(m[0])}"</span>`;
        for (let g = 1; g < m.length; g++) {
          const val = m[g] !== undefined ? `"${escapeHtml(m[g])}"` : `<span style="color:var(--text3);font-style:italic;">undefined</span>`;
          html += `<div style="margin-left:16px;margin-top:4px;display:flex;align-items:center;gap:6px;">
            <span class="difficulty-badge badge-expert" style="padding:1px 4px;font-size:8px;background:rgba(191,85,236,0.08);border-color:rgba(191,85,236,0.2);color:var(--purple);">G${g}</span> 
            <span style="font-family:'JetBrains Mono',monospace;color:var(--green);font-weight:500;">${val}</span>
          </div>`;
        }
        if (m.groups) {
          Object.entries(m.groups).forEach(([k, v]) => {
            const val = v !== undefined ? `"${escapeHtml(v)}"` : `<span style="color:var(--text3);font-style:italic;">undefined</span>`;
            html += `<div style="margin-left:16px;margin-top:4px;display:flex;align-items:center;gap:6px;">
              <span class="difficulty-badge badge-intermediate" style="padding:1px 4px;font-size:8px;background:rgba(255,179,0,0.08);border-color:rgba(255,179,0,0.2);color:var(--amber);">N:${escapeHtml(k)}</span> 
              <span style="font-family:'JetBrains Mono',monospace;color:var(--purple);font-weight:500;">${val}</span>
            </div>`;
          });
        }
        html += '</div>';
      });
      if (allMatches.length > 15) {
        html += `<div style="color:var(--text3);font-size:12px;text-align:center;margin-top:8px;font-family:'Plus Jakarta Sans',sans-serif;">... and ${allMatches.length - 15} more matches</div>`;
      }
      groupsList.innerHTML = html;
    } else {
      groupsEl.style.display = 'none';
    }
  }
}

export const debouncedRunPlayground = debounce(runPlayground, 100);

// ============================================================
// CODE EXPORT MODAL
// ============================================================
export function openCodeExportModal() {
  const modal = document.getElementById('code-export-modal');
  if (!modal) return;

  const patternEl = document.getElementById('pg-pattern');
  const flagsEl = document.getElementById('pg-flags');
  const pat = patternEl ? patternEl.value : '';
  const flags = flagsEl ? flagsEl.value : '';

  renderCodeModalContent(pat, flags, currentCodeExportLang);
  modal.style.display = 'block';
  lucide.createIcons();
}

export function closeCodeExportModal() {
  const modal = document.getElementById('code-export-modal');
  if (modal) modal.style.display = 'none';
}

export function selectExportLanguage(lang) {
  currentCodeExportLang = lang;
  const patternEl = document.getElementById('pg-pattern');
  const flagsEl = document.getElementById('pg-flags');
  renderCodeModalContent(patternEl ? patternEl.value : '', flagsEl ? flagsEl.value : '', lang);
  lucide.createIcons();
}

function renderCodeModalContent(pattern, flags, lang) {
  const modal = document.getElementById('code-export-modal');
  if (!modal) return;

  const snippet = generateCodeSnippet(pattern, flags, lang);
  const languages = [
    { id: 'javascript', name: 'JavaScript / TS' },
    { id: 'python', name: 'Python' },
    { id: 'php', name: 'PHP' },
    { id: 'go', name: 'Go' },
    { id: 'java', name: 'Java' }
  ];

  modal.innerHTML = `
    <div class="code-export-modal" onclick="if(event.target===this)closeCodeExportModal()">
      <div class="code-export-dialog">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h3 style="font-family:'Orbitron',sans-serif;color:var(--accent);font-size:16px;font-weight:700;display:flex;align-items:center;gap:8px;">
            <i data-lucide="code" style="width:18px;height:18px;"></i> Export Pattern as Code
          </h3>
          <button class="btn btn-ghost" onclick="closeCodeExportModal()" style="padding:4px 8px;display:flex;align-items:center;" aria-label="Close modal">
            <i data-lucide="x" style="width:14px;height:14px;"></i>
          </button>
        </div>

        <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">
          ${languages.map(l => `
            <button class="btn ${l.id === lang ? 'btn-primary' : 'btn-ghost'}" style="font-size:11px;padding:6px 12px;" onclick="selectExportLanguage('${l.id}')">
              ${l.name}
            </button>
          `).join('')}
        </div>

        <div style="position:relative;margin-bottom:16px;">
          <pre style="background:var(--surface3-solid);border:1px solid var(--border);border-radius:8px;padding:16px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:12px;overflow-x:auto;max-height:280px;line-height:1.6;">${escapeHtml(snippet)}</pre>
          <button class="btn btn-primary" onclick="copySnippetToClipboard()" style="position:absolute;top:10px;right:10px;font-size:11px;padding:4px 8px;display:flex;align-items:center;gap:4px;">
            <i data-lucide="copy" style="width:12px;height:12px;"></i> Copy
          </button>
        </div>

        <div style="display:flex;justify-content:flex-end;">
          <button class="btn btn-ghost" onclick="closeCodeExportModal()">Close</button>
        </div>
      </div>
    </div>
  `;
}

export function copySnippetToClipboard() {
  const patternEl = document.getElementById('pg-pattern');
  const flagsEl = document.getElementById('pg-flags');
  const snippet = generateCodeSnippet(patternEl ? patternEl.value : '', flagsEl ? flagsEl.value : '', currentCodeExportLang);
  navigator.clipboard.writeText(snippet).then(() => {
    alert('Code snippet copied to clipboard!');
  });
}

// Bind to window
window.renderPlayground = renderPlayground;
window.togglePlaygroundFlag = togglePlaygroundFlag;
window.highlightPlaygroundToken = highlightPlaygroundToken;
window.unhighlightPlaygroundToken = unhighlightPlaygroundToken;
window.switchPlaygroundTab = switchPlaygroundTab;
window.loadQuickPattern = loadQuickPattern;
window.clearPlaygroundText = clearPlaygroundText;
window.runPlayground = runPlayground;
window.debouncedRunPlayground = debouncedRunPlayground;
window.openCodeExportModal = openCodeExportModal;
window.closeCodeExportModal = closeCodeExportModal;
window.selectExportLanguage = selectExportLanguage;
window.copySnippetToClipboard = copySnippetToClipboard;
