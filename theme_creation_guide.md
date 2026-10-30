# AI Agent Guide: Creating and Registering Themes in RegEx Lab

This guide explains how an autonomous AI agent can create, format, and register a new curriculum theme for the RegEx Lab application.

---

## 1. Directory Structure

All themes must reside in the `js/themes/` directory as standalone ES modules:

```text
js/
├── lessons.js             # Central Theme Registry & Controller
└── themes/
    ├── standard.js        # Default Developer Theme
    ├── liminal.js         # Liminal Space Theme
    ├── cyberpunk.js       # Cyberpunk Grid Theme
    ├── celeste.js         # Celeste Video Game Theme
    └── [new_theme].js     # YOUR NEW THEME FILE
```

---

## 2. Curriculum Data Schema

A theme file must export a single array containing exactly **15 lessons** (IDs `0` through `14`). Each lesson must follow this structure:

```javascript
export const themeName = [
  {
    id: 0, // Integer 0 to 14
    title: "Lesson Title", // Thematic title
    difficulty: "beginner", // "beginner", "intermediate", "advanced", "expert", "master"
    icon: "book-open", // Lucide icon identifier (e.g. "repeat", "shield", "cpu", "terminal")
    intro: "Thematic narrative introduction...", // 1-3 sentences
    concepts: [
      { key: "/pattern/", desc: "Thematic concept description" }
    ],
    theory: `<p>HTML theoretical explanation text...</p>`,
    examples: [
      { 
        pattern: "target", 
        flags: "g", 
        text: "Testing string for matches...", 
        desc: "Explanation of match behavior" 
      }
    ],
    exercises: [
      // Exactly 4 exercises
      {
        task: "Instructions for the user...", // Can use HTML markup
        text: "The target text block containing the correct strings.",
        solution: "regex_pattern", // The validation string
        altSolutions: ["alt_pattern_1", "alt_pattern_2"], // Optional alternative patterns
        flags: "g", // Engine flags: "g", "gi", "gm", "gs", "y"
        hint: "Helpful hint for the user..."
      }
    ]
  },
  // ... repeats for IDs 1 through 14
];
```

### Critical Rules for Lessons
- **Matching targets**: If your theme changes the words in `text` (e.g., from *door* to *nexus*), you **must** update the `solution` and `task` to reflect those words.
- **AltSolutions**: Include alternative valid RegEx patterns in `altSolutions` (e.g., `\\d` and `[0-9]`) to keep validation flexible.
- **Flag alignment**: Ensure the `flags` property matches the complexity of the task (e.g. `gm` for anchor validations, `gs` for multiline searches).

---

## 3. Step-by-Step Implementation Workflow

To add a new theme (e.g., `fantasy`):

### Step 1: Create the Theme File
Create `js/themes/fantasy.js` and structure it using the schema above.
```javascript
export const fantasy = [
  // 15 themed lessons here
];
```

### Step 2: Register the Theme in `lessons.js`
Open `js/lessons.js` and register your theme:

1. **Import the module**:
   ```javascript
   import { fantasy } from './themes/fantasy.js';
   ```

2. **Add to the `THEMES` registry object**:
   ```javascript
   export const THEMES = {
     // ... existing themes
     fantasy: {
       id: 'fantasy',
       name: 'Fantasy Magic',
       lessons: fantasy
     }
   };
   ```
