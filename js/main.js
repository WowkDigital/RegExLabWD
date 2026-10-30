import { LESSONS, THEMES, setTheme, currentThemeId } from './lessons.js';
import { 
  escapeHtml, 
  highlightMatches, 
  applyRegex, 
  debounce, 
  playSuccessChime, 
  isAudioMuted, 
  setAudioMuted,
  explainRegex
} from './utils.js';
import { renderPlayground } from './playground.js';
import { renderCheatsheet } from './cheatsheet.js';

// ============================================================
// STATE
// ============================================================
let currentLesson = 0;
let currentView = 'lessons';
let learningMode = localStorage.getItem('regex_mode') || 'standard'; // 'standard' | 'deepDive'
let currentAccent = localStorage.getItem('regex_accent') || 'cyan';
let completedLessons = new Set(JSON.parse(localStorage.getItem('regex_completed') || '[]'));
let completedExercises = new Set(JSON.parse(localStorage.getItem('regex_completed_exercises') || '[]'));
let collapsedGroups = new Set();

// ============================================================
// CURRICULUM SECTIONS ARCHITECTURE
// ============================================================
const CURRICULUM_GROUPS = [
  { 
    label: '1. Core Essentials (80% Daily Use)', 
    subtitle: 'Matching, character classes, quantifiers, anchors & groups',
    ids: [0, 1, 2, 3, 4, 5] 
  },
  { 
    label: '2. Extended Toolkit (Advanced)', 
    subtitle: 'Lookarounds, backreferences, flags & string manipulation',
    ids: [6, 7, 8, 10] 
  },
  { 
    label: '3. Specialized Operations & Hardening', 
    subtitle: 'ReDoS prevention, sticky lexers & engine hardening',
    ids: [9, 11, 12, 13, 14] 
  },
];

// ============================================================
// NEON ACCENT PROFILES
// ============================================================
export function setNeonAccent(accent) {
  currentAccent = accent;
  localStorage.setItem('regex_accent', accent);
  document.documentElement.dataset.accent = accent;

  document.querySelectorAll('.palette-dot').forEach(dot => {
    dot.classList.toggle('active', dot.classList.contains(`dot-${accent}`));
  });
}

// ============================================================
// AUDIO SFX TOGGLE
// ============================================================
export function toggleAudio() {
  const muted = !isAudioMuted();
  setAudioMuted(muted);
  updateAudioIcon();
  if (!muted) {
    playSuccessChime();
  }
}

function updateAudioIcon() {
  const icon = document.getElementById('sound-icon');
  const btn = document.getElementById('sound-toggle');
  const muted = isAudioMuted();
  if (btn) btn.classList.toggle('muted', muted);
  if (icon) {
    icon.setAttribute('data-lucide', muted ? 'volume-x' : 'volume-2');
    lucide.createIcons();
  }
}

// ============================================================
// RENDER SIDEBAR
// ============================================================
export function renderSidebar() {
  const container = document.getElementById('lesson-list');
  if (!container) return;

  let html = '';
  CURRICULUM_GROUPS.forEach((group, groupIdx) => {
    const isCollapsed = collapsedGroups.has(groupIdx);
    const doneInGroup = group.ids.filter(id => completedLessons.has(id)).length;
    const totalInGroup = group.ids.length;

    html += `
      <div class="sidebar-level-header" onclick="toggleGroup(${groupIdx})" role="button" tabindex="0" aria-expanded="${!isCollapsed}" aria-label="${group.label}">
        <div class="level-title-wrap" style="flex:1;min-width:0;">
          <div class="level-label" style="font-size:12px;font-weight:700;">${group.label}</div>
          <div style="font-size:10px;color:var(--text3);margin-top:2px;">${group.subtitle}</div>
          <span class="level-progress-badge" style="margin-top:4px;display:inline-block;">${doneInGroup} / ${totalInGroup} completed</span>
        </div>
        <i data-lucide="chevron-down" class="level-chevron ${isCollapsed ? 'collapsed' : ''}"></i>
      </div>
      <div id="group-container-${groupIdx}" class="level-lessons-container ${isCollapsed ? 'collapsed' : ''}">
    `;

    group.ids.forEach(id => {
      const l = LESSONS[id];
      if (!l) return;
      const done = completedLessons.has(id);
      const active = currentLesson === id && currentView === 'lessons';
      const ects = l.ects || 2;

      html += `
        <div class="lesson-item ${active ? 'active' : ''} ${done ? 'completed' : ''}" onclick="loadLesson(${id})" role="button" tabindex="0" aria-label="Lesson ${id + 1}: ${escapeHtml(l.title)}">
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="lesson-timeline-node">
              ${done ? '<i data-lucide="check" style="width:10px;height:10px;"></i>' : (id + 1)}
            </span>
            <div style="flex:1;min-width:0;">
              <div class="lesson-title-text" style="font-size:13px;line-height:1.3;">${escapeHtml(l.title)}</div>
            </div>
            <span class="ects-badge" title="Workload Effort: ${ects} ECTS">
              ${ects} ECTS
            </span>
          </div>
        </div>`;
    });

    html += `</div>`;
  });

  // Footer inside sidebar for resetting progress
  html += `
    <div style="padding: 16px; border-top: 1px solid var(--border); margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 11px; color: var(--text3);">RegEx Lab v3.0 PWA</span>
      <button class="btn btn-ghost" onclick="resetAllProgress()" style="font-size: 11px; padding: 4px 8px; color: var(--red); display: flex; align-items: center; gap: 4px;" aria-label="Reset all progress">
        <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i> Reset Progress
      </button>
    </div>
  `;

  container.innerHTML = html;
  lucide.createIcons();
  updateHeaderProgress();
}

