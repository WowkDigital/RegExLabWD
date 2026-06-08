import { LESSONS, THEMES, setTheme, currentThemeId } from './lessons.js';
import { escapeHtml, highlightMatches, applyRegex } from './utils.js';
import { renderPlayground } from './playground.js';
import { renderCheatsheet } from './cheatsheet.js';

// ============================================================
// STATE
// ============================================================
let currentLesson = 0;
let completedLessons = new Set(JSON.parse(localStorage.getItem('regex_completed') || '[]'));
let completedExercises = new Set(JSON.parse(localStorage.getItem('regex_completed_exercises') || '[]'));
let collapsedGroups = new Set(); // Stores indices of collapsed groups

// ============================================================
// RENDER SIDEBAR
// ============================================================
export function renderSidebar() {
  const container = document.getElementById('lesson-list');
  if (!container) return;

  const groups = [
    { label: 'Level 1 — Basics', difficulty: 'beginner', ids: [0, 1, 2] },
    { label: 'Level 2 — Intermediate', difficulty: 'intermediate', ids: [3, 4, 5] },
    { label: 'Level 3 — Advanced', difficulty: 'advanced', ids: [6, 7, 8] },
    { label: 'Level 4 — Expert', difficulty: 'expert', ids: [9, 10, 11] },
    { label: 'Level 5 — Grandmaster', difficulty: 'master', ids: [12, 13, 14] },
  ];
  
  let html = '';
  groups.forEach((group, groupIdx) => {
    const isCollapsed = collapsedGroups.has(groupIdx);
    const doneInGroup = group.ids.filter(id => completedLessons.has(id)).length;
    const totalInGroup = group.ids.length;

    html += `
      <div class="sidebar-level-header" onclick="toggleGroup(${groupIdx})">
        <div class="level-title-wrap">
          <span class="level-label">${group.label}</span>
          <span class="level-progress-badge">${doneInGroup} / ${totalInGroup} completed</span>
        </div>
        <i data-lucide="chevron-down" class="level-chevron ${isCollapsed ? 'collapsed' : ''}"></i>
      </div>
      <div id="group-container-${groupIdx}" class="level-lessons-container ${isCollapsed ? 'collapsed' : ''}">
    `;

    group.ids.forEach(id => {
      const l = LESSONS[id];
      const done = completedLessons.has(id);
      const active = currentLesson === id;
      html += `
        <div class="lesson-item ${active ? 'active' : ''} ${done ? 'completed' : ''}" onclick="loadLesson(${id})">
          <div style="display:flex;align-items:center;gap:12px;">
            <span class="lesson-timeline-node">
              ${done ? '<i data-lucide="check" style="width:10px;height:10px;"></i>' : (id + 1)}
            </span>
            <div style="flex:1;min-width:0;">
              <div class="lesson-title-text">${l.title}</div>
            </div>
            <span class="difficulty-badge badge-${l.difficulty}">
              ${l.difficulty === 'beginner' ? 'BEG' : l.difficulty === 'intermediate' ? 'INT' : l.difficulty === 'advanced' ? 'ADV' : l.difficulty === 'expert' ? 'EXP' : 'MST'}
            </span>
          </div>
        </div>`;
    });

    html += `</div>`;
  });
  
  container.innerHTML = html;
  lucide.createIcons();
  updateHeaderProgress();
}

export function updateHeaderProgress() {
  const total = LESSONS.length;
  const done = completedLessons.size;
  
  const textEl = document.getElementById('progress-text');
  const barEl = document.getElementById('header-progress');
  
  if (textEl) textEl.textContent = `${done} / ${total} lessons`;
  if (barEl) barEl.style.width = `${(done / total) * 100}%`;
}

