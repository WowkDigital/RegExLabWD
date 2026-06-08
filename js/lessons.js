import { standard } from './themes/standard.js';
import { liminal } from './themes/liminal.js';
import { cyberpunk } from './themes/cyberpunk.js';

export const THEMES = {
  liminal: {
    id: 'liminal',
    name: 'Liminal Space',
    lessons: liminal
  },
  standard: {
    id: 'standard',
    name: 'Standard Developer',
    lessons: standard
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Grid',
    lessons: cyberpunk
  }
};

export const LESSONS = [];

export let currentThemeId = localStorage.getItem('regex_theme') || 'liminal';

export function setTheme(themeId) {
  if (!THEMES[themeId]) {
    themeId = 'liminal';
  }
  currentThemeId = themeId;
  localStorage.setItem('regex_theme', themeId);
  
  const selectedTheme = THEMES[themeId];
  LESSONS.splice(0, LESSONS.length, ...selectedTheme.lessons);
}

// Initialize on load
setTheme(currentThemeId);