export function updateHeaderProgress() {
  const totalLessons = LESSONS.length;
  const doneLessons = completedLessons.size;
  
  const totalEcts = LESSONS.reduce((acc, l) => acc + (l.ects || 2), 0);
  const earnedEcts = Array.from(completedLessons).reduce((acc, id) => {
    return acc + (LESSONS[id]?.ects || 2);
  }, 0);

  const textEl = document.getElementById('progress-text');
  const barEl = document.getElementById('header-progress');

  if (textEl) {
    textEl.textContent = `${earnedEcts} / ${totalEcts} ECTS (${doneLessons} / ${totalLessons} lessons)`;
  }
  if (barEl) {
    const pct = totalEcts > 0 ? (earnedEcts / totalEcts) * 100 : 0;
    barEl.style.width = `${pct}%`;
  }
}

// ============================================================
// LEARNING MODE SWITCHER
// ============================================================
export function setLearningMode(mode) {
  learningMode = mode;
  localStorage.setItem('regex_mode', mode);
  loadLesson(currentLesson);
}

// ============================================================
// RENDER LESSON
// ============================================================
export function loadLesson(id) {
  if (currentView !== 'lessons') {
    setView('lessons');
  }
  currentLesson = id;
  const l = LESSONS[id];
  if (!l) return;

  closeSidebarOnMobile();
  renderSidebar();

  const main = document.getElementById('lesson-content');
  if (!main) return;

  const ects = l.ects || 2;
  const isDeepDive = learningMode === 'deepDive';

  // Concepts cards
  let conceptsHtml = (l.concepts || []).map(c => `
    <div class="concept-card" style="display:flex;align-items:center;gap:12px;">
      <code class="concept-key">${escapeHtml(c.key)}</code>
      <span style="font-size:13px;color:var(--text2);">${escapeHtml(c.desc)}</span>
    </div>`).join('');

  // Examples cards
  let examplesHtml = (l.examples || []).map((ex, i) => `
    <div class="glass-card" style="margin-bottom:20px;padding:20px;">
      <div style="font-size:12px;color:var(--text3);margin-bottom:12px;display:flex;align-items:center;gap:8px;font-weight:600;">
        <i data-lucide="test-tube" style="width:14px;height:14px;color:var(--accent);"></i> Example ${i + 1}: ${escapeHtml(ex.desc)}
      </div>
      <div class="pattern-wrapper" id="example-wrapper-${l.id}-${i}" style="margin-bottom:12px;">
        <span class="slash">/</span>
        <input type="text" id="example-input-${l.id}-${i}" class="pattern-input" value="${escapeHtml(ex.pattern)}" aria-label="Example pattern input" oninput="debouncedRunExample(${l.id}, ${i})" style="flex:1;padding:10px 4px;font-size:14px;color:var(--accent);font-family:'JetBrains Mono',monospace;background:transparent;border:none;outline:none;">
        <span class="slash">/</span>
        <input type="text" id="example-flags-${l.id}-${i}" class="flags" value="${escapeHtml(ex.flags)}" aria-label="Example flags input" oninput="debouncedRunExample(${l.id}, ${i})" style="width:50px;background:transparent;border:none;outline:none;font-family:inherit;">
        <button class="btn btn-ghost" style="padding:6px 14px;font-size:11px;border-radius:0;border-left:1px solid var(--border);border-top:none;border-bottom:none;border-right:none;" onclick="resetExample(${l.id}, ${i})" aria-label="Reset example">
          <i data-lucide="rotate-ccw" style="width:12px;height:12px;color:var(--amber);"></i> Reset
        </button>
      </div>
      <div class="test-display" id="example-${l.id}-${i}" style="font-size:13px;">${escapeHtml(ex.text)}</div>
    </div>`).join('');

  // Active exercises
  const activeExercises = [...(l.exercises || [])];
  if (isDeepDive && l.extendedExercises) {
    l.extendedExercises.forEach(extEx => {
      activeExercises.push({ ...extEx, isExtended: true });
    });
  }

  let exercisesHtml = activeExercises.map((ex, idx) => {
    const isDone = completedExercises.has(`${id}-${idx}`);
    const isExtendedTask = ex.isExtended;
    const hasTestSuite = !!ex.testSuite;

    return `
      <div class="exercise-box" style="margin-bottom:24px; ${isExtendedTask ? 'border-color: rgba(191,85,236,0.35); background: rgba(191,85,236,0.02);' : ''}">
        <div class="exercise-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
          <div class="exercise-header-title" style="display:flex;align-items:center;gap:8px;">
            <i data-lucide="${isExtendedTask ? 'zap' : 'target'}" class="exercise-header-icon" style="color:${isExtendedTask ? 'var(--purple)' : 'var(--amber)'};"></i>
            <span style="font-size:11px;color:${isExtendedTask ? 'var(--purple)' : 'var(--amber)'};text-transform:uppercase;letter-spacing:1px;font-family:'Orbitron',sans-serif;font-weight:700;">
              Task ${idx + 1}
            </span>
            ${isExtendedTask ? '<span class="extended-task-badge">DEEP DIVE BONUS</span>' : ''}
            ${hasTestSuite ? '<span class="ects-badge" style="font-size:9px;">Unit Test Suite</span>' : ''}
          </div>
          <div id="ex-badge-${l.id}-${idx}" class="exercise-status-badge ${isDone ? 'completed' : ''}" style="font-size:11px; display:flex; align-items:center; gap:4px;">
            ${isDone ? '<i data-lucide="check-circle" style="width:12px;height:12px;color:var(--green);"></i> <span style="color:var(--green);font-weight:600;">Completed</span>' : '<span style="color:var(--text3);">In Progress</span>'}
          </div>
        </div>
        <div class="exercise-content">
          <div class="exercise-task-text" style="margin-bottom:16px; font-size:14px; line-height:1.7;">${ex.task}</div>
          
          <div style="margin-bottom:16px;">
            <div class="exercise-label" style="font-size:11px; text-transform:uppercase; color:var(--text3); font-family:'Orbitron',sans-serif; margin-bottom:6px;">Target Test Stream</div>
            <div class="test-display" id="ex-display-${l.id}-${idx}" style="font-size:13px; font-family:'JetBrains Mono',monospace;">${escapeHtml(ex.text)}</div>
          </div>
          
          <div style="margin-bottom:16px;">
            <div class="exercise-label" style="font-size:11px; text-transform:uppercase; color:var(--text3); font-family:'Orbitron',sans-serif; margin-bottom:6px;">Your RegEx Pattern</div>
            <div style="display:flex;gap:12px;align-items:center;">
              <div class="pattern-wrapper" id="ex-pattern-wrap-${l.id}-${idx}" style="flex:1;">
                <span class="slash">/</span>
                <input type="text" id="ex-pattern-${l.id}-${idx}" class="pattern-input" placeholder="enter pattern..." aria-label="Pattern for task ${idx + 1}" oninput="debouncedCheckExercise(${l.id}, ${idx})">
                <span class="slash">/</span>
                <input type="text" id="ex-flags-${l.id}-${idx}" class="flags" value="${escapeHtml(ex.flags)}" aria-label="Flags for task ${idx + 1}" oninput="debouncedCheckExercise(${l.id}, ${idx})" style="width:50px;background:transparent;border:none;outline:none;font-family:inherit;">
              </div>
              <button class="btn btn-ghost" onclick="showHint(${l.id}, ${idx})" aria-label="Show hint for task ${idx + 1}" style="display:flex; align-items:center; gap:6px;">
                <i data-lucide="lightbulb" style="width:14px;height:14px;color:var(--amber);"></i> Hint
              </button>
            </div>

            <!-- REAL-TIME REGEX EXPLAINER STRIP -->
            <div id="ex-explainer-${l.id}-${idx}" style="display:none;" class="regex-explainer-box"></div>
          </div>
          
          <!-- UNIT TEST SUITE PREVIEW (IF AVAILABLE) -->
          ${hasTestSuite ? `
          <div class="test-suite-box" id="test-suite-box-${l.id}-${idx}">
            <div class="test-suite-title">
              <span>Unit Validation Tests</span>
              <span id="ts-badge-${l.id}-${idx}" style="color:var(--text3);">Pending verification</span>
            </div>
            <div class="test-cases-grid">
              <div>
                <div class="test-case-column-title" style="color:var(--green);"><i data-lucide="check" style="width:12px;height:12px;"></i> Should Match (Positive)</div>
                <div id="ts-pos-${l.id}-${idx}">
                  ${ex.testSuite.positive.map(item => `
                    <div class="test-case-item" data-case="${escapeHtml(item)}">
                      <span>${escapeHtml(item)}</span>
                      <span class="case-status" style="color:var(--text3);">•</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              <div>
                <div class="test-case-column-title" style="color:var(--red);"><i data-lucide="x" style="width:12px;height:12px;"></i> Should Reject (Negative)</div>
                <div id="ts-neg-${l.id}-${idx}">
                  ${ex.testSuite.negative.map(item => `
                    <div class="test-case-item" data-case="${escapeHtml(item)}">
                      <span>${escapeHtml(item)}</span>
                      <span class="case-status" style="color:var(--text3);">•</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
          ` : ''}

          <div id="ex-feedback-${l.id}-${idx}" style="min-height:36px; display:flex; align-items:center; margin-top:8px;"></div>
          
          <!-- HINT & REVEAL SOLUTION CONTAINER -->
          <div id="hint-box-${l.id}-${idx}" style="display:none;background:rgba(255,179,0,0.04);border:1px solid rgba(255,179,0,0.25);border-radius:8px;padding:14px 16px;margin-top:12px;animation:fadeIn 0.2s ease;">
            <div style="font-size:11px;color:var(--amber);margin-bottom:6px;display:flex;align-items:center;gap:6px;font-weight:700;letter-spacing:1px;font-family:'Orbitron',sans-serif;">
              <i data-lucide="lightbulb" style="width:13px;height:13px;"></i> HINT
            </div>
            <div style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:12px;">${escapeHtml(ex.hint)}</div>
            
            <div style="padding-top:10px; border-top:1px dashed rgba(255,179,0,0.2); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <span style="font-size:12px; color:var(--text3);">Need exact answer?</span>
              <button class="btn btn-ghost" id="reveal-btn-${l.id}-${idx}" onclick="revealSolution(${l.id}, ${idx})" style="font-size:11px; padding:4px 10px; color:var(--amber); display:flex; align-items:center; gap:5px;">
                <i data-lucide="key" style="width:12px;height:12px;"></i> Reveal Solution
              </button>
            </div>

            <div id="solution-box-${l.id}-${idx}" style="display:none; margin-top:10px; background:rgba(0,229,255,0.06); border:1px solid rgba(0,229,255,0.25); border-radius:6px; padding:10px 14px;">
              <div style="font-size:10px; text-transform:uppercase; color:var(--accent); font-weight:700; margin-bottom:6px; font-family:'Orbitron',sans-serif; letter-spacing:0.5px;">Correct Solution Pattern</div>
              <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
                <code style="font-family:'JetBrains Mono',monospace; color:var(--green); font-size:13px; font-weight:600;">/${escapeHtml(ex.solution)}/${escapeHtml(ex.flags)}</code>
                <button class="btn btn-primary" onclick="insertSolution(${l.id}, ${idx})" style="font-size:11px; padding:5px 10px;">
                  Insert & Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const isCompleted = completedLessons.has(id);
  const allExercisesDone = activeExercises.every((_, idx) => completedExercises.has(`${id}-${idx}`));

  main.innerHTML = `
    <div class="fade-in" style="display:flex; flex-direction:column; gap:32px;">
      <!-- LESSON HEADER -->
      <div class="glass-card" style="padding:24px; display:flex; flex-direction:column; gap:14px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:44px;height:44px;border:1px solid var(--accent);border-radius:8px;display:flex;align-items:center;justify-content:center;background:rgba(0,229,255,0.08);">
              <i data-lucide="${l.icon || 'terminal'}" style="width:22px;height:22px;color:var(--accent);"></i>
            </div>
            <div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:10px;color:var(--text3);font-family:'Orbitron',sans-serif;letter-spacing:1px;">LESSON ${id + 1}</span>
                <span class="ects-pill">${ects} ECTS Workload</span>
                ${isCompleted ? `<span style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.2);color:var(--green);font-size:10px;padding:2px 8px;border-radius:4px;display:flex;align-items:center;gap:4px;"><i data-lucide="check-circle" style="width:12px;height:12px;"></i> Completed</span>` : ''}
              </div>
              <h1 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:22px;color:var(--text);margin-top:4px;letter-spacing:0.5px;">${escapeHtml(l.title)}</h1>
            </div>
          </div>

          <!-- LEARNING MODE TOGGLE -->
          <div class="mode-switch-container">
            <button class="mode-btn ${!isDeepDive ? 'active' : ''}" onclick="setLearningMode('standard')" aria-label="Standard Mode">
              Standard
            </button>
            <button class="mode-btn ${isDeepDive ? 'active' : ''}" onclick="setLearningMode('deepDive')" aria-label="Deep Dive Mode">
              <i data-lucide="zap" style="width:12px;height:12px;"></i> Deep Dive (Extended)
            </button>
          </div>
        </div>

        <!-- 1. PLAIN LANGUAGE TECHNICAL OVERVIEW -->
        <div class="technical-overview-card">
          <div style="font-family:'Orbitron',sans-serif; font-size:10px; color:var(--accent); letter-spacing:1px; text-transform:uppercase; font-weight:700; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
            <i data-lucide="info" style="width:13px;height:13px;"></i> Technical Subject Overview
          </div>
          <p style="font-size:13px; color:var(--text); line-height:1.6; margin:0;">
            ${l.technicalSummary || l.intro}
          </p>
        </div>

        <!-- 2. CYBERPUNK NARRATIVE BRIEFING -->
        <div class="cyberpunk-narrative-card">
          <span style="font-size:10px; color:var(--amber); font-family:'Orbitron',sans-serif; letter-spacing:1px; text-transform:uppercase; font-weight:700; display:block; margin-bottom:4px;">
            // NETRUNNER MISSION BRIEFING
          </span>
          <p style="color:var(--text2); line-height:1.6; font-size:13px; font-style:italic; margin:0;">
            "${escapeHtml(l.intro)}"
          </p>
        </div>
      </div>
 
      <!-- THEORY SECTION -->
      <div>
        <div class="exercise-label" style="font-size:12px; text-transform:uppercase; color:var(--accent); font-family:'Orbitron',sans-serif; letter-spacing:1px; margin-bottom:12px; display:flex; align-items:center; gap:8px; font-weight:700;">
          <i data-lucide="book" style="width:16px;height:16px;"></i> Theory
        </div>
        <div class="glass-card" style="padding:24px; margin-bottom:20px; line-height:1.8; font-size:14px;">
          ${l.theory}
          ${isDeepDive && l.deepDive ? l.deepDive : ''}
        </div>
        
        <div class="exercise-label" style="font-size:11px; text-transform:uppercase; color:var(--text3); font-family:'Orbitron',sans-serif; letter-spacing:1px; margin-bottom:12px; display:flex; align-items:center; gap:6px; font-weight:600;">
          <i data-lucide="hash" style="width:14px;height:14px;"></i> Key Concepts
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">${conceptsHtml}</div>
      </div>
 
      <!-- EXAMPLES SECTION -->
      <div>
        <div class="exercise-label" style="font-size:12px; text-transform:uppercase; color:var(--accent); font-family:'Orbitron',sans-serif; letter-spacing:1px; margin-bottom:16px; display:flex; align-items:center; gap:8px; font-weight:700;">
          <i data-lucide="play-circle" style="width:16px;height:16px;"></i> Interactive Examples
        </div>
        <div>
          ${examplesHtml}
        </div>
      </div>
 
      <!-- PRACTICAL EXERCISES -->
      <div>
        <div class="exercise-label" style="font-size:12px; text-transform:uppercase; color:var(--accent); font-family:'Orbitron',sans-serif; letter-spacing:1px; margin-bottom:16px; display:flex; align-items:center; gap:8px; font-weight:700;">
          <i data-lucide="target" style="width:16px;height:16px;"></i> Practical Tasks (${activeExercises.length} tasks)
        </div>
        <div style="display:flex; flex-direction:column; gap:20px;">
          ${exercisesHtml}
        </div>
      </div>
 
      <!-- NAVIGATION BUTTONS -->
      <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
        ${id === 0 ? `<div></div>` : `
        <button class="btn btn-ghost" onclick="loadLesson(${id - 1})" aria-label="Go to previous lesson" style="display:flex; align-items:center; gap:8px;">
          <i data-lucide="arrow-left" style="width:14px;height:14px;"></i> Previous Lesson
        </button>
        `}
        
        ${id < LESSONS.length - 1 ? `
        <button class="btn btn-primary" id="next-btn" onclick="loadLesson(${id + 1})" aria-label="Go to next lesson" ${!allExercisesDone ? 'style="opacity:0.5;pointer-events:none;" disabled' : ''} style="display:flex; align-items:center; gap:8px;">
          Next Lesson <i data-lucide="arrow-right" style="width:14px;height:14px;"></i>
        </button>
        ` : `
        <div></div>
        `}
      </div>
 
      <!-- COURSE COMPLETED BANNER -->
      ${(id === LESSONS.length - 1 && allExercisesDone) ? `
      <div style="margin-top:16px; background:rgba(0,255,136,0.04); border:1px solid rgba(0,255,136,0.2); border-radius:12px; padding:32px 24px; text-align:center; box-shadow: 0 0 20px rgba(0,255,136,0.05);">
        <i data-lucide="trophy" style="width:40px;height:40px;color:var(--amber);margin-bottom:16px;display:inline-block;"></i>
        <div style="font-family:'Orbitron',sans-serif;font-size:20px;color:var(--green);margin-bottom:8px;font-weight:700;letter-spacing:1px;">CONGRATULATIONS! ALL ECTS CREDITS EARNED!</div>
        <div style="font-size:14px;color:var(--text2);line-height:1.6;max-width:600px;margin:0 auto;">You have completed the entire RegEx curriculum – from basic character classes to lookarounds, stream lexers, and ReDoS hardening. You are an official RegEx Grandmaster!</div>
      </div>` : ''}
    </div>`;

  lucide.createIcons();

  // Run examples
  (l.examples || []).forEach((ex, i) => {
    applyRegex(ex.pattern, ex.flags, ex.text, `example-${l.id}-${i}`);
  });

  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.scrollTo(0, 0);
}

export function runExample(lessonId, exIdx) {
  const lesson = LESSONS[lessonId];
  if (!lesson || !lesson.examples) return;
  const ex = lesson.examples[exIdx];
  if (!ex) return;

  const inputEl = document.getElementById(`example-input-${lessonId}-${exIdx}`);
  const flagsEl = document.getElementById(`example-flags-${lessonId}-${exIdx}`);
  const wrapperEl = document.getElementById(`example-wrapper-${lessonId}-${exIdx}`);

  if (!inputEl || !flagsEl) return;

  const pattern = inputEl.value;
  const flags = flagsEl.value;

  if (wrapperEl) wrapperEl.classList.remove('error');

  try {
    new RegExp(pattern, flags);
    applyRegex(pattern, flags, ex.text, `example-${lessonId}-${exIdx}`);
  } catch (e) {
    if (wrapperEl) wrapperEl.classList.add('error');
  }
}

export const debouncedRunExample = debounce(runExample, 100);

export function resetExample(lessonId, exIdx) {
  const lesson = LESSONS[lessonId];
  if (!lesson || !lesson.examples) return;
  const ex = lesson.examples[exIdx];
  if (!ex) return;

  const inputEl = document.getElementById(`example-input-${lessonId}-${exIdx}`);
  const flagsEl = document.getElementById(`example-flags-${lessonId}-${exIdx}`);
  const wrapperEl = document.getElementById(`example-wrapper-${lessonId}-${exIdx}`);

  if (inputEl) inputEl.value = ex.pattern;
  if (flagsEl) flagsEl.value = ex.flags;
  if (wrapperEl) wrapperEl.classList.remove('error');

  applyRegex(ex.pattern, ex.flags, ex.text, `example-${lessonId}-${exIdx}`);
}

// ============================================================
// EXERCISE CHECK & TEST SUITE VERIFICATION
// ============================================================
export function checkExercise(lessonId, exerciseIdx) {
  const l = LESSONS[lessonId];
  if (!l) return;

  let ex = l.exercises && l.exercises[exerciseIdx];
  if (!ex && l.extendedExercises) {
    const extIdx = exerciseIdx - (l.exercises ? l.exercises.length : 0);
    ex = l.extendedExercises[extIdx];
  }
  if (!ex) return;

  const patEl = document.getElementById(`ex-pattern-${lessonId}-${exerciseIdx}`);
  const flagsEl = document.getElementById(`ex-flags-${lessonId}-${exerciseIdx}`);
  const feedback = document.getElementById(`ex-feedback-${lessonId}-${exerciseIdx}`);
  const display = document.getElementById(`ex-display-${lessonId}-${exerciseIdx}`);
  const wrap = document.getElementById(`ex-pattern-wrap-${lessonId}-${exerciseIdx}`);
  const explainerBox = document.getElementById(`ex-explainer-${lessonId}-${exerciseIdx}`);

  if (!patEl || !flagsEl || !feedback || !display || !wrap) return;

  const pattern = patEl.value;
  const flags = flagsEl.value;

  // Real-time RegEx Explainer
  if (explainerBox) {
    if (pattern) {
      const tokens = explainRegex(pattern);
      explainerBox.style.display = 'flex';
      explainerBox.innerHTML = `
        <div class="explainer-title"><i data-lucide="terminal" style="width:11px;height:11px;"></i> Live Pattern Structure Analysis</div>
        <div class="explainer-tokens-flow">
          ${tokens.map(t => `
            <div class="explainer-token-pill">
              <span class="token-raw">${escapeHtml(t.raw)}</span>
              <span class="token-desc">${escapeHtml(t.desc)}</span>
            </div>
          `).join('')}
        </div>
      `;
      lucide.createIcons();
    } else {
      explainerBox.style.display = 'none';
    }
  }

  if (!pattern) {
    display.innerHTML = escapeHtml(ex.text);
    feedback.innerHTML = '';
    wrap.classList.remove('error');
    return;
  }

  let re, matchCount = 0;
  try {
    re = new RegExp(pattern, flags);
    wrap.classList.remove('error');
  } catch (e) {
    wrap.classList.add('error');
    feedback.innerHTML = `<div class="match-badge error-badge"><i data-lucide="alert-triangle" style="width:12px;height:12px;"></i> Syntax Error: ${escapeHtml(e.message.split('\n')[0])}</div>`;
    lucide.createIcons();
    return;
  }

  display.innerHTML = highlightMatches(ex.text, re);
  
  let allMatches = [];
  try {
    allMatches = ex.text.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')) || [];
  } catch (e) {
    // Fallback
  }
  matchCount = allMatches.length;

  const solutionMatches = ex.text.match(new RegExp(ex.solution, ex.flags.includes('g') ? ex.flags : ex.flags + 'g')) || [];

  const altOk = ex.altSolutions && ex.altSolutions.some(alt => {
    try {
      const a = new RegExp(alt, flags);
      const aMatches = ex.text.match(new RegExp(a.source, a.flags.includes('g') ? a.flags : a.flags + 'g')) || [];
      return JSON.stringify(aMatches.sort()) === JSON.stringify(solutionMatches.sort());
    } catch { return false; }
  });

  const userMatchesSorted = [...allMatches].sort();
  const solutionMatchesSorted = [...solutionMatches].sort();
  let isCorrect = (JSON.stringify(userMatchesSorted) === JSON.stringify(solutionMatchesSorted) && matchCount > 0) || altOk;

  // Test Suite Evaluation (if present)
  let testSuitePassed = true;
  if (ex.testSuite) {
    const posCont = document.getElementById(`ts-pos-${lessonId}-${exerciseIdx}`);
    const negCont = document.getElementById(`ts-neg-${lessonId}-${exerciseIdx}`);
    const tsBadge = document.getElementById(`ts-badge-${lessonId}-${exerciseIdx}`);

    const testRe = new RegExp(re.source, re.flags);

    // Verify positive cases
    ex.testSuite.positive.forEach((item, pIdx) => {
      const ok = testRe.test(item);
      if (!ok) testSuitePassed = false;
      if (posCont) {
        const itemEl = posCont.children[pIdx];
        if (itemEl) {
          itemEl.className = `test-case-item ${ok ? 'pass' : 'fail'}`;
          itemEl.querySelector('.case-status').innerHTML = ok ? '<i data-lucide="check" style="width:12px;height:12px;color:var(--green);"></i>' : '<i data-lucide="x" style="width:12px;height:12px;color:var(--red);"></i>';
        }
      }
    });

    // Verify negative cases (should NOT match)
    ex.testSuite.negative.forEach((item, nIdx) => {
      const ok = !testRe.test(item);
      if (!ok) testSuitePassed = false;
      if (negCont) {
        const itemEl = negCont.children[nIdx];
        if (itemEl) {
          itemEl.className = `test-case-item ${ok ? 'pass' : 'fail'}`;
          itemEl.querySelector('.case-status').innerHTML = ok ? '<i data-lucide="check" style="width:12px;height:12px;color:var(--green);"></i>' : '<i data-lucide="x" style="width:12px;height:12px;color:var(--red);"></i>';
        }
      }
    });

    if (tsBadge) {
      tsBadge.innerHTML = testSuitePassed 
        ? '<span style="color:var(--green);font-weight:700;">All Tests Passed ✓</span>' 
        : '<span style="color:var(--amber);">Some Tests Failing</span>';
    }
    lucide.createIcons();

    isCorrect = isCorrect && testSuitePassed;
  }

  if (isCorrect) {
    feedback.innerHTML = `<div class="match-badge" style="background:rgba(0,255,136,0.08);border-color:rgba(0,255,136,0.2);color:var(--green);">
      <i data-lucide="check-circle" style="width:12px;height:12px;"></i> Correct! ${matchCount} target${matchCount === 1 ? '' : 's'} matched & validated
    </div>`;
    wrap.style.borderColor = 'var(--green)';

    const exKey = `${lessonId}-${exerciseIdx}`;
    if (!completedExercises.has(exKey)) {
      // Play cyberpunk neon success chime
      playSuccessChime();

      completedExercises.add(exKey);
      localStorage.setItem('regex_completed_exercises', JSON.stringify([...completedExercises]));

      const activeExercises = [...(l.exercises || [])];
      if (learningMode === 'deepDive' && l.extendedExercises) {
        l.extendedExercises.forEach(e => activeExercises.push(e));
      }

      const allExercisesDone = activeExercises.every((_, idx) => completedExercises.has(`${lessonId}-${idx}`));
      if (allExercisesDone && !completedLessons.has(lessonId)) {
        completedLessons.add(lessonId);
        localStorage.setItem('regex_completed', JSON.stringify([...completedLessons]));
      }

      renderSidebar();

      const badgeEl = document.getElementById(`ex-badge-${lessonId}-${exerciseIdx}`);
      if (badgeEl) {
        badgeEl.className = 'exercise-status-badge completed';
        badgeEl.innerHTML = '<i data-lucide="check-circle" style="width:12px;height:12px;color:var(--green);"></i> <span style="color:var(--green);font-weight:600;">Completed</span>';
        lucide.createIcons();
      }

      if (allExercisesDone) {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
          nextBtn.removeAttribute('disabled');
          nextBtn.style.opacity = '1';
          nextBtn.style.pointerEvents = 'auto';
        }
      }

      wrap.classList.add('correct-flash');
      setTimeout(() => wrap.classList.remove('correct-flash'), 600);
    }
  } else if (matchCount === 0) {
    feedback.innerHTML = `<div class="match-badge no-match"><i data-lucide="x-circle" style="width:12px;height:12px;"></i> No matches found</div>`;
    wrap.style.borderColor = '';
  } else {
    feedback.innerHTML = `<div class="match-badge" style="background:rgba(255,179,0,0.08);border-color:rgba(255,179,0,0.2);color:var(--amber);">
      <i data-lucide="zap" style="width:12px;height:12px;"></i> ${matchCount} match${matchCount === 1 ? '' : 'es'} — check unit test criteria
    </div>`;
    wrap.style.borderColor = '';
  }
  lucide.createIcons();
}

export const debouncedCheckExercise = debounce(checkExercise, 120);

// ============================================================
// HINT & SOLUTION REVEAL
// ============================================================
export function showHint(lessonId, exerciseIdx) {
  const h = document.getElementById(`hint-box-${lessonId}-${exerciseIdx}`);
  if (h) {
    h.style.display = h.style.display === 'none' ? 'block' : 'none';
  }
}

export function revealSolution(lessonId, exerciseIdx) {
  const solBox = document.getElementById(`solution-box-${lessonId}-${exerciseIdx}`);
  const revealBtn = document.getElementById(`reveal-btn-${lessonId}-${exerciseIdx}`);
  if (solBox) {
    solBox.style.display = 'block';
  }
  if (revealBtn) {
    revealBtn.style.display = 'none';
  }
}

export function insertSolution(lessonId, exerciseIdx) {
  const l = LESSONS[lessonId];
  if (!l) return;

  let ex = l.exercises && l.exercises[exerciseIdx];
  if (!ex && l.extendedExercises) {
    const extIdx = exerciseIdx - (l.exercises ? l.exercises.length : 0);
    ex = l.extendedExercises[extIdx];
  }
  if (!ex) return;

  const patEl = document.getElementById(`ex-pattern-${lessonId}-${exerciseIdx}`);
  const flagsEl = document.getElementById(`ex-flags-${lessonId}-${exerciseIdx}`);

  if (patEl && flagsEl) {
    patEl.value = ex.solution;
    flagsEl.value = ex.flags;
    checkExercise(lessonId, exerciseIdx);
  }
}

// ============================================================
// RESET PROGRESS
// ============================================================
export function resetAllProgress() {
  if (confirm('Are you sure you want to reset all your learning progress and ECTS credits? This cannot be undone.')) {
    completedLessons.clear();
    completedExercises.clear();
    localStorage.removeItem('regex_completed');
    localStorage.removeItem('regex_completed_exercises');
    renderSidebar();
    loadLesson(currentLesson);
  }
}

// ============================================================
// NAV TABS
// ============================================================
export function setView(view) {
  currentView = view;
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');

  if (view === 'lessons') {
    if (sidebar) sidebar.style.display = '';
    if (sidebarToggle) sidebarToggle.style.display = '';
    loadLesson(currentLesson);
  } else if (view === 'playground') {
    if (sidebar) sidebar.style.display = 'none';
    if (sidebarToggle) sidebarToggle.style.display = 'none';
    closeSidebar();
    renderPlayground();
  } else if (view === 'cheatsheet') {
    if (sidebar) sidebar.style.display = 'none';
    if (sidebarToggle) sidebarToggle.style.display = 'none';
    closeSidebar();
    renderCheatsheet();
  }
}

export function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sb) {
    const isOpen = sb.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('active', isOpen);
  }
}

export function closeSidebar() {
  const sb = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sb) sb.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
}

export function closeSidebarOnMobile() {
  if (window.innerWidth <= 1023) {
    closeSidebar();
  }
}

export function toggleGroup(groupIdx) {
  if (collapsedGroups.has(groupIdx)) {
    collapsedGroups.delete(groupIdx);
  } else {
    collapsedGroups.add(groupIdx);
  }
  renderSidebar();
}

export function changeTheme(themeId) {
  setTheme(themeId);
  renderSidebar();
  if (currentView === 'lessons') {
    loadLesson(currentLesson);
  }
  lucide.createIcons();
}

// ============================================================
// BIND GLOBAL HANDLERS
// ============================================================
window.loadLesson = loadLesson;
window.runExample = runExample;
window.debouncedRunExample = debouncedRunExample;
window.resetExample = resetExample;
window.checkExercise = checkExercise;
window.debouncedCheckExercise = debouncedCheckExercise;
window.showHint = showHint;
window.revealSolution = revealSolution;
window.insertSolution = insertSolution;
window.setLearningMode = setLearningMode;
window.setNeonAccent = setNeonAccent;
window.toggleAudio = toggleAudio;
window.setView = setView;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.toggleGroup = toggleGroup;
window.changeTheme = changeTheme;
window.resetAllProgress = resetAllProgress;

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved neon accent
  setNeonAccent(currentAccent);
  updateAudioIcon();

  // PWA Service Worker Registration
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  const topNav = document.getElementById('top-nav-container');
  if (topNav) {
    topNav.innerHTML = `
      <button class="nav-tab active" data-view="lessons" onclick="setView('lessons')" aria-label="Go to Lessons view">
        <i data-lucide="book-open" style="width:14px;height:14px;"></i>
        <span>Lessons</span>
      </button>
      <button class="nav-tab" data-view="playground" onclick="setView('playground')" aria-label="Go to Playground view">
        <i data-lucide="flask-conical" style="width:14px;height:14px;"></i>
        <span>Playground</span>
      </button>
      <button class="nav-tab" data-view="cheatsheet" onclick="setView('cheatsheet')" aria-label="Go to Cheatsheet view">
        <i data-lucide="scroll-text" style="width:14px;height:14px;"></i>
        <span>Cheatsheet</span>
      </button>
    `;
  }

  // Inject Theme Selector
  const headerLeft = document.querySelector('.header-left');
  if (headerLeft) {
    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'theme-selector-container';
    
    let optionsHtml = '';
    Object.keys(THEMES).forEach(key => {
      const theme = THEMES[key];
      const selected = key === currentThemeId ? 'selected' : '';
      optionsHtml += `<option value="${key}" ${selected}>${escapeHtml(theme.name)}</option>`;
    });

    selectorContainer.innerHTML = `
      <label for="theme-selector" class="sr-only" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;">Theme</label>
      <select id="theme-selector" class="theme-select" aria-label="Select narrative curriculum theme">
        ${optionsHtml}
      </select>
    `;
    headerLeft.appendChild(selectorContainer);

    const themeSelect = document.getElementById('theme-selector');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        changeTheme(e.target.value);
      });
    }
  }

  // Mobile backdrop
  let backdrop = document.getElementById('sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'sidebar-backdrop';
    backdrop.className = 'sidebar-backdrop';
    backdrop.onclick = closeSidebar;
    document.body.appendChild(backdrop);
  }

  renderSidebar();
  loadLesson(0);
  lucide.createIcons();
});
