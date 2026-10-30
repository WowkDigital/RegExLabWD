# RegEx Lab — Cyberpunk Edition (Interactive Regular Expressions Course)

RegEx Lab is a modern, responsive, and gamified single-page application for mastering JavaScript Regular Expressions (RegEx). Featuring a signature **Cyberpunk Grid** primary aesthetic and curriculum, the platform structures your learning trajectory around practical real-world workload, separating core high-frequency concepts (covering 80% of daily programming) from extended toolkits and specialized hardening protocols.

---

## 🚀 Key Features & Curriculum Architecture

### 1. Pragmatic 3-Tier Curriculum Structure
Rather than arbitrary levels, lessons are structured around real-world utility:
- **Section 1: Core Essentials (80% Daily Use)**:
  - `0. Breaching the Grid`: Literal Pattern Matching & Search Modifiers (`/pattern/gi`) — *1 ECTS*
  - `1. Subnet Scanning`: Character Classes & Negation (`[abc]`, `[^abc]`, `[0-9]`) — *2 ECTS*
  - `2. Mainframe Shorthands`: Shorthand Classes (`\d`, `\w`, `\s`) & Boundaries — *2 ECTS*
  - `3. Data Streams`: Quantifiers & Greediness (`*`, `+`, `?`, `{min,max}`) — *2 ECTS*
  - `4. Signal Boundaries`: Line & Word Anchors (`^`, `$`, `\b`, `\B`) — *2 ECTS*
  - `5. Routing & Multiplexing`: Alternation (`|`) & Capturing Groups (`(...)`) — *3 ECTS*
- **Section 2: Extended Toolkit (Advanced Matching & Transformation)**:
  - `6. Lookaround Scans`: Positive & Negative Lookahead/Lookbehind (`(?=...)`, `(?!...)`, `(?<=...)`, `(?<!...)`) — *3 ECTS*
  - `7. Named Registers`: Group Backreferences (`\1`, `\k<name>`) & Memory Slots — *3 ECTS*
  - `8. Operational Flags`: Multiline (`m`), DotAll (`s`), Unicode (`u`), and Indices (`d`) — *3 ECTS*
  - `10. Payload Injection`: Dynamic Substitution & Replacements via `str.replace()` — *3 ECTS*
- **Section 3: Specialized Operations & Engine Hardening**:
  - `9. Buffer Overflows`: Catastrophic Backtracking & ReDoS Prevention — *4 ECTS*
  - `11. Credential Scrypts`: Strict Fully-Anchored Production Validation Schemas — *4 ECTS*
  - `12. Sticky Tokens`: High-Speed Stream Lexing via the Sticky Flag (`/y`) — *4 ECTS*
  - `13. Quantum Gates`: Emulating Conditional Logic (IF-THEN-ELSE) in RegExp — *5 ECTS*
  - `14. Icebreaker Protocols`: Deterministic Pattern Audits & CPU Hardening — *5 ECTS*

### 2. Dual Curriculum Modes: Standard vs. Deep Dive
- **Standard Mode**: Concise technical overview, key concepts, interactive examples, and 4 core hands-on tasks per lesson.
- **Deep Dive (Extended Mode)**: Unlocks low-level engine architecture breakdowns (V8 Irregexp internals, DFA/NFA state machines, bitset lookup tables, time complexity proofs) along with **Bonus Deep Dive Tasks**.

### 3. Smart Hint & Progressive Solution Reveal
- Click **Hint** for a contextual nudge on how to construct the pattern.
- If you're stuck, the expanded hint reveals a **Reveal Solution** button.
- Inspect the exact pattern and click **Insert & Test** to automatically populate the input and run live validation.

### 4. Precision Monospace Token Formatting
- Tasks explicitly highlight exact search targets using `<code class="target-token">...</code>`, eliminating punctuation ambiguity (e.g., separating sentence-ending periods from regex tokens).

### 5. Workload Points (ECTS Credit System)
- Replaces traditional difficulty labels with ECTS workload credits (1 to 5 ECTS per lesson, 46 ECTS total).
- Real-time ECTS progress tracker and fill meter in the header.

### 6. Interactive Playground & Comprehensive Cheatsheet
- **Playground**: Test custom expressions on live text with capturing group color highlights and match indices inspection.
- **Cheatsheet**: Quick searchable reference of all JavaScript RegEx constructs and production-ready patterns (RFC email, URL, IPv4, ISO date, PESEL, NIP).

---

## 🛠️ Tech Stack

- **Markup**: Semantic HTML5 (ARIA attributes for accessibility)
- **Styling**: Hand-crafted Vanilla CSS (Custom tokens, animations, responsive sidebar drawer)
- **Logic**: Modern JavaScript (ES Modules, ECMAScript RegExp flags `d`, `g`, `s`, `u`, `y`)
- **Icons**: Lucide Icons
- **Fonts**: Orbitron, JetBrains Mono, Plus Jakarta Sans, Share Tech Mono

---

## 💻 Running the Project Locally

Because the application uses native **JavaScript ES Modules**, modern browsers enforce CORS restrictions on the `file://` protocol. Serve the folder using a local HTTP server:

```bash
# Using Python 3:
python -m http.server 8080

# Or using Node.js npx:
npx serve -l 8080 .
```

Navigate to: [http://localhost:8080](http://localhost:8080)

---

## 📄 License

Licensed under the [MIT License](https://opensource.org/licenses/MIT).
