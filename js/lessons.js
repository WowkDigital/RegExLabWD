import { cyberpunk } from './themes/cyberpunk.js';
import { standard } from './themes/standard.js';
import { liminal } from './themes/liminal.js';
import { celeste } from './themes/celeste.js';

export const THEMES = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Grid (Primary)',
    lessons: cyberpunk
  },
  standard: {
    id: 'standard',
    name: 'Standard Developer',
    lessons: standard
  },
  liminal: {
    id: 'liminal',
    name: 'Liminal Space',
    lessons: liminal
  },
  celeste: {
    id: 'celeste',
    name: 'Celeste (video game)',
    lessons: celeste
  }
};

export const LESSONS = [];

export let currentThemeId = localStorage.getItem('regex_theme') || 'cyberpunk';

export function setTheme(themeId) {
  if (!THEMES[themeId]) {
    themeId = 'cyberpunk';
  }
  currentThemeId = themeId;
  localStorage.setItem('regex_theme', themeId);
  
  const selectedTheme = THEMES[themeId];
  LESSONS.splice(0, LESSONS.length, ...selectedTheme.lessons);
}

// Initialize on load with Cyberpunk as primary
setTheme(currentThemeId);
