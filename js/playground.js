import { escapeHtml } from './utils.js';

/**
 * Helper to highlight a single match, wrapping internal capturing groups in colored spans.
 */
function highlightMatchWithGroups(match) {
  if (!match.indices || match.indices.length <= 1) {
    return `<mark class="match-highlight">${escapeHtml(match[0] || ' ')}</mark>`;
  }
  
  const matchStart = match.index;
  const matchText = match[0];
  const charTags = Array.from({ length: matchText.length }, () => ({ open: '', close: '' }));
  
  // Iterate from group 1 to group N
  for (let g = 1; g < match.indices.length; g++) {
    const range = match.indices[g];
    if (!range) continue;
    
    const startInMatch = range[0] - matchStart;
    const endInMatch = range[1] - matchStart;
    
    // Bounds check
    if (startInMatch >= 0 && endInMatch <= matchText.length) {
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
    lastIdx = safeRe.lastIndex;
    
    if (m[0] === '') {
      safeRe.lastIndex++;
    }
    count++;
  }
  
  if (lastIdx < text.length) {
    parts.push(escapeHtml(text.slice(lastIdx)));
  }
  
  return parts.join('');
}

/**
 * Renders the Playground view.
 */
export function renderPlayground() {
  const main = document.getElementById('lesson-content');
  if (!main) return;

  main.innerHTML = `
    <div class="fade-in">
      <div style="margin-bottom:24px;">
        <h1 style="font-family:'Orbitron',sans-serif;font-size:22px;color:var(--accent);margin-bottom:8px;font-weight:700;">
          <i data-lucide="flask-conical" style="width:22px;height:22px;display:inline-block;vertical-align:-3px;margin-right:8px;color:var(--accent);"></i>RegEx Playground
        </h1>
        <p style="color:var(--text2);font-size:14px;line-height:1.6;">Experiment with your own regular expressions on live text with capturing group highlighting support.</p>
      </div>
 
      <div class="playground-grid">
        <!-- LEFT COLUMN: INPUTS -->
        <div class="playground-column">
          <div class="glass-card" style="padding:20px;">
            <div class="exercise-label">RegEx Pattern</div>
            <div class="pattern-wrapper" id="pg-wrap" style="margin-bottom:8px;">
              <span class="slash">/</span>
              <input type="text" id="pg-pattern" class="pattern-input" placeholder="enter regular expression..." oninput="runPlayground()">
              <span class="slash">/</span>
              <input type="text" id="pg-flags" class="flags" value="g" oninput="runPlayground()" style="width:60px;background:transparent;border:none;outline:none;font-family:inherit;">
            </div>
            <div id="pg-error" style="font-size:12px;color:var(--red);margin-top:4px;min-height:16px;font-family:'JetBrains Mono',monospace;"></div>
            
            <div style="margin-top:16px;">
              <div class="exercise-label">Quick Templates</div>
              <div class="quick-patterns-container">
                ${[
                  ['Email', '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 'gi'],
                  ['URL', 'https?:\\/\\/[\\w.-]+(?:\\/[\\S]*)?', 'gi'],
                  ['IP v4', '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', 'g'],
                  ['Hex Color', '#[0-9a-fA-F]{3,6}', 'gi'],
                  ['ISO Date', '\\d{4}-\\d{2}-\\d{2}', 'g'],
                  ['Word (5+ letters)', '\\b\\w{5,}\\b', 'g'],
                ].map(([label, pat, fl]) => `<button class="btn btn-ghost quick-pattern-btn" onclick="loadQuickPattern('${pat.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}', '${fl}')">
                  ${label}
                </button>`).join('')}
              </div>
            </div>
          </div>
 
          <div class="glass-card" style="padding:20px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <div class="exercise-label" style="margin-bottom:0;">Test Text</div>
              <button class="btn btn-ghost" style="font-size:11px;padding:4px 8px;border-radius:4px;" onclick="clearPlaygroundText()">
                Clear
              </button>
            </div>
            <textarea id="pg-text" class="test-textarea" rows="8" oninput="runPlayground()" placeholder="Enter text to test...">The quick brown fox jumps over the lazy dog.
Pack my box with five dozen liquor jugs.
How vexingly quick daft zebras jump!
The five boxing wizards jump quickly.
Contact: john.doe@domain.com, tel: +1 555-0199.
Promo code: #00e5ff (2026-06-09).</textarea>
          </div>
        </div>

        <!-- RIGHT COLUMN: RESULTS -->
        <div class="playground-column">
          <div class="glass-card" style="padding:20px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
              <div class="exercise-label" style="margin-bottom:0;">Matches Preview</div>
              <div id="pg-match-info"></div>
            </div>
            <div class="test-display" id="pg-display" style="min-height:120px;"></div>
          </div>
 
          <div class="glass-card" id="pg-groups" style="display:none;padding:20px;">
            <div class="exercise-label">Capturing Groups</div>
            <div id="pg-groups-list" class="group-caps-container"></div>
          </div>
        </div>
      </div>
    </div>`;

  lucide.createIcons();
  runPlayground();
}

/**
 * Loads a quick pattern preset into the inputs.
 */
export function loadQuickPattern(pat, flags) {
  const patInput = document.getElementById('pg-pattern');
  const flagsInput = document.getElementById('pg-flags');
  if (patInput) patInput.value = pat;
  if (flagsInput) flagsInput.value = flags;
  runPlayground();
}

/**
 * Clears the playground test textarea.
 */
export function clearPlaygroundText() {
  const textEl = document.getElementById('pg-text');
  if (textEl) {
    textEl.value = '';
    runPlayground();
  }
}

/**
 * Runs the evaluation in real time.
 */
export function runPlayground() {
  const patternEl = document.getElementById('pg-pattern');
  const flagsEl = document.getElementById('pg-flags');
  const textEl = document.getElementById('pg-text');
  const display = document.getElementById('pg-display');
  const errorEl = document.getElementById('pg-error');
  const matchInfo = document.getElementById('pg-match-info');
  const wrap = document.getElementById('pg-wrap');

  if (!patternEl || !flagsEl || !textEl || !display) return;

  const pattern = patternEl.value;
  const flags = flagsEl.value;
  const text = textEl.value;

  if (!pattern) {
    display.innerHTML = escapeHtml(text);
    if (errorEl) errorEl.textContent = '';
    if (matchInfo) matchInfo.innerHTML = '';
    if (wrap) wrap.classList.remove('error');
    const groupsEl = document.getElementById('pg-groups');
    if (groupsEl) groupsEl.style.display = 'none';
    return;
  }

  let re;
  try {
    const safeFlags = flags.includes('d') ? flags : flags + 'd';
    re = new RegExp(pattern, safeFlags);
    if (errorEl) errorEl.textContent = '';
    if (wrap) wrap.classList.remove('error');
  } catch (e) {
    if (errorEl) errorEl.textContent = '⚠ ' + e.message;
    if (wrap) wrap.classList.add('error');
    display.innerHTML = escapeHtml(text);
    const groupsEl = document.getElementById('pg-groups');
    if (groupsEl) groupsEl.style.display = 'none';
    return;
  }

  display.innerHTML = highlightAllPlaygroundMatches(text, re);

  const safeFlags = flags.includes('g') ? flags : flags + 'g';
  const matchFlags = safeFlags.includes('d') ? safeFlags : safeFlags + 'd';
  let allMatches = [];
  try {
    allMatches = [...text.matchAll(new RegExp(re.source, matchFlags))];
  } catch (e) {
    // Fallback if matchAll fails
  }

  if (matchInfo) {
    matchInfo.innerHTML = allMatches.length > 0
      ? `<span class="match-badge">${allMatches.length} match${allMatches.length === 1 ? '' : 'es'}</span>`
      : `<span class="match-badge no-match">No matches</span>`;
  }

  // Show groups
  const hasGroups = allMatches.some(m => m.length > 1);
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
              <span class="difficulty-badge badge-intermediate" style="padding:1px 4px;font-size:8px;background:rgba(255,179,0,0.08);border-color:rgba(255,179,0,0.2);color:var(--amber);">N:${k}</span> 
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

// Bind to window for HTML inline event handlers
window.renderPlayground = renderPlayground;
window.loadQuickPattern = loadQuickPattern;
window.clearPlaygroundText = clearPlaygroundText;
window.runPlayground = runPlayground;