// ============================================================
// RENDER LESSON
// ============================================================
export function loadLesson(id) {
  currentLesson = id;
  const l = LESSONS[id];
  renderSidebar();
  const main = document.getElementById('lesson-content');
  if (!main) return;

  const diffColors = { beginner: 'green', intermediate: 'amber', advanced: 'red', expert: 'purple', master: 'pink' };
  const diffLabels = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', expert: 'Expert', master: 'Grandmaster' };
  const diffRgb = { green: '0,255,136', amber: '255,179,0', red: '255,77,77', purple: '191,85,236', pink: '255,45,127' };
  const dc = diffColors[l.difficulty] || 'purple';
  const rgb = diffRgb[dc] || '191,85,236';

  let conceptsHtml = l.concepts.map(c => `
    <div class="concept-card" style="display:flex;align-items:center;gap:12px;">
      <code class="concept-key">${escapeHtml(c.key)}</code>
      <span style="font-size:13px;color:var(--text2);">${c.desc}</span>
    </div>`).join('');

  let examplesHtml = l.examples.map((ex, i) => `
    <div class="glass-card" style="margin-bottom:20px;padding:20px;">
      <div style="font-size:12px;color:var(--text3);margin-bottom:12px;display:flex;align-items:center;gap:8px;font-weight:600;">
        <i data-lucide="test-tube" style="width:14px;height:14px;color:var(--accent);"></i> Example ${i + 1}: ${ex.desc}
      </div>
      <div class="pattern-wrapper" id="example-wrapper-${l.id}-${i}" style="margin-bottom:12px;">
        <span class="slash">/</span>
        <input type="text" id="example-input-${l.id}-${i}" class="pattern-input" value="${escapeHtml(ex.pattern)}" oninput="runExample(${l.id}, ${i})" style="flex:1;padding:10px 4px;font-size:14px;color:var(--accent);font-family:'JetBrains Mono',monospace;background:transparent;border:none;outline:none;">
        <span class="slash">/</span>
        <input type="text" id="example-flags-${l.id}-${i}" class="flags" value="${ex.flags}" oninput="runExample(${l.id}, ${i})" style="width:50px;background:transparent;border:none;outline:none;font-family:inherit;">
        <button class="btn btn-ghost" style="padding:6px 14px;font-size:11px;border-radius:0;border-left:1px solid var(--border);border-top:none;border-bottom:none;border-right:none;" onclick="resetExample(${l.id}, ${i})">
          <i data-lucide="rotate-ccw" style="width:12px;height:12px;color:var(--amber);"></i> Reset
        </button>
      </div>
      <div class="test-display" id="example-${l.id}-${i}" style="font-size:13px;">${escapeHtml(ex.text)}</div>
    </div>`).join('');

  let exercisesHtml = l.exercises.map((ex, idx) => {
    const isDone = completedExercises.has(`${id}-${idx}`);
    return `
      <div class="exercise-box" style="margin-bottom:24px;">
        <div class="exercise-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
          <div class="exercise-header-title">
            <i data-lucide="target" class="exercise-header-icon"></i>
            <span style="font-size:11px;color:var(--amber);text-transform:uppercase;letter-spacing:1px;font-family:'Orbitron',sans-serif;font-weight:700;">Task ${idx + 1}</span>
          </div>
          <div id="ex-badge-${l.id}-${idx}" class="exercise-status-badge ${isDone ? 'completed' : ''}" style="font-size:11px; display:flex; align-items:center; gap:4px;">
            ${isDone ? '<i data-lucide="check-circle" style="width:12px;height:12px;color:var(--green);"></i> <span style="color:var(--green);font-weight:600;">Completed</span>' : '<span style="color:var(--text3);">In Progress</span>'}
          </div>
        </div>
        <div class="exercise-content">
          <p class="exercise-task-text" style="margin-bottom:16px; font-size:14px; line-height:1.6;">${ex.task}</p>
          
          <div style="margin-bottom:16px;">
            <div class="exercise-label" style="font-size:11px; text-transform:uppercase; color:var(--text3); font-family:'Orbitron',sans-serif; margin-bottom:6px;">Test String</div>
            <div class="test-display" id="ex-display-${l.id}-${idx}" style="font-size:13px; font-family:'JetBrains Mono',monospace;">${escapeHtml(ex.text)}</div>
          </div>
          
          <div style="margin-bottom:16px;">
            <div class="exercise-label" style="font-size:11px; text-transform:uppercase; color:var(--text3); font-family:'Orbitron',sans-serif; margin-bottom:6px;">Your Pattern</div>
            <div style="display:flex;gap:12px;align-items:center;">
              <div class="pattern-wrapper" id="ex-pattern-wrap-${l.id}-${idx}" style="flex:1;">
                <span class="slash">/</span>
                <input type="text" id="ex-pattern-${l.id}-${idx}" class="pattern-input" placeholder="enter pattern..." oninput="checkExercise(${l.id}, ${idx})">
                <span class="slash">/</span>
                <input type="text" id="ex-flags-${l.id}-${idx}" class="flags" value="${ex.flags}" oninput="checkExercise(${l.id}, ${idx})" style="width:50px;background:transparent;border:none;outline:none;font-family:inherit;">
              </div>
              <button class="btn btn-ghost" onclick="showHint(${l.id}, ${idx})" style="display:flex; align-items:center; gap:6px;">
                <i data-lucide="lightbulb" style="width:14px;height:14px;color:var(--amber);"></i> Hint
              </button>
            </div>
          </div>
          
          <div id="ex-feedback-${l.id}-${idx}" style="min-height:36px; display:flex; align-items:center;"></div>
          
          <div id="hint-box-${l.id}-${idx}" style="display:none;background:rgba(255,179,0,0.04);border:1px solid rgba(255,179,0,0.2);border-radius:8px;padding:12px 16px;margin-top:12px;animation:fadeIn 0.2s ease;">
            <div style="font-size:11px;color:var(--amber);margin-bottom:6px;display:flex;align-items:center;gap:6px;font-weight:700;letter-spacing:1px;font-family:'Orbitron',sans-serif;">
              <i data-lucide="lightbulb" style="width:13px;height:13px;"></i> HINT
            </div>
            <div style="font-size:13px;color:var(--text2);line-height:1.6;">${ex.hint}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const isCompleted = completedLessons.has(id);
  const allExercisesDone = l.exercises.every((_, idx) => completedExercises.has(`${id}-${idx}`));

  main.innerHTML = `
    <div class="fade-in" style="display:flex; flex-direction:column; gap:36px;">
      <!-- LESSON HEADER -->
      <div class="glass-card" style="padding:24px; display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:40px;border:1px solid var(--${dc});border-radius:8px;display:flex;align-items:center;justify-content:center;background:rgba(${rgb},0.08);">
            <i data-lucide="${l.icon}" style="width:20px;height:20px;color:var(--${dc});"></i>
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:10px;color:var(--text3);font-family:'Orbitron',sans-serif;letter-spacing:1px;">LESSON ${id + 1}</span>
              <span class="difficulty-badge badge-${l.difficulty}">${diffLabels[l.difficulty]}</span>
              ${isCompleted ? `<span style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.2);color:var(--green);font-size:10px;padding:2px 8px;border-radius:4px;display:flex;align-items:center;gap:4px;"><i data-lucide="check-circle" style="width:12px;height:12px;"></i> Completed</span>` : ''}
            </div>
            <h1 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:22px;color:var(--text);margin-top:4px;letter-spacing:0.5px;">${l.title}</h1>
          </div>
        </div>
        <p style="color:var(--text2);line-height:1.7;font-size:14px;max-width:760px;">${l.intro}</p>
      </div>
 
      <!-- TEORIA -->
      <div>
        <div class="exercise-label" style="font-size:12px; text-transform:uppercase; color:var(--accent); font-family:'Orbitron',sans-serif; letter-spacing:1px; margin-bottom:12px; display:flex; align-items:center; gap:8px; font-weight:700;">
          <i data-lucide="book" style="width:16px;height:16px;"></i> Theory
        </div>
        <div class="glass-card" style="padding:24px; margin-bottom:20px; line-height:1.8; font-size:14px;">
          ${l.theory}
        </div>
        
        <div class="exercise-label" style="font-size:11px; text-transform:uppercase; color:var(--text3); font-family:'Orbitron',sans-serif; letter-spacing:1px; margin-bottom:12px; display:flex; align-items:center; gap:6px; font-weight:600;">
          <i data-lucide="hash" style="width:14px;height:14px;"></i> Key Concepts
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">${conceptsHtml}</div>
      </div>
 
      <!-- PRZYKŁADY -->
      <div>
        <div class="exercise-label" style="font-size:12px; text-transform:uppercase; color:var(--accent); font-family:'Orbitron',sans-serif; letter-spacing:1px; margin-bottom:16px; display:flex; align-items:center; gap:8px; font-weight:700;">
          <i data-lucide="play-circle" style="width:16px;height:16px;"></i> Interactive Examples
        </div>
        <div>
          ${examplesHtml}
        </div>
      </div>
 
      <!-- ĆWICZENIA -->
      <div>
        <div class="exercise-label" style="font-size:12px; text-transform:uppercase; color:var(--accent); font-family:'Orbitron',sans-serif; letter-spacing:1px; margin-bottom:16px; display:flex; align-items:center; gap:8px; font-weight:700;">
          <i data-lucide="target" style="width:16px;height:16px;"></i> Practical Tasks
        </div>
        <div style="display:flex; flex-direction:column; gap:20px;">
          ${exercisesHtml}
        </div>
      </div>
 
      <!-- LESSON NAVIGATION -->
      <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
        ${id === 0 ? `<div></div>` : `
        <button class="btn btn-ghost" onclick="loadLesson(${id - 1})" style="display:flex; align-items:center; gap:8px;">
          <i data-lucide="arrow-left" style="width:14px;height:14px;"></i> Previous Lesson
        </button>
        `}
        
        ${id < LESSONS.length - 1 ? `
        <button class="btn btn-primary" id="next-btn" onclick="loadLesson(${id + 1})" ${!allExercisesDone ? 'style="opacity:0.5;pointer-events:none;" disabled' : ''} style="display:flex; align-items:center; gap:8px;">
          Next Lesson <i data-lucide="arrow-right" style="width:14px;height:14px;"></i>
        </button>
        ` : `
        <div></div>
        `}
      </div>
 
      <!-- COURSE COMPLETED FOOTER -->
      ${(id === LESSONS.length - 1 && allExercisesDone) ? `
      <div style="margin-top:16px; background:rgba(0,255,136,0.04); border:1px solid rgba(0,255,136,0.2); border-radius:12px; padding:32px 24px; text-align:center; box-shadow: 0 0 20px rgba(0,255,136,0.05);">
        <i data-lucide="trophy" style="width:40px;height:40px;color:var(--amber);margin-bottom:16px;display:inline-block;"></i>
        <div style="font-family:'Orbitron',sans-serif;font-size:20px;color:var(--green);margin-bottom:8px;font-weight:700;letter-spacing:1px;">CONGRATULATIONS! COURSE COMPLETED!</div>
        <div style="font-size:14px;color:var(--text2);line-height:1.6;max-width:600px;margin:0 auto;">You have mastered all 15 lessons of regular expressions – from basics to character classes, anchors, assertions, advanced tokenizers, and ReDoS safety. You are a true RegEx Grandmaster!</div>
      </div>` : ''}
    </div>`;

  lucide.createIcons();

  // Auto-run examples in panel
  l.examples.forEach((ex, i) => {
    applyRegex(ex.pattern, ex.flags, ex.text, `example-${l.id}-${i}`);
  });

  // Scroll to top
  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.scrollTo(0, 0);
}

export function runExample(lessonId, exIdx) {
  const ex = LESSONS[lessonId].examples[exIdx];
  const inputEl = document.getElementById(`example-input-${lessonId}-${exIdx}`);
  const flagsEl = document.getElementById(`example-flags-${lessonId}-${exIdx}`);
  const wrapperEl = document.getElementById(`example-wrapper-${lessonId}-${exIdx}`);

  if (!inputEl || !flagsEl) return;

  const pattern = inputEl.value;
  const flags = flagsEl.value;

  if (wrapperEl) wrapperEl.classList.remove('error');

  try {
    // Validating RegExp
    new RegExp(pattern, flags);
    applyRegex(pattern, flags, ex.text, `example-${lessonId}-${exIdx}`);
  } catch (e) {
    if (wrapperEl) wrapperEl.classList.add('error');
  }
}

export function resetExample(lessonId, exIdx) {
  const ex = LESSONS[lessonId].examples[exIdx];
  const inputEl = document.getElementById(`example-input-${lessonId}-${exIdx}`);
  const flagsEl = document.getElementById(`example-flags-${lessonId}-${exIdx}`);
  const wrapperEl = document.getElementById(`example-wrapper-${lessonId}-${exIdx}`);

  if (inputEl) inputEl.value = ex.pattern;
  if (flagsEl) flagsEl.value = ex.flags;
  if (wrapperEl) wrapperEl.classList.remove('error');

  applyRegex(ex.pattern, ex.flags, ex.text, `example-${lessonId}-${exIdx}`);
}

// ============================================================
// EXERCISE CHECK
// ============================================================
export function checkExercise(lessonId, exerciseIdx) {
  const l = LESSONS[lessonId];
  const ex = l.exercises[exerciseIdx];
  const patEl = document.getElementById(`ex-pattern-${lessonId}-${exerciseIdx}`);
  const flagsEl = document.getElementById(`ex-flags-${lessonId}-${exerciseIdx}`);
  const feedback = document.getElementById(`ex-feedback-${lessonId}-${exerciseIdx}`);
  const display = document.getElementById(`ex-display-${lessonId}-${exerciseIdx}`);
  const wrap = document.getElementById(`ex-pattern-wrap-${lessonId}-${exerciseIdx}`);

  if (!patEl || !flagsEl || !feedback || !display || !wrap) return;

  const pattern = patEl.value;
  const flags = flagsEl.value;

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

  // Check correctness
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
  const isCorrect = JSON.stringify(userMatchesSorted) === JSON.stringify(solutionMatchesSorted) || altOk;

  if (isCorrect && matchCount > 0) {
    feedback.innerHTML = `<div class="match-badge" style="background:rgba(0,255,136,0.08);border-color:rgba(0,255,136,0.2);color:var(--green);">
      <i data-lucide="check-circle" style="width:12px;height:12px;"></i> Correct! ${matchCount} match${matchCount === 1 ? '' : 'es'}
    </div>`;
    wrap.style.borderColor = 'var(--green)';

    // Mark exercise as completed
    const exKey = `${lessonId}-${exerciseIdx}`;
    if (!completedExercises.has(exKey)) {
      completedExercises.add(exKey);
      localStorage.setItem('regex_completed_exercises', JSON.stringify([...completedExercises]));

      // Check if all exercises for this lesson are completed
      const allExercisesDone = l.exercises.every((_, idx) => completedExercises.has(`${lessonId}-${idx}`));
      if (allExercisesDone && !completedLessons.has(lessonId)) {
        completedLessons.add(lessonId);
        localStorage.setItem('regex_completed', JSON.stringify([...completedLessons]));
      }

      // Update sidebar and progress
      renderSidebar();

      // Update exercise status badge dynamically in the DOM
      const badgeEl = document.getElementById(`ex-badge-${lessonId}-${exerciseIdx}`);
      if (badgeEl) {
        badgeEl.className = 'exercise-status-badge completed';
        badgeEl.innerHTML = '<i data-lucide="check-circle" style="width:12px;height:12px;color:var(--green);"></i> <span style="color:var(--green);font-weight:600;">Completed</span>';
        lucide.createIcons();
      }

      // If the lesson is completed, check if we need to enable the "Następna lekcja" button
      if (allExercisesDone) {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
          nextBtn.removeAttribute('disabled');
          nextBtn.style.opacity = '1';
          nextBtn.style.pointerEvents = 'auto';
        }
      }

      // Flash
      wrap.classList.add('correct-flash');
      setTimeout(() => wrap.classList.remove('correct-flash'), 600);
    }
  } else if (matchCount === 0) {
    feedback.innerHTML = `<div class="match-badge no-match"><i data-lucide="x-circle" style="width:12px;height:12px;"></i> No matches</div>`;
    wrap.style.borderColor = '';
  } else {
    feedback.innerHTML = `<div class="match-badge" style="background:rgba(255,179,0,0.08);border-color:rgba(255,179,0,0.2);color:var(--amber);">
      <i data-lucide="zap" style="width:12px;height:12px;"></i> ${matchCount} match${matchCount === 1 ? '' : 'es'} — check if it matches the target
    </div>`;
    wrap.style.borderColor = '';
  }
  lucide.createIcons();
}

export function showHint(lessonId, exerciseIdx) {
  const h = document.getElementById(`hint-box-${lessonId}-${exerciseIdx}`);
  if (h) h.style.display = h.style.display === 'none' ? 'block' : 'none';
}

// ============================================================
// NAV TABS (top-level)
// ============================================================
export function setView(view) {
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  const sidebar = document.getElementById('sidebar');
  if (view === 'lessons') {
    loadLesson(currentLesson);
    if (sidebar) sidebar.style.display = '';
  } else if (view === 'playground') {
    if (sidebar) sidebar.style.display = 'none';
    renderPlayground();
  } else if (view === 'cheatsheet') {
    if (sidebar) sidebar.style.display = 'none';
    renderCheatsheet();
  }
}

export function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (sb) sb.classList.toggle('open');
}

export function toggleGroup(groupIdx) {
  if (collapsedGroups.has(groupIdx)) {
    collapsedGroups.delete(groupIdx);
  } else {
    collapsedGroups.add(groupIdx);
  }
  renderSidebar();
}

// ============================================================
// BIND GLOBAL HANDLERS
// ============================================================
window.loadLesson = loadLesson;
window.runExample = runExample;
window.resetExample = resetExample;
window.checkExercise = checkExercise;
window.showHint = showHint;
window.setView = setView;
window.toggleSidebar = toggleSidebar;
window.toggleGroup = toggleGroup;
window.changeTheme = changeTheme;

export function changeTheme(themeId) {
  setTheme(themeId);
  renderSidebar();
  loadLesson(currentLesson);
  lucide.createIcons();
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const topNav = document.getElementById('top-nav-container');
  if (topNav) {
    topNav.innerHTML = `
      <button class="nav-tab active" data-view="lessons" onclick="setView('lessons')">
        <i data-lucide="book-open" style="width:14px;height:14px;"></i>
        <span>Lessons</span>
      </button>
      <button class="nav-tab" data-view="playground" onclick="setView('playground')">
        <i data-lucide="flask-conical" style="width:14px;height:14px;"></i>
        <span>Playground</span>
      </button>
      <button class="nav-tab" data-view="cheatsheet" onclick="setView('cheatsheet')">
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
      optionsHtml += `<option value="${key}" ${selected}>${theme.name}</option>`;
    });

    selectorContainer.innerHTML = `
      <select id="theme-selector" class="theme-select">
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

  // Migration for old completed lessons:
  if (completedLessons.size > 0 && completedExercises.size === 0) {
    completedLessons.forEach(lessonId => {
      completedExercises.add(`${lessonId}-0`);
    });
    localStorage.setItem('regex_completed_exercises', JSON.stringify([...completedExercises]));
  }

  renderSidebar();
  loadLesson(0);
  lucide.createIcons();
});
