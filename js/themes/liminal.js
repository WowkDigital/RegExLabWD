export const liminal = [
  // --- LEVEL 1: BEGINNER ---
  {
    id: 0, title: "Echoes of the Corridor", difficulty: "beginner",
    icon: "book-open",
    intro: "You find yourself standing in an endless, cream-colored hallway with carpet that smells faintly of old rain. To escape, you must decode the repeating signals echoing from the walls. Literal patterns search for exact sequences of characters hidden in the hum of fluorescent lights.",
    concepts: [
      { key: "/pattern/", desc: "Literal match — looks for exact remnants of the past" },
      { key: "g", desc: "Global flag — scan the entire corridor, not just the nearest door" },
      { key: "i", desc: "Case-insensitive flag — ignore the volume of the echo (upper/lowercase)" },
    ],
    theory: `
<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
RegEx is a miniature language used to describe <strong style="color:var(--text)">textual patterns</strong>.
Instead of asking "does this hallway contain a door?", you write the pattern <code style="color:var(--accent)">/door/</code> and the engine scans the entire space.
</p>
<p style="color:var(--text2);line-height:1.8;">
In JavaScript, you write regular expressions between slashes: <code style="color:var(--accent)">/pattern/flags</code><br>
Or use the constructor: <code style="color:var(--accent)">new RegExp("pattern", "flags")</code>
</p>`,
    examples: [
      { pattern: "door", flags: "gi", text: "A door appears. Another DOOR stands locked. Behind the third Door is static.", desc: "Global flag g finds all occurrences; case-insensitive flag i ignores capitalization." },
      { pattern: "room", flags: "g", text: "This room is empty. That room is yellow. The next ROOM is gone.", desc: "Without flag i, we only match lowercase rooms." },
      { pattern: "hum", flags: "i", text: "Hear the low HUM.", desc: "Without flag g, we only match the first occurrence." }
    ],
    exercises: [
      {
        task: "Find the word <strong style='color:var(--accent)'>door</strong> in the hum of the walls (ignore case, find all).",
        text: "There is a Door here. Another door is down the hall. A third DOOR is locked.",
        solution: "door",
        flags: "gi",
        hint: "Write 'door' and make sure both g and i flags are enabled."
      },
      {
        task: "Find the word <strong style='color:var(--accent)'>hall</strong> (ignore case, find all).",
        text: "The Hall is empty. This hall has yellow wallpaper. Another HALL leads nowhere.",
        solution: "hall",
        flags: "gi",
        hint: "Match 'hall' with global and case-insensitive flags."
      },
      {
        task: "Find the word <strong style='color:var(--accent)'>echo</strong> (exact lowercase match, all occurrences).",
        text: "The echo returns. Hear the echo. An ECHO fades.",
        solution: "echo",
        flags: "g",
        hint: "Do not use the i flag, as we only want lowercase matches."
      },
      {
        task: "Find the word <strong style='color:var(--accent)'>light</strong> (ignore case, all occurrences).",
        text: "Light flickers. The fluorescent light hums. LIGHT shines yellow.",
        solution: "light",
        flags: "gi",
        hint: "Enter the word 'light' and use the gi flags."
      }
    ]
  },
  {
    id: 1, title: "The Abandoned Playroom", difficulty: "beginner",
    icon: "brackets",
    intro: "An empty playroom with a ball pool sits under a single flickering neon light. Character classes allow you to match a single character from a specific set. It is like searching the pool for only red, blue, or yellow spheres.",
    concepts: [
      { key: "[abc]", desc: "Any character: a, b, or c" },
      { key: "[a-z]", desc: "Range: any lowercase letter" },
      { key: "[^abc]", desc: "Negation: any character except a, b, or c" },
      { key: "[0-9]", desc: "Any digit 0–9" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Square brackets <code style="color:var(--accent)">[ ]</code> define a character class. The pattern will match exactly <strong style="color:var(--text)">one character</strong> from this class.
</p>
<p style="color:var(--text2);line-height:1.8;">
Inside a class, use <code style="color:var(--accent)">-</code> to specify a range (e.g., <code style="color:var(--accent)">a-z</code>) and <code style="color:var(--accent)">^</code> at the start for negation.
Outside a class, <code style="color:var(--accent)">^</code> means the start of the string.
</p>`,
    examples: [
      { pattern: "[aeiouAEIOU]", flags: "g", text: "This lobby is empty.", desc: "Find all vowels." },
      { pattern: "[^a-zA-Z ]", flags: "g", text: "Level_0: hum #99?", desc: "Find everything that is NOT a letter or a space." },
      { pattern: "[0-9a-fA-F]", flags: "g", text: "Room code: #FF33A9", desc: "Find all hexadecimal digits." }
    ],
    exercises: [
      {
        task: "Write a pattern that finds only <strong style='color:var(--accent)'>digits</strong> in the coordinates of the pool room.",
        text: "+00 (45) 808-12-99",
        solution: "[0-9]",
        altSolutions: ["\\d"],
        flags: "g",
        hint: "Use the character class [0-9] or the shorthand \\d."
      },
      {
        task: "Write a pattern that finds only the letters <strong style='color:var(--accent)'>a, b, or c</strong> (case-sensitive).",
        text: "A vacant lobby: an empty cabinet, a cold breeze. Abrupt static.",
        solution: "[abc]",
        flags: "g",
        hint: "Use square brackets [ ] and place the allowed characters inside."
      },
      {
        task: "Write a pattern that finds all characters <strong style='color:var(--accent)'>except lowercase vowels</strong> (a, e, i, o, u, y).",
        text: "Liminal Lab",
        solution: "[^aeiouy]",
        flags: "gi",
        hint: "Use negation in the character class: [^...]. Make sure to use the gi flags."
      },
      {
        task: "Match the characters <strong style='color:var(--accent)'>x, y, or z</strong> (case-insensitive, all occurrences).",
        text: "X-ray room, Yellow wallpaper, Zebra crossing, x, y, z.",
        solution: "[xyz]",
        flags: "gi",
        hint: "Use the class [xyz] with flags g and i."
      }
    ]
  },
  {
    id: 2, title: "The Hum of the Office", difficulty: "beginner",
    icon: "type",
    intro: "An infinite grid of empty office cubicles under buzzing lights. The air is still. Shorthand classes like \\d, \\w, and \\s are quick codes to navigate this repeating workspace.",
    concepts: [
      { key: "\\d", desc: "Digit [0-9]" },
      { key: "\\D", desc: "Non-digit [^0-9]" },
      { key: "\\w", desc: "Word character [a-zA-Z0-9_]" },
      { key: "\\W", desc: "Non-word character" },
      { key: "\\s", desc: "Whitespace character (space, tab, newline)" },
      { key: "\\S", desc: "Non-whitespace character" },
      { key: ".", desc: "Any character (except newline)" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Remember the rule: <strong style="color:var(--text)">lowercase letter = positive class</strong>, <strong style="color:var(--text)">uppercase letter = negation</strong>.
<code style="color:var(--accent)">\\d</code> is a digit, <code style="color:var(--accent)">\\D</code> is a non-digit.
</p>
<p style="color:var(--text2);line-height:1.8;">
The dot <code style="color:var(--accent)">.</code> is special — it matches <em>almost</em> any character. With the <code style="color:var(--accent)">s</code> flag, it matches newlines too.
If you want to match a literal dot, escape it: <code style="color:var(--accent)">\\.</code>
</p>`,
    examples: [
      { pattern: "\\d+", flags: "g", text: "Cubicle 404 is empty since 1999-12-31.", desc: "\\d+ matches sequences of digits." },
      { pattern: "\\w+", flags: "g", text: "hello_world! office-space room123", desc: "\\w+ matches word characters (excluding hyphens)." },
      { pattern: "\\S+", flags: "g", text: "No one here. $10 left on a desk!", desc: "\\S+ matches non-whitespace sequences." }
    ],
    exercises: [
      {
        task: "Extract the <strong style='color:var(--accent)'>sector code</strong> (format: XX-XXX) from the label. Use \\d and a literal hyphen.",
        text: "Sector Code: 30-059, Room 102",
        solution: "\\d{2}-\\d{3}",
        altSolutions: ["[0-9]{2}-[0-9]{3}"],
        flags: "g",
        hint: "Format is 2 digits, a hyphen, then 3 digits. Use \\d{n} for repetitions."
      },
      {
        task: "Find all <strong style='color:var(--accent)'>whitespace characters</strong> (spaces, tabs, newlines) in the description.",
        text: "Office\tcubicle\nnumber\t404.",
        solution: "\\s",
        flags: "g",
        hint: "Use the shorthand class \\s."
      },
      {
        task: "Match a sequence consisting of the letter 'a', <strong style='color:var(--accent)'>any character</strong>, and the letter 'b'.",
        text: "axb, a-b, a.b, ab, a b, abb, acb",
        solution: "a.b",
        flags: "g",
        hint: "The dot . matches any single character."
      },
      {
        task: "Match any character that is <strong style='color:var(--accent)'>NOT a word character</strong> (neither letter, digit, nor underscore).",
        text: "Cabinet_1: $99.99!",
        solution: "\\W",
        flags: "g",
        hint: "Use the uppercase negation: \\W matches non-word characters."
      }
    ]
  },
  // --- LEVEL 2: INTERMEDIATE ---
  {
    id: 3, title: "The Endless Staircase", difficulty: "intermediate",
    icon: "repeat",
    intro: "You walk down a concrete staircase. It seems to go down forever. Quantifiers specify how many times a character or group should repeat, letting you match corridors of varying lengths.",
    concepts: [
      { key: "*", desc: "0 or more times (greedy)" },
      { key: "+", desc: "1 or more times (greedy)" },
      { key: "?", desc: "0 or 1 time (optional)" },
      { key: "{n}", desc: "Exactly n times" },
      { key: "{n,m}", desc: "From n to m times" },
      { key: "{n,}", desc: "At least n times" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
By default, quantifiers are <strong style="color:var(--accent)">greedy</strong> — they match as much text as possible.
Adding <code style="color:var(--accent)">?</code> after a quantifier (<code style="color:var(--accent)">+?</code>, <code style="color:var(--accent)">*?</code>) makes it <strong style="color:var(--green)">lazy</strong> — matching as little as possible.
</p>
<p style="color:var(--text2);line-height:1.8;">
Greedy vs Lazy example:<br>
<code style="color:var(--amber)">&lt;.+&gt;</code> on <code style="color:var(--text)">"&lt;div&gt;lobby&lt;/div&gt;"</code> matches the whole string.<br>
<code style="color:var(--green)">&lt;.+?&gt;</code> matches only <code style="color:var(--text)">"&lt;div&gt;"</code>.
</p>`,
    examples: [
      { pattern: "\\d{3}-\\d{3}-\\d{3}", flags: "g", text: "Room: 123-456-789 or 12-34-56 or 987-654-321", desc: "Matches exactly 3-3-3 digits separated by hyphens." },
      { pattern: "colou?r", flags: "gi", text: "The colour of the walls is yellow. The color of the carpet is gray. COLOUR!", desc: "? makes 'u' optional — matching both colour and color." },
      { pattern: "\\b\\d{4,}\\b", flags: "g", text: "Years: 12, 123, 1999, 12345, 123456.", desc: "At least 4 digits at word boundaries." }
    ],
    exercises: [
      {
        task: "Match all <strong style='color:var(--accent)'>HTML tags</strong> in the static TV noise (e.g., &lt;b&gt;, &lt;/p&gt;). Use lazy matching.",
        text: "<h1>Lobby</h1> <p class=\"intro\">The carpet is <b>wet</b> and <i>cold</i>.</p>",
        solution: "<.+?>",
        flags: "g",
        hint: "Use < followed by any characters lazily, ending with >. Write <.+?>"
      },
      {
        task: "Match the words <strong style='color:var(--accent)'>door</strong> and <strong style='color:var(--accent)'>doors</strong> (where 's' is optional).",
        text: "Open the door. Many doors are locked here.",
        solution: "doors?",
        flags: "g",
        hint: "Use ? to mark 's' as optional (0 or 1 times)."
      },
      {
        task: "Find words consisting of <strong style='color:var(--accent)'>3 to 5 letters</strong>.",
        text: "The yellow wallpaper smells damp and old.",
        solution: "\\b\\w{3,5}\\b",
        flags: "g",
        hint: "Use word boundaries \\b at the start and end, and the quantifier {3,5}."
      },
      {
        task: "Find digit sequences of length <strong style='color:var(--accent)'>exactly 4 digits</strong> (like room years).",
        text: "Year 1973, 1999, 2026 and levels 12, 104, 12345.",
        solution: "\\b\\d{4}\\b",
        flags: "g",
        hint: "Use word boundaries \\b and the quantifier {4} on the digit shorthand class."
      }
    ]
  },
  {
    id: 4, title: "The Thresholds", difficulty: "intermediate",
    icon: "anchor",
    intro: "An empty hallway ends with a heavy fire door. Anchors do not match characters — they match POSITIONS. They let you determine where a pattern must stand: at the threshold of a line or a word.",
    concepts: [
      { key: "^", desc: "Start of string / line (with m flag)" },
      { key: "$", desc: "End of string / line (with m flag)" },
      { key: "\\b", desc: "Word boundary" },
      { key: "\\B", desc: "Non-word boundary" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
<code style="color:var(--accent)">\\b</code> is the boundary between a word character <code style="color:var(--accent)">\\w</code> and a non-word character <code style="color:var(--accent)">\\W</code>.
This ensures that <code style="color:var(--accent)">\\broom\\b</code> matches "room" but not "groom" or "rooms".
</p>
<p style="color:var(--text2);line-height:1.8;">
With the <code style="color:var(--accent)">m</code> flag (multiline), <code style="color:var(--accent)">^</code> and <code style="color:var(--accent)">$</code> match the start and end of each line individually, rather than the entire string.
</p>`,
    examples: [
      { pattern: "\\broom\\b", flags: "gi", text: "This room is yellow. Welcome to the ballroom. Roommate is gone. A locked room.", desc: "\\b isolates the exact word." },
      { pattern: "^\\d+", flags: "gm", text: "1. First corridor\n2. Second doorway\n  3. Indented passage\n4. Last room", desc: "^ with flag m matches digits at the start of each line." },
      { pattern: "\\b\\w+ing\\b", flags: "g", text: "Walking and huming in this confusing place.", desc: "Words ending in 'ing' at word boundaries." }
    ],
    exercises: [
      {
        task: "Use anchors <strong style='color:var(--accent)'>^ and $</strong> (with flag m) to match lines starting with \"WARN\".",
        text: "INFO: hum active\nWARN: water leak detected\nINFO: elevator offline\nWARN: loop detected\nDEBUG: scan complete",
        solution: "^WARN.*$",
        flags: "gm",
        hint: "^WARN matches lines starting with WARN. .* matches the rest. $ ends the match."
      },
      {
        task: "Match words that <strong style='color:var(--accent)'>end in 'ing'</strong>. Use word boundary \\b.",
        text: "I was walking and running, but a warning light is glowing.",
        solution: "\\b\\w+ing\\b",
        flags: "g",
        hint: "Start with \\b, match letters with \\w+, end with 'ing' and another \\b."
      },
      {
        task: "Match a <strong style='color:var(--accent)'>number</strong> located exactly at the end of a line.",
        text: "Level 100\n200 is locked\nSector 30-059\nRoom 2026",
        solution: "\\d+$",
        flags: "gm",
        hint: "Use flag m so that $ matches the end of each line. Match digits with \\d+."
      },
      {
        task: "Match the word <strong style='color:var(--accent)'>start</strong>, but only when it appears at the very beginning of a line (with flag m).",
        text: "start the hum\njust start\nstart the loop",
        solution: "^start",
        flags: "gm",
        hint: "Place the start anchor ^ at the beginning of your pattern."
      }
    ]
  },
  {
    id: 5, title: "The Parallel Rooms", difficulty: "intermediate",
    icon: "git-branch",
    intro: "Two identical doors stand side-by-side. Behind one is a staircase; behind the other, an empty swimming pool. Groups bundle patterns, and alternation acts as a logical OR between paths.",
    concepts: [
      { key: "(abc)", desc: "Capturing group" },
      { key: "(?:abc)", desc: "Non-capturing group" },
      { key: "a|b", desc: "Alternation: a OR b" },
      { key: "\\1", desc: "Backreference — match the same text as group 1" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Capturing groups <code style="color:var(--accent)">()</code> save the matched substring — you can reference it later via <code style="color:var(--accent)">\\1</code>, <code style="color:var(--accent)">\\2</code>, etc.
</p>
<p style="color:var(--text2);line-height:1.8;">
A backreference <code style="color:var(--accent)">\\1</code> matches the <em>exact same text</em> matched by the first group, which is perfect for detecting repeating sequences in the architecture.
</p>`,
    examples: [
      { pattern: "(\\w+)\\s\\1", flags: "gi", text: "This is is a loop. Nothing nothing changes. Hello world.", desc: "Backreference \\1 matches duplicate words." },
      { pattern: "(hall|lobby|pool|yard)\\.?", flags: "gi", text: "The pool is blue. Enter the hall. The lobby is empty. Back to the pool.", desc: "Alternation matches any of the listed spaces." },
      { pattern: "(?:level)?\\d{3}", flags: "g", text: "level104 or 404 or level888", desc: "Non-capturing group (?:...) groups the prefix without saving it in the group index." }
    ],
    exercises: [
      {
        task: "Use capturing groups to extract the <strong style='color:var(--accent)'>protocol and host</strong> from these internal terminal URLs.",
        text: "Visit http://terminal.local or https://sector.net or ftp://storage.node",
        solution: "(https?|ftp):\\/\\/([\\w.-]+)",
        flags: "g",
        hint: "Pattern: (protocol)://(host). Protocol is http, https, or ftp."
      },
      {
        task: "Match dates in format <strong style='color:var(--accent)'>DD.MM.YYYY</strong> or <strong style='color:var(--accent)'>DD/MM/YYYY</strong>, ensuring the separators are identical in both spots.",
        text: "Date: 09.06.2026, yesterday was 08/06/2026. Invalid date: 09/06.2026.",
        solution: "(\\d{2})([./])(\\d{2})\\2(\\d{4})",
        flags: "g",
        hint: "Group 2 is the separator ([./]). Use \\2 to match the same separator for the second occurrence."
      },
      {
        task: "Match log filenames that end in <strong style='color:var(--accent)'>.log, .txt, or .bak</strong>. Use alternation in a non-capturing group.",
        text: "system.log, readme.txt, draft.doc, backup.bak, script.js",
        solution: "\\w+\\.(?:log|txt|bak)",
        flags: "g",
        hint: "Use a non-capturing group (?:log|txt|bak) after the escaped dot \\. (remember to escape the dot!)."
      },
      {
        task: "Match the designations <strong style='color:var(--accent)'>Sector</strong> or <strong style='color:var(--accent)'>Room</strong> followed by a space and a word/number.",
        text: "Sector A, Room 104, Sector 9.",
        solution: "(?:Sector|Room)\\s\\w+",
        flags: "g",
        hint: "Use alternation (Sector|Room), a whitespace \\s, and word characters \\w+."
      }
    ]
  },
  // --- LEVEL 3: ADVANCED ---
  {
    id: 6, title: "The Whispering Walls", difficulty: "advanced",
    icon: "eye",
    intro: "You feel like you're being watched, but when you turn around, the hallway is empty. Lookarounds check what lies ahead or behind a pattern without consuming the characters — like scanning around corners.",
    concepts: [
      { key: "(?=abc)", desc: "Positive lookahead — must be followed by abc" },
      { key: "(?!abc)", desc: "Negative lookahead — must NOT be followed by abc" },
      { key: "(?<=abc)", desc: "Positive lookbehind — must be preceded by abc" },
      { key: "(?<!abc)", desc: "Negative lookbehind — must NOT be preceded by abc" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Crucial: lookarounds <strong style="color:var(--text)">do not consume characters</strong>. The engine asserts if the condition matches, but the characters are not included in the matched result.
</p>
<p style="color:var(--text2);line-height:1.8;">
For example, <code style="color:var(--accent)">\\d+(?=\\s*sqft)</code> matches digits preceding "sqft", but "sqft" itself is not part of the match.
This is perfect for parsing values from structural logs.
</p>`,
    examples: [
      { pattern: "\\d+(?=\\s*sqft)", flags: "g", text: "Lobby: 1200 sqft, Pool: 3000 sqft, Corridor: 400", desc: "Positive lookahead — numbers followed by 'sqft'." },
      { pattern: "(?<=#)\\w+", flags: "g", text: "room#104, sector#A, level#0", desc: "Positive lookbehind — words preceded by '#'." },
      { pattern: "\\b\\w+(?!ing)\\b", flags: "g", text: "We are walking inside a strange dark room", desc: "Negative lookahead — words not ending in 'ing'." },
      { pattern: "(?<!-)\\b\\d+\\b", flags: "g", text: "Floor is 4, temp is -10, pressure is +100", desc: "Negative lookbehind — match numbers not preceded by a minus sign." }
    ],
    exercises: [
      {
        task: "Use <strong style='color:var(--accent)'>lookbehind</strong> to extract only the <strong>room numbers</strong> (without the prefix symbol '#') from the ledger.",
        text: "Stairs: #1299, Kitchen: #29, Lounge: #599, Office: #149, Elevator: #89",
        solution: "(?<=\\#)\\d+",
        flags: "g",
        hint: "(?<=\\#) is a positive lookbehind that matches digits preceded by #."
      },
      {
        task: "Match numbers that are immediately followed by the unit <strong style='color:var(--accent)'>hz</strong> (but do not include 'hz' in the match).",
        text: "hum: 60hz; light: 120hz; room: 10m; signal: 50hz;",
        solution: "\\d+(?=hz)",
        flags: "g",
        hint: "Use positive lookahead (?=hz) after the digit pattern \\d+."
      },
      {
        task: "Find the word 'room' only when it is NOT followed by 'key'.",
        text: "roomkey, roomcode, empty room, roomcard, room service",
        solution: "room(?!key)",
        flags: "g",
        hint: "Use negative lookahead (?!key) after the word room."
      },
      {
        task: "Match <strong style='color:var(--accent)'>integers</strong> (whole words) that are NOT preceded by a minus sign <strong style='color:var(--accent)'>-</strong>.",
        text: "Levels: 42, -10, 100, -5, 999.",
        solution: "(?<!-)\\b\\d+\\b",
        flags: "g",
        hint: "Use negative lookbehind (?<!-) and a word boundary before \\d+."
      }
    ]
  },
  {
    id: 7, title: "The Named Doors", difficulty: "advanced",
    icon: "tag",
    intro: "Instead of calling doors by indexes like Door 1 and Door 2, you label them. Named groups make your patterns self-documenting and resilient to changes in structure.",
    concepts: [
      { key: "(?<name>...)", desc: "Named capturing group" },
      { key: "\\k<name>", desc: "Backreference to named group" },
      { key: "match.groups.name", desc: "Access in JS via .groups object" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Named capturing groups are an elegant alternative to numbered groups, especially when dealing with complex patterns that extract multiple fields.
</p>
<div class="code-block" style="padding:14px 16px;margin:12px 0;">
<span style="color:var(--text3);font-size:11px;">JAVASCRIPT</span>
<pre style="color:var(--text);font-size:13px;margin-top:8px;">const re = /(?&lt;year&gt;\\d{4})-(?&lt;month&gt;\\d{2})-(?&lt;day&gt;\\d{2})/;
const m = "2026-06-09".match(re);
console.log(m.groups.year);  // "2026"
console.log(m.groups.month); // "06"
console.log(m.groups.day);   // "09"</pre>
</div>`,
    examples: [
      { pattern: "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})", flags: "g", text: "Opened: 1973-05-20, Closed: 2015-08-14, Today: 2026-06-09", desc: "Parse ISO dates with named groups." },
      { pattern: "(?<level>\\w+)\\s(?<zone>\\w+)\\s<(?<codeId>[\\w.]+@[\\w.]+)>", flags: "g", text: "Level0 Lobby <lobby@backrooms.net>, Level1 Habitable <habitable@sector.org>", desc: "Extracting contact routes." },
      { pattern: "<(?<tag>\\w+)>.*?</\\k<tag>>", flags: "g", text: "<h1>Title</h1> and <b>bold</b>.", desc: "Match XML/HTML tags using named backreference \\k<tag>." }
    ],
    exercises: [
      {
        task: "Write a pattern with <strong style='color:var(--accent)'>named groups</strong> to parse a sector IP address: extract four octets as separate groups (a, b, c, d).",
        text: "Mainframe: 192.168.1.100, Gateway: 192.168.1.1, Node: 8.8.8.8",
        solution: "(?<a>\\d{1,3})\\.(?<b>\\d{1,3})\\.(?<c>\\d{1,3})\\.(?<d>\\d{1,3})",
        flags: "g",
        hint: "Each octet should be (?<name>\\d{1,3}), separated by literal dots \\."
      },
      {
        task: "Create named groups <strong style='color:var(--accent)'>key</strong> and <strong style='color:var(--accent)'>value</strong> to parse configuration logs in format KEY=VALUE.",
        text: "timeout=30\nhost=localhost\nport=8080\nssl=true",
        solution: "(?<key>\\w+)=(?<value>\\w+)",
        flags: "g",
        hint: "Use syntax (?<name>pattern) for both the key and the value groups."
      },
      {
        task: "Define groups <strong style='color:var(--accent)'>last</strong> and <strong style='color:var(--accent)'>first</strong> to extract personnel names in 'LastName FirstName' format.",
        text: "Kowalski Jan, Nowak Anna, Smith John",
        solution: "(?<last>\\w+)\\s(?<first>\\w+)",
        flags: "g",
        hint: "Match last name first, then space \\s, then first name."
      },
      {
        task: "Match a repeated word sitting next to itself using a named group <strong style='color:var(--accent)'>word</strong> and a named backreference.",
        text: "the the hallway, one two two three, deep deep sleep",
        solution: "(?<word>\\b\\w+)\\s+\\k<word>\\b",
        flags: "g",
        hint: "Define (?<word>\\b\\w+) and refer back to it with \\k<word> after spaces \\s+."
      }
    ]
  },
  {
    id: 8, title: "The Glitching Camera", difficulty: "advanced",
    icon: "flag",
    intro: "Looking through a security camera lens, the world appears warped. Flags modify the global behavior of the regex engine. You know g and i; now meet m, s, u, and d.",
    concepts: [
      { key: "g", desc: "global — find all matches" },
      { key: "i", desc: "ignoreCase — case-insensitive matching" },
      { key: "m", desc: "multiline — ^ and $ match per line" },
      { key: "s", desc: "dotAll — dot matches newline \\n" },
      { key: "u", desc: "unicode — full Unicode support" },
      { key: "d", desc: "hasIndices — expose match indices in .indices" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
The <code style="color:var(--accent)">s</code> flag (dotAll) solves a classic issue: by default, <code style="color:var(--accent)">.</code> does not match newlines.
When parsing multi-line text files or logs, this flag is vital.
</p>
<p style="color:var(--text2);line-height:1.8;">
The <code style="color:var(--accent)">u</code> flag enables full Unicode property escapes like <code style="color:var(--accent)">\\p{L}</code> (letters) and <code style="color:var(--accent)">\\p{Emoji}</code>, enabling proper text handling across international characters and symbols.
</p>`,
    examples: [
      { pattern: "<div>.+?</div>", flags: "gs", text: "<div>Line 1\nLine 2\nLine 3</div> <div>Another sector</div>", desc: "Flag s allows . to cross newline boundaries." },
      { pattern: "\\p{L}+", flags: "gu", text: "Héllo Wörld 123! Cześć Świecie 🌍 Привет мир", desc: "\\p{L} with flag u matches characters from any language." },
      { pattern: "test", flags: "gd", text: "This is a test.", desc: "Flag d adds index information to the match object." }
    ],
    exercises: [
      {
        task: "Use flag <strong style='color:var(--accent)'>m</strong> to match the last word on each line (right before the end of line $).",
        text: "Welcome to the first floor\nEmpty rooms of yellow\nSilence is golden here\nLook for the door",
        solution: "\\w+$",
        flags: "gm",
        hint: "\\w+ matches a word, $ with flag m matches the end of each line."
      },
      {
        task: "Match contents inside <strong style='color:var(--accent)'>&lt;code&gt;...&lt;/code&gt;</strong> tags (including tags), even if they span multiple lines. Use flag s.",
        text: "<code>const room = 104;\nconsole.log(room);</code> and <code>let light = true;</code>",
        solution: "<code>.*?<\\/code>",
        flags: "gs",
        hint: "Use dotAll flag s so the dot matches newlines. Use a lazy quantifier *?."
      },
      {
        task: "Match all words containing Polish letters using Unicode property escapes <strong style='color:var(--accent)'>\\p{L}</strong>. Use flag u.",
        text: "Zażółć gęślą jaźń. Pchnąć w tę łódź.",
        solution: "\\p{L}+",
        flags: "gu",
        hint: "Enable u flag and match letters with \\p{L}+."
      },
      {
        task: "Match all <strong style='color:var(--accent)'>Emoji</strong> presentation symbols using Unicode property escapes.",
        text: "Welcome! 🌍 Hello ☀️ Sector 🚀",
        solution: "\\p{Emoji_Presentation}+",
        flags: "gu",
        hint: "Use Unicode property escape \\p{Emoji_Presentation}+ with flag gu."
      }
    ]
  },
  // --- LEVEL 4: EXPERT ---
  {
    id: 9, title: "The Temporal Loops", difficulty: "expert",
    icon: "cpu",
    intro: "An infinite feedback loop can freeze time. In RegEx, bad patterns can lead to catastrophic backtracking, locking your thread. Optimization is the key to escaping the loops.",
    concepts: [
      { key: "++", desc: "Possessive quantifier (not native to JS)" },
      { key: "(?>...)", desc: "Atomic group (not native to JS)" },
      { key: "(?=(?:aa)*$)", desc: "Lookahead parity checking" },
      { key: "\\G", desc: "End of previous match (PCRE)" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
<strong style="color:var(--red)">Catastrophic backtracking</strong> occurs when a regex tries exponentially many match combinations on a failing string.
The pattern <code style="color:var(--amber)">(a+)+b</code> against "aaaaaaaaaaaac" leads to a massive search tree.
</p>
<p style="color:var(--text2);line-height:1.8;">
JS doesn't natively have atomic groups or possessive quantifiers, but we can simulate them using lookaheads.
Avoid nested quantifiers and use explicit character classes instead of <code style="color:var(--accent)">.*</code>.
</p>`,
    examples: [
      { pattern: "(?=(\\w+))\\1(?=\\1)", flags: "g", text: "aa bb aaa bbbb aaaaa", desc: "Lookahead used as an atomic predicate." },
      { pattern: "^(?:(?!ERROR).)*$", flags: "gm", text: "INFO: OK\nERROR: loop\nWARN: slow\nDEBUG: done", desc: "Tempered greedy token — lines containing NO 'ERROR'." },
      { pattern: "^[^/]+$", flags: "g", text: "usr/local/bin vs usrlocalbin", desc: "Strict character class avoiding backtracks." }
    ],
    exercises: [
      {
        task: "Use a <strong style='color:var(--accent)'>tempered greedy token</strong> to match C-style comment blocks /* ... */ which do NOT contain */ inside them.",
        text: "/* valid comment */ code() /* also OK */ /* bad */ code /* /* nested */ */",
        solution: "\\/\\*(?:(?!\\*\\/).|\\n)*?\\*\\/",
        flags: "gs",
        hint: "Match /* followed by characters that are not */ (using (?:(?!\\*\\/).)), ending with */."
      },
      {
        task: "Use a tempered greedy token to match double-quoted strings <strong style='color:var(--accent)'>\"...\"</strong> that do not contain quotes or newlines inside.",
        text: 'Text: "first" and "second\nline" and "third"',
        solution: "\"(?:(?![\"\\n]).)*?\"",
        flags: "g",
        hint: "Use \" followed by a tempered greedy token blocking quotes and newlines, ending with \"."
      },
      {
        task: "Match entire lines of logs that do NOT contain the word <strong style='color:var(--accent)'>SECRET</strong>.",
        text: "Line is safe\nThis line has SECRET in it\nAnother safe line\nSECRET at the start",
        solution: "^(?(?!SECRET).)*$",
        // Wait! Let's check original solution. In the main lessons.js we had:
        solution: "^(?:(?!SECRET).)*$",
        flags: "gm",
        hint: "Use tempered greedy token (?!SECRET). across the whole line from ^ to $ with gm flags."
      },
      {
        task: "Match entire lines of non-whitespace characters without nesting quantifiers to prevent ReDoS.",
        text: "word\ntext_with_chars\nline with spaces\nend",
        solution: "^[^\\s]+$",
        flags: "gm",
        hint: "Instead of (\\w+)+, use ^[^\\s]+$ to match a line composed of non-whitespace."
      }
    ]
  },
  {
    id: 10, title: "The Reality Shifts", difficulty: "expert",
    icon: "replace",
    intro: "Don't just observe the spaces — alter them. By combining capturing groups with string replacements, you can reshape reality, changing names, formats, and structural layouts.",
    concepts: [
      { key: "str.replace(re, '$1')", desc: "Insert group 1 in replacement string" },
      { key: "str.replace(re, fn)", desc: "Use function for dynamic replacement" },
      { key: "$&", desc: "Matches the entire matched pattern" },
      { key: "$<name>", desc: "Reference named group in replacement" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
<code style="color:var(--accent)">replace()</code> with a replacer function yields absolute control over matches:
</p>
<div class="code-block" style="padding:14px 16px;margin:12px 0;">
<pre style="color:var(--text);font-size:13px;">str.replace(/(\\w+)/g, (match, p1) => {
  return p1.toUpperCase(); // uppercase every word
});</pre>
</div>
<p style="color:var(--text2);line-height:1.8;">
This permits advanced data transformations: unit conversions, localized date formatting, and structure swaps.
</p>`,
    examples: [
      { pattern: "(\\d{4})-(\\d{2})-(\\d{2})", flags: "g", text: "Dates: 2026-06-09, 1990-07-04.", desc: "Reformat YYYY-MM-DD to DD.MM.YYYY." },
      { pattern: "(\\b\\w)", flags: "g", text: "welcome to the backrooms corridor.", desc: "Capitalize the first letter of each word." },
      { pattern: "(?<first>\\w+)\\s(?<last>\\w+)", flags: "g", text: "John Doe, Alan Turing", desc: "Swap names using named groups $<last>, $<first>." }
    ],
    exercises: [
      {
        task: "Write a pattern that captures <strong style='color:var(--accent)'>phone numbers</strong> in different formats to normalize them to +48 XXX XXX XXX.",
        text: "Tel: 123456789, 123-456-789, +48123456789, 48 123 456 789",
        solution: "(?:\\+?48[\\s-]?)?(\\d{3})[\\s-]?(\\d{3})[\\s-]?(\\d{3})",
        flags: "g",
        hint: "Your pattern must capture 3 sets of 3 digits while ignoring optional +48 prefixes and separators."
      },
      {
        task: "Write a pattern capturing first and last name as two groups, to swap them to 'LastName, FirstName'.",
        text: "John Doe, Jane Smith, Alan Turing",
        solution: "(\\w+)\\s(\\w+)",
        flags: "g",
        hint: "Capture the first word as group 1 and the second word as group 2."
      },
      {
        task: "Capture the contents of Markdown bold syntax <strong style='color:var(--accent)'>**text**</strong> into a capturing group.",
        text: "This is **bold** text and **another bold** word.",
        solution: "\\*\\*(.*?)\\*\\*",
        flags: "g",
        hint: "Escape the asterisks \\*\\* and capture content inside with a lazy quantifier (.*?)."
      },
      {
        task: "Capture the domain name from URLs like <strong style='color:var(--accent)'>http://domain.com</strong> (without protocol) for transformation.",
        text: "http://test.com, https://site.org, http://sub.domain.net",
        solution: "https?:\\/\\/([\\w.-]+)",
        flags: "g",
        hint: "Escape the slashes and place the domain character class [\\w.-]+ in a capturing group."
      }
    ]
  },
  {
    id: 11, title: "The Decryption Keys", difficulty: "expert",
    icon: "wrench",
    intro: "Before escaping, you must validate your credentials. This lesson covers industry standard patterns used daily: validating emails, IP addresses, and secure keys.",
    concepts: [
      { key: "RFC 5321", desc: "The official email address format standard" },
      { key: "OWASP", desc: "Best practices for secure regex patterns" },
      { key: "ReDoS", desc: "Regular Expression Denial of Service prevention" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Validating emails with regex is deceptively complex. The full RFC 5321 pattern is hundreds of characters long.
In practice, validate basics to prevent typos, and handle validation via verification emails.
</p>
<p style="color:var(--text2);line-height:1.8;">
<strong style="color:var(--red)">ReDoS Warning</strong>: Never put unsanitized user-supplied regex directly into server execution.
A pattern like <code style="color:var(--amber)">(a|aa)+$</code> can hang a server thread.
</p>`,
    examples: [
      { pattern: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$", flags: "i", text: "valid@example.com\ninvalid@\n@missing.com\nno-at-sign.com\ntest@domain.co.uk", desc: "Standard email address validation." },
      { pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$", flags: "", text: "weak\nStrong1!\nValid@2026\nnoSpecial1\n@NoNumber!", desc: "Strong password enforcement." },
      { pattern: "^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)$", flags: "g", text: "192.168.1.1\n256.100.0.1\n10.0.0.254\n999.999.999.999", desc: "IPv4 address validation within 0-255 bounds." }
    ],
    exercises: [
      {
        task: "Write a pattern to validate a <strong style='color:var(--accent)'>Polish PESEL ID number</strong> (11 digits, first 6 representing YYMMDD).",
        text: "44051401458\n00271401458\n123\nABCDEFGHIJK\n85103112345\n990101XXXXX",
        solution: "^\\d{2}(?:0[1-9]|[1-2]\\d|3[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{5}$",
        flags: "gm",
        hint: "PESEL: YY(MM 01-32)(DD 01-31)NNNNN. Note that people born after 2000 have month numbers shifted by +20."
      },
      {
        task: "Write a pattern to validate a <strong style='color:var(--accent)'>HEX color code</strong> (e.g., #fff, #AABBCC), supporting 3 or 6 hex digits.",
        text: "#FFF\n#00e5ff\n#12345\n#ABCDEFG\n#FF00FF\ngreen",
        solution: "^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$",
        flags: "gm",
        hint: "Anchor the pattern with ^ and $, and use alternation for 3 or 6 characters."
      },
      {
        task: "Design a password validation pattern: <strong style='color:var(--accent)'>minimum 8 characters</strong>, at least one uppercase letter, one lowercase letter, and one digit.",
        text: "Password123\nweakpass\n12345678\nUPPERCASE1\nValidPass9",
        solution: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
        flags: "gm",
        hint: "Use lookaheads (?=.*[a-z]), (?=.*[A-Z]), and (?=.*\\d), then assert length with .{8,}."
      },
      {
        task: "Write a validation pattern for IPv4 addresses (four octets 0-255 separated by dots).",
        text: "192.168.1.1\n255.255.255.255\n256.0.0.1\n99.99.99.99",
        solution: "^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)$",
        flags: "gm",
        hint: "Use explicit bounds for 0-255: 25[0-5]|2[0-4]\\d|[01]?\\d?\\d for each octet."
      }
    ]
  },
  // --- LEVEL 5: GRANDMASTER ---
  {
    id: 12, title: "The Glitched Feed", difficulty: "master",
    icon: "zap",
    intro: "The surveillance feed jumps, locked in place. The sticky flag (y) forces matching to start exactly at the position of lastIndex, letting you build efficient code tokenizers.",
    concepts: [
      { key: "/pattern/y", desc: "Sticky flag — matches only at the lastIndex index" },
      { key: "regex.lastIndex", desc: "JS property that governs where the regex engine begins matching" },
      { key: "Lexer / Tokenizer", desc: "Deconstruct code strings into token arrays using regex" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
The sticky flag <code style="color:var(--accent)">y</code> behaves like the global flag <code style="color:var(--accent)">g</code>, but with a crucial difference: it <strong>must</strong> find a match starting exactly at <code style="color:var(--accent)">lastIndex</code>.
If it fails to match at that index, it immediately returns <code style="color:var(--text)">null</code>.
</p>
<p style="color:var(--text2);line-height:1.8;">
By manually updating <code style="color:var(--accent)">lastIndex</code>, you can build fast lexers that extract tokens from scripts without slicing or copying strings.
</p>`,
    examples: [
      { pattern: "foo", flags: "y", text: "abc foo bar", desc: "Without setting lastIndex, searching starts at 0 and fails (returns null)." },
      { pattern: "\\d+", flags: "y", text: "123 456 789", desc: "Matches 123. If lastIndex is moved to 4, it matches 456." },
      { pattern: "[a-zA-Z_]\\w*", flags: "y", text: "x_var = 10", desc: "Captures the variable identifier right at the start." }
    ],
    exercises: [
      {
        task: "Match a sequence of exactly 3 digits <strong style='color:var(--accent)'>\\d{3}</strong> at the current position using the sticky flag.",
        text: "12345",
        solution: "\\d{3}",
        flags: "y",
        hint: "Use the sticky flag y and the pattern \\d{3}."
      },
      {
        task: "Match word identifiers (starting with a letter or underscore) using the sticky flag.",
        text: "myVar_1 = 100",
        solution: "[a-zA-Z_]\\w*",
        flags: "y",
        hint: "Enter [a-zA-Z_]\\w* with flag y."
      },
      {
        task: "Extract a tag handle in format <strong style='color:var(--accent)'>@handle</strong> starting exactly at index 0 using the sticky flag.",
        text: "@admin @user",
        solution: "@[a-zA-Z0-9]+",
        flags: "y",
        hint: "Pattern: @ followed by alphanumeric characters, using the sticky flag."
      },
      {
        task: "Match the hex prefix <strong style='color:var(--accent)'>0x</strong> followed by hex digits using the sticky flag.",
        text: "0x7F4B",
        solution: "0x[0-9a-fA-F]+",
        flags: "y",
        hint: "Write 0x and hex character class with + using flag y."
      }
    ]
  },
  {
    id: 13, title: "The Dream State", difficulty: "master",
    icon: "git-merge",
    intro: "Reality is conditional inside a dream. While JS doesn't natively support IF-THEN conditions in RegEx, you can simulate conditional pathways by combining lookarounds and alternations.",
    concepts: [
      { key: "(?=A)B|(?!A)C", desc: "IF A is present, match B, ELSE match C" },
      { key: "(?=(?=A)B)", desc: "Nested lookahead assertion" },
      { key: "Cross-validation", desc: "Asserting matches based on nearby character presence" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Standard PCRE engines support <code style="color:var(--accent)">(?(condition)yes|no)</code>. In Javascript, we emulate this using alternation and lookarounds:
<code style="color:var(--accent)">(?=condition)then_pattern|(?!condition)else_pattern</code>.
</p>
<p style="color:var(--text2);line-height:1.8;">
We can also nest lookaheads to enforce compound logic. E.g., <em>match a word only if it contains at least two vowels and does not end in a consonant</em>.
</p>`,
    examples: [
      { pattern: "^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$", flags: "g", text: "secret123\nAdmin123\nSuperSecr3t", desc: "Stacking positive lookaheads to validate password conditions." },
      { pattern: "(?=.*a)(?=.*b)\\w+", flags: "g", text: "apple, banana, table, cab, boat, backpack", desc: "Match words that contain both 'a' and 'b'." },
      { pattern: "^(?=Mr\\.)Mr\\.\\s(?:Jan|Piotr)$|^(?!Mr\\.)(?:Anna|Piotr)$", flags: "gm", text: "Mr. Jan\nMr. Anna\nPiotr\nAnna", desc: "IF starts with Mr. THEN match Jan/Piotr ELSE match Anna/Piotr" }
    ],
    exercises: [
      {
        task: "Match words that contain at least two digits <strong style='color:var(--accent)'>\\d</strong> inside. Use a lookahead.",
        text: "item1, it23em, i1t2e3m, apple, 12",
        solution: "\\b(?=(?:.*\\d){2,})\\w+\\b",
        flags: "g",
        hint: "Use lookahead (?=(?:.*\\d){2,}) after the word boundary \\b."
      },
      {
        task: "Match passwords of minimum 6 characters that <strong style='color:var(--accent)'>do NOT contain</strong> the word 'password' (case-insensitive).",
        text: "secret123\npassword99\nAdmin123\nPassWord!1",
        solution: "^(?!.*password).{6,}$",
        flags: "gim",
        hint: "Use negative lookahead (?!.*password) at the line start, then match .{6,}$ with m flag."
      },
      {
        task: "Match text inside parenthesis <strong style='color:var(--accent)'>(...)</strong> only when there are no square brackets inside.",
        text: "(simple text), (text [bad] inside), (another text), ([error] at start)",
        solution: "\\([^[\\]]*?\\)",
        flags: "g",
        hint: "Pattern: \\( followed by any characters except square brackets [^[\\\]]*? ending with \\)."
      },
      {
        task: "Match an email address only if its domain is <strong style='color:var(--accent)'>wowk.ua</strong> or <strong style='color:var(--accent)'>gmail.com</strong>.",
        text: "test@wowk.ua\nadmin@gmail.com\nuser@yahoo.com\nhello@wowk.ua",
        solution: "^[\\w.-]+@(?:wowk\\.ua|gmail\\.com)$",
        flags: "gm",
        hint: "Use a non-capturing group with alternation (?:wowk\\.ua|gmail\\.com) at the end."
      }
    ]
  },
  {
    id: 14, title: "Escaping the Backrooms", difficulty: "master",
    icon: "shield",
    intro: "A catastrophic loop in your regex can bring down a server, trapping the thread forever. In this final level, learn how to audit your patterns to prevent ReDoS (Regular Expression Denial of Service) and escape the backtracking maze.",
    concepts: [
      { key: "Exponential Backtracking", desc: "Explosive growth in engine steps on non-matching strings" },
      { key: "Overlapping Classes", desc: "Nested loops like (a+)+ or (a|a)+ that cause ReDoS" },
      { key: "Quantifier Auditing", desc: "Refactoring overlapping scopes into deterministic patterns" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
ReDoS attacks occur when a pattern has <strong style="color:var(--red)">multiple overlapping match paths</strong>.
When evaluated against a long, slightly mismatched string, the engine tries millions of paths before failing, locking up the CPU.
</p>
<p style="color:var(--text2);line-height:1.8;">
To write safe regex:<br>
1. Avoid nested quantifiers like <code style="color:var(--red)">(a+)*</code> or <code style="color:var(--red)">(\\w+)*</code>.<br>
2. Ensure alternations are mutually exclusive (e.g., instead of <code style="color:var(--red)">(\\d+|\\w+)</code>, use <code style="color:var(--green)">[a-zA-Z_]\\w*|\\d+</code>).<br>
3. Restrict quantifier scopes using strict character classes rather than open dots <code style="color:var(--accent)">.*</code>.
</p>`,
    examples: [
      { pattern: "^a+$", flags: "g", text: "aaaaaaaaaab\naaaaaaaaaa", desc: "Safe pattern: linear execution complexity." },
      { pattern: "^[^/]+$", flags: "g", text: "usr/local/bin\nusrlocalbin", desc: "Restricted class prevents dangerous backtracking." },
      { pattern: "^\\w+(?:\\s+\\w+)*$", flags: "g", text: "one two three", desc: "Safe word sequence separation (no overlaps)." }
    ],
    exercises: [
      {
        task: "Optimize the dangerous pattern <strong style='color:var(--accent)'>(a+)+</strong> into a safe version while preserving its matching logic (matching a sequence of 'a's from start to end of line).",
        text: "aaaaa\naaaaaa\naba",
        solution: "^a+$",
        flags: "gm",
        hint: "Replace the nested quantifiers with a single quantifier: ^a+$."
      },
      {
        task: "Optimize the slow pattern <strong style='color:var(--accent)'>.*(x|y).*</strong> into a safe and efficient version to match lines containing 'x' or 'y'.",
        text: "hello x world\nno match here\ncontains y",
        solution: "^.*?[xy].*$",
        flags: "gm",
        hint: "Use lazy matching .*? at start, character class [xy] instead of alternation, ending with .*$."
      },
      {
        task: "The pattern <strong style='color:var(--accent)'>^(\\w+\\s*)+$</strong> is unsafe due to whitespace backtracking. Refactor it to match space-separated word sequences safely.",
        text: "one two three\ntest\ninvalid!",
        solution: "^\\w+(?:\\s+\\w+)*$",
        flags: "gm",
        hint: "A safe layout is: word, followed by an optional group containing spaces and another word."
      },
      {
        task: "Rewrite the unsafe path validation pattern <strong style='color:var(--accent)'>^([^.]+\\.?)+$</strong> (which matches dot-separated names) to be ReDoS-proof.",
        text: "config.json\nindex.html\nmain.js\nplain_text",
        solution: "^[^.]+(?:\\.[^.]+)*$",
        flags: "gm",
        hint: "Follow the same pattern as the word task: segment without dots, then an optional dot followed by more segments without dots."
      }
    ]
  }
];
