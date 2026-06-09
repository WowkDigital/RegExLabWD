export const celeste = [
  // --- LEVEL 1: BEGINNER ---
  {
    id: 0, title: "Prologue: Leaving Home", difficulty: "beginner",
    icon: "book-open",
    intro: "Madeline stands at the base of Mt. Celeste, looking up at the snowy peak. To begin her climb, she must find solid footholds on the path. Literal patterns help her target exact words hidden in the howling mountain winds.",
    concepts: [
      { key: "/pattern/", desc: "Literal match — targets exact characters on the trail" },
      { key: "g", desc: "Global flag — scan the entire mountain wall, not just the nearest platform" },
      { key: "i", desc: "Case-insensitive flag — ignore casing (match uppercase and lowercase ice drifts)" },
    ],
    theory: `
<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
A regular expression is a search pattern written between slashes: <code style="color:var(--accent)">/pattern/flags</code>.
Literal patterns search for exact sequences of characters, just like Madeline searching for safe footholds in the snow.
</p>
<p style="color:var(--text2);line-height:1.8;">
For example, the pattern <code style="color:var(--accent)">/strawberry/gi</code> searches globally and case-insensitively for the word "strawberry".
</p>`,
    examples: [
      { pattern: "strawberry", flags: "gi", text: "A strawberry hangs nearby. Red Strawberry looks delicious. Grab the STRAWBERRY!", desc: "Global and case-insensitive flags find all occurrences of 'strawberry' regardless of case." },
      { pattern: "dash", flags: "g", text: "Use your dash. Air dash restored. DASH to the ledge.", desc: "Without the i flag, capital 'DASH' is not matched." },
      { pattern: "theo", flags: "i", text: "Theo takes a selfie. Talk to Theo.", desc: "Without the g flag, only the first occurrence is matched." }
    ],
    exercises: [
      {
        task: "Find all occurrences of the word <strong style='color:var(--accent)'>strawberry</strong> (ignore case, find all matches).",
        text: "Strawberry in the snow. Madeline grabs a strawberry. GOLDEN STRAWBERRY!",
        solution: "strawberry",
        flags: "gi",
        hint: "Enter 'strawberry' and make sure the g and i flags are selected."
      },
      {
        task: "Find all occurrences of the word <strong style='color:var(--accent)'>dash</strong> (ignore case, find all).",
        text: "Use your dash. Air dash restored. DASH to the ledge.",
        solution: "dash",
        flags: "gi",
        hint: "Match 'dash' using the global and case-insensitive flags."
      },
      {
        task: "Find the word <strong style='color:var(--accent)'>climb</strong> (exact lowercase match, all occurrences).",
        text: "We need to climb. Can we climb? CLIMB meter is low.",
        solution: "climb",
        flags: "g",
        hint: "Do not use the case-insensitive flag. Search for 'climb' with the g flag."
      },
      {
        task: "Find the word <strong style='color:var(--accent)'>theo</strong> (ignore case, find all matches).",
        text: "Theo takes a selfie. Talk to Theo. THEO is cool.",
        solution: "theo",
        flags: "gi",
        hint: "Search for 'theo' using both the g and i flags."
      }
    ]
  },
  {
    id: 1, title: "Chapter 1: Forsaken City", difficulty: "beginner",
    icon: "brackets",
    intro: "Madeline explores the ruins of the Forsaken City, where old signs and locked mechanisms block the way. Character classes act as lockpicks, letting her match any single character from a specific set to unlock old pathways.",
    concepts: [
      { key: "[abc]", desc: "Matches any single character: a, b, or c" },
      { key: "[a-z]", desc: "Range: matches any lowercase letter from a to z" },
      { key: "[^abc]", desc: "Negation: matches any character EXCEPT a, b, or c" },
      { key: "[0-9]", desc: "Matches any digit from 0 to 9" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Square brackets <code style="color:var(--accent)">[ ]</code> define a character class. The regex engine will match exactly <strong style="color:var(--text)">one character</strong> from the enclosed set.
</p>
<p style="color:var(--text2);line-height:1.8;">
Inside brackets, you can use a hyphen <code style="color:var(--accent)">-</code> to denote a range of characters. A caret <code style="color:var(--accent)">^</code> at the very beginning of the brackets negates the class, meaning it matches any character not listed.
</p>`,
    examples: [
      { pattern: "[aeiou]", flags: "g", text: "This city is abandoned.", desc: "Matches all lowercase vowels in the text." },
      { pattern: "[^a-zA-Z ]", flags: "g", text: "Checkpoint: #12, Height: 400m", desc: "Matches any character that is not a letter or space." },
      { pattern: "[0-9a-fA-F]", flags: "g", text: "Gate code: 0x3F", desc: "Matches valid hexadecimal characters." }
    ],
    exercises: [
      {
        task: "Match all <strong style='color:var(--accent)'>digits</strong> in the checkpoint coordinates.",
        text: "Altitude: +48 (123) 456-789 meters.",
        solution: "[0-9]",
        altSolutions: ["\\d"],
        flags: "g",
        hint: "Use the character class [0-9] or the shorthand digit character code \\d."
      },
      {
        task: "Match only the letters <strong style='color:var(--accent)'>x, y, or z</strong> (case-sensitive).",
        text: "axis, yellow, zebra, x-ray, matrix",
        solution: "[xyz]",
        flags: "g",
        hint: "Place the letters inside square brackets: [xyz]."
      },
      {
        task: "Match any character <strong style='color:var(--accent)'>except lowercase vowels</strong> (a, e, i, o, u).",
        text: "regex lab",
        solution: "[^aeiou]",
        flags: "g",
        hint: "Use negation [^...] with the lowercase vowels inside."
      },
      {
        task: "Match the characters <strong style='color:var(--accent)'>a, b, or c</strong> (case-insensitive, all occurrences).",
        text: "Active Backup, Code version A, catalog B, item C.",
        solution: "[abc]",
        flags: "gi",
        hint: "Use the character class [abc] and enable the case-insensitive flag i."
      }
    ]
  },
  {
    id: 2, title: "Chapter 2: Old Site", difficulty: "beginner",
    icon: "type",
    intro: "Exploring the ruins of the Old Site at midnight, Madeline encounters dream blocks—strange structures she can dash right through. Shorthand character classes are like these dream blocks, letting her pass through common character groups instantly.",
    concepts: [
      { key: "\\d", desc: "Matches any digit [0-9]" },
      { key: "\\D", desc: "Matches any non-digit [^0-9]" },
      { key: "\\w", desc: "Matches any word character [a-zA-Z0-9_]" },
      { key: "\\W", desc: "Matches any non-word character" },
      { key: "\\s", desc: "Matches any whitespace character (spaces, tabs, newlines)" },
      { key: "\\S", desc: "Matches any non-whitespace character" },
      { key: ".", desc: "Wildcard: matches any single character except newline" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Shorthand classes use a backslash followed by a letter. Notice the capitalization pattern: <strong style="color:var(--text)">lowercase is positive</strong>, and <strong style="color:var(--text)">uppercase is negative</strong>.
</p>
<p style="color:var(--text2);line-height:1.8;">
The dot <code style="color:var(--accent)">.</code> is a wildcard that matches any single character except a newline. If you want to match a literal dot, you must escape it with a backslash: <code style="color:var(--accent)">\\.</code>
</p>`,
    examples: [
      { pattern: "\\d+", flags: "g", text: "Chapter 2: 3 strawberries, 1 crystal heart", desc: "Finds sequences of digits." },
      { pattern: "\\w+", flags: "g", text: "dream_block-1 active_zone", desc: "Finds word character sequences (ignores hyphens)." },
      { pattern: "\\S+", flags: "g", text: "Climb speed: 1.2x", desc: "Finds non-whitespace sequences." }
    ],
    exercises: [
      {
        task: "Extract the <strong style='color:var(--accent)'>postal code</strong> in the format XX-XXX using \\d and a literal hyphen.",
        text: "Postal code: 30-059, Krakow",
        solution: "\\d{2}-\\d{3}",
        altSolutions: ["[0-9]{2}-[0-9]{3}"],
        flags: "g",
        hint: "Combine two digits, a hyphen, and three digits: \\d{2}-\\d{3}."
      },
      {
        task: "Find all <strong style='color:var(--accent)'>whitespace characters</strong> (spaces, tabs, newlines).",
        text: "Hello\tworld\nthis\tis\tcode.",
        solution: "\\s",
        flags: "g",
        hint: "Use the shorthand class for whitespace: \\s."
      },
      {
        task: "Match any sequence of three characters starting with 'a', followed by <strong style='color:var(--accent)'>any character</strong>, and ending with 'b'.",
        text: "axb, a-b, a.b, ab, a b, abb, acb",
        solution: "a.b",
        flags: "g",
        hint: "Use a dot to represent any character: a.b"
      },
      {
        task: "Match any character that is <strong style='color:var(--accent)'>NOT a word character</strong> (not a letter, number, or underscore).",
        text: "user_name: admin@host!",
        solution: "\\W",
        flags: "g",
        hint: "Use the uppercase non-word shorthand class: \\W."
      }
    ]
  },
  // --- LEVEL 2: INTERMEDIATE ---
  {
    id: 3, title: "Chapter 3: Celestial Resort", difficulty: "intermediate",
    icon: "repeat",
    intro: "The Celestial Resort is a dusty, sprawling hotel managed by the ghostly Mr. Oshiro. Floating dust bunnies patrol the corridors. Quantifiers allow Madeline to count and match these repeating threats of varying lengths.",
    concepts: [
      { key: "*", desc: "Matches 0 or more times (greedy)" },
      { key: "+", desc: "Matches 1 or more times (greedy)" },
      { key: "?", desc: "Matches 0 or 1 time (optional)" },
      { key: "{n}", desc: "Matches exactly n times" },
      { key: "{n,m}", desc: "Matches between n and m times" },
      { key: "{n,}", desc: "Matches at least n times" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Quantifiers are <strong style="color:var(--accent)">greedy</strong> by default, meaning they will match as many characters as possible.
</p>
<p style="color:var(--text2);line-height:1.8;">
Adding a question mark after a quantifier (e.g., <code style="color:var(--accent)">+?</code> or <code style="color:var(--accent)">*?</code>) makes it <strong style="color:var(--green)">lazy</strong> (non-greedy), matching the minimum number of characters required to satisfy the pattern.
</p>`,
    examples: [
      { pattern: "\\d{3}-\\d{3}-\\d{3}", flags: "g", text: "Room: 501-202-303, Oshiro: 12-34-56", desc: "Matches exactly 3-3-3 digit groupings." },
      { pattern: "colou?r", flags: "g", text: "The resort walls are color / colour", desc: "Matches both spellings by making the 'u' optional." },
      { pattern: "\\b\\d{4,}\\b", flags: "g", text: "ID: 99, Year: 2026, Dust: 123456", desc: "Matches numbers that are at least 4 digits long." }
    ],
    exercises: [
      {
        task: "Match all <strong style='color:var(--accent)'>HTML tags</strong> (e.g., &lt;h1&gt;, &lt;p&gt;, &lt;/p&gt;) using a lazy quantifier.",
        text: "<h1>Header</h1> <p class=\"txt\">Hello <b>world</b>!</p>",
        solution: "<.+?>",
        flags: "g",
        hint: "Start with <, match any characters lazily with .+?, and end with >."
      },
      {
        task: "Match the words <strong style='color:var(--accent)'>link</strong> and <strong style='color:var(--accent)'>links</strong> (making the 's' optional).",
        text: "Click this link. Check the links below.",
        solution: "links?",
        flags: "g",
        hint: "Add ? after 's' to make it optional: links?"
      },
      {
        task: "Find all words that consist of <strong style='color:var(--accent)'>3 to 5 letters</strong>.",
        text: "The quick brown fox jumps over the lazy dog.",
        solution: "\\b\\w{3,5}\\b",
        flags: "g",
        hint: "Use word boundaries \\b and the quantifier {3,5} on the word character class."
      },
      {
        task: "Find digit sequences that are <strong style='color:var(--accent)'>exactly 4 digits long</strong>.",
        text: "Years: 1995, 2000, 2026 and counts 12, 345, 99999.",
        solution: "\\b\\d{4}\\b",
        flags: "g",
        hint: "Use word boundaries \\b and the exact quantifier {4} on \\d."
      }
    ]
  },
  {
    id: 4, title: "Chapter 4: Golden Ridge", difficulty: "intermediate",
    icon: "anchor",
    intro: "High up on the Golden Ridge, strong winds blow Madeline left and right. Anchors do not match characters; instead, they lock the pattern's position to the start or end of the line, like bracing against a gust of wind.",
    concepts: [
      { key: "^", desc: "Matches the start of a string or line (with multiline flag m)" },
      { key: "$", desc: "Matches the end of a string or line (with multiline flag m)" },
      { key: "\\b", desc: "Matches a word boundary" },
      { key: "\\B", desc: "Matches a non-word boundary" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
The word boundary anchor <code style="color:var(--accent)">\\b</code> marks the transition between a word character (<code style="color:var(--accent)">\\w</code>) and a non-word character or string boundary.
</p>
<p style="color:var(--text2);line-height:1.8;">
When combined with the multiline flag <code style="color:var(--accent)">m</code>, the anchors <code style="color:var(--accent)">^</code> and <code style="color:var(--accent)">$</code> match the start and end of individual lines, rather than the entire input string.
</p>`,
    examples: [
      { pattern: "\\bwind\\b", flags: "g", text: "The wind is blowing. Tailwind. Windward.", desc: "Matches 'wind' as a standalone word only." },
      { pattern: "^\\d+", flags: "gm", text: "1. Wind left\n2. Wind right\n  3. Indented", desc: "Matches digits at the beginning of each line." },
      { pattern: "\\b\\w+ing\\b", flags: "g", text: "Climbing and dashing are exciting.", desc: "Matches words ending in 'ing'." }
    ],
    exercises: [
      {
        task: "Match lines that <strong style='color:var(--accent)'>start with 'ERROR'</strong>. Use anchors ^ and $ with the multiline flag.",
        text: "INFO: System OK\nERROR: Connection failed\nINFO: Retry 1\nERROR: Timeout occurred\nDEBUG: Port open",
        solution: "^ERROR.*$",
        flags: "gm",
        hint: "^ERROR matches the start of the line. .* matches the rest of the line, and $ asserts the end of line."
      },
      {
        task: "Match words that <strong style='color:var(--accent)'>end in 'ly'</strong>. Use the word boundary anchor \\b.",
        text: "She quickly ran to the highly advanced laboratory.",
        solution: "\\b\\w+ly\\b",
        flags: "g",
        hint: "Start with \\b, match letters with \\w+, end with 'ly', and add another \\b."
      },
      {
        task: "Match a <strong style='color:var(--accent)'>number</strong> only when it is located at the very end of a line.",
        text: "Version 10\nStatus 200\nCode 404\nPort 8080",
        solution: "\\d+$",
        flags: "gm",
        hint: "Use \\d+ followed by the end anchor $, with the multiline flag m active."
      },
      {
        task: "Match the word <strong style='color:var(--accent)'>import</strong>, but only when it appears at the start of a line.",
        text: "import sys\nlocal import\nimport os",
        solution: "^import",
        flags: "gm",
        hint: "Use the start anchor ^ followed immediately by the word 'import'."
      }
    ]
  },
  {
    id: 5, title: "Chapter 5: Mirror Temple", difficulty: "intermediate",
    icon: "git-branch",
    intro: "Inside the dark depths of the Mirror Temple, Madeline finds herself trapped in a world of reflections and red bubbles. Alternation provides choice paths (A or B), and capturing groups let her isolate segments of her journey to repeat them.",
    concepts: [
      { key: "(abc)", desc: "Capturing group — saves matched characters for later use" },
      { key: "(?:abc)", desc: "Non-capturing group — groups patterns without saving index" },
      { key: "a|b", desc: "Alternation — matches pattern a OR pattern b" },
      { key: "\\1", desc: "Backreference — matches the exact text matched by group 1" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Capturing groups <code style="color:var(--accent)">()</code> allow you to extract specific parts of a match.
You can reference the contents of group 1 in the regex itself using the backreference <code style="color:var(--accent)">\\1</code>.
</p>
<p style="color:var(--text2);line-height:1.8;">
Non-capturing groups <code style="color:var(--accent)">(?:...)</code> are useful for grouping options without the overhead of saving matches.
</p>`,
    examples: [
      { pattern: "(\\w+)\\s\\1", flags: "g", text: "the the mirror, bubble bubble", desc: "Matches duplicate words using a backreference." },
      { pattern: "(bubble|mirror|crystal)://", flags: "g", text: "bubble://test, mirror://site, crystal://host", desc: "Matches any of the listed terms." },
      { pattern: "(?:level)?\\d{3}", flags: "g", text: "level104, 404, level200", desc: "Groups 'level' optionally without capturing it." }
    ],
    exercises: [
      {
        task: "Extract the <strong style='color:var(--accent)'>protocol and host</strong> from these URLs as two capturing groups.",
        text: "Go to http://google.com or https://github.com or ftp://ftp.mirror.org",
        solution: "(https?|ftp):\\/\\/([\\w.-]+)",
        flags: "g",
        hint: "Capture the protocol (https?|ftp) as group 1, then match ://, and capture the host ([\\w.-]+) as group 2."
      },
      {
        task: "Match dates in the format <strong style='color:var(--accent)'>DD.MM.YYYY</strong> or <strong style='color:var(--accent)'>DD/MM/YYYY</strong>, ensuring both separators are identical.",
        text: "Today is 09.06.2026. Yesterday was 08/06/2026. Invalid date: 09/06.2026",
        solution: "(\\d{2})([./])(\\d{2})\\2(\\d{4})",
        flags: "g",
        hint: "Capture the separator ([./]) as group 2, and use \\2 as a backreference for the second separator."
      },
      {
        task: "Match log filenames ending in <strong style='color:var(--accent)'>.log, .txt, or .ini</strong> using a non-capturing group.",
        text: "app.log, readme.txt, config.ini, script.py, database.db",
        solution: "\\w+\\.(?:log|txt|ini)",
        flags: "g",
        hint: "Use \\w+\\. followed by a non-capturing group containing the extensions separated by pipe characters: (?:log|txt|ini)."
      },
      {
        task: "Match the words <strong style='color:var(--accent)'>GET</strong> or <strong style='color:var(--accent)'>POST</strong> followed by a space and a path.",
        text: "GET /index.html, POST /submit, PUT /delete",
        solution: "(?:GET|POST)\\s\\/[\\w.-]+",
        flags: "g",
        hint: "Group (GET|POST) as a non-capturing group, followed by \\s and a path matching \\/[\\w.-]+."
      }
    ]
  },
  // --- LEVEL 3: ADVANCED ---
  {
    id: 6, title: "Chapter 6: Reflection", difficulty: "advanced",
    icon: "eye",
    intro: "Falling into the depths of the mountain, Madeline confronts her reflection, Badeline. Lookarounds are like peering into the mirror: they verify what lies ahead or behind without taking any steps, keeping her aware of her reflection's movements.",
    concepts: [
      { key: "(?=abc)", desc: "Positive lookahead — asserts that B follows A" },
      { key: "(?!abc)", desc: "Negative lookahead — asserts that B does NOT follow A" },
      { key: "(?<=abc)", desc: "Positive lookbehind — asserts that B precedes A" },
      { key: "(?<!abc)", desc: "Negative lookbehind — asserts that B does NOT precede A" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Lookarounds do not consume any text in the input string. They simply return a true/false match success.
</p>
<p style="color:var(--text2);line-height:1.8;">
For example, <code style="color:var(--accent)">\\d+(?=\\s*m)</code> matches a number only if it is immediately followed by "m" (meters), but "m" is not included in the matched result.
</p>`,
    examples: [
      { pattern: "\\d+(?=px)", flags: "g", text: "width: 100px, height: 200px, count: 5", desc: "Matches numbers followed by 'px'." },
      { pattern: "(?<=\\$)\\d+", flags: "g", text: "$100, $50, 10eur, 20usd", desc: "Matches numbers preceded by a dollar sign." },
      { pattern: "\\b\\w+(?!ing)\\b", flags: "g", text: "We are climbing in Mt Celeste.", desc: "Matches words that do not end in 'ing'." }
    ],
    exercises: [
      {
        task: "Use <strong style='color:var(--accent)'>lookbehind</strong> to extract only the port number (without the preceding colon ':') from the service list.",
        text: "web: :80, secure: :443, database: :5432, proxy: :8080",
        solution: "(?<=:)\\d+",
        flags: "g",
        hint: "Use positive lookbehind (?<=:) followed by \\d+ to match the port digits."
      },
      {
        task: "Match numbers that are immediately followed by the unit <strong style='color:var(--accent)'>ms</strong> (but do not include 'ms' in the match).",
        text: "delay: 150ms, timeout: 5000ms, retry: 3",
        solution: "\\d+(?=ms)",
        flags: "g",
        hint: "Match digits \\d+ followed by a positive lookahead (?=ms)."
      },
      {
        task: "Find the word 'test' only when it is NOT followed by 'case'.",
        text: "testcase, testsuite, unit test, testrun, test script",
        solution: "test(?!case)",
        flags: "g",
        hint: "Use negative lookahead: test(?!case)."
      },
      {
        task: "Match <strong style='color:var(--accent)'>integers</strong> (standalone words) that are NOT preceded by a minus sign <strong style='color:var(--accent)'>-</strong>.",
        text: "Values: 45, -12, 100, -99, 5",
        solution: "(?<!-)\\b\\d+\\b",
        flags: "g",
        hint: "Use negative lookbehind (?<!-) before the word-bounded digits \\b\\d+\\b."
      }
    ]
  },
  {
    id: 7, title: "Chapter 7: The Summit", difficulty: "advanced",
    icon: "tag",
    intro: "Madeline and her other self coordinate their jumps to climb the final summit. Named groups let her label the components of their coordinated climb, making complex, multi-stage movements easy to understand and execute.",
    concepts: [
      { key: "(?<name>...)", desc: "Defines a capturing group named 'name'" },
      { key: "\\k<name>", desc: "Backreference to the group named 'name'" },
      { key: "groups.name", desc: "Access matched group contents in JS" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Instead of referencing group indexes like match[1], you can reference match.groups.name, which is much cleaner and avoids breaking when groups are reordered.
</p>
<div class="code-block" style="padding:14px 16px;margin:12px 0;">
<span style="color:var(--text3);font-size:11px;">JAVASCRIPT</span>
<pre style="color:var(--text);font-size:13px;margin-top:8px;">const re = /(?&lt;user&gt;\\w+)@(?&lt;host&gt;[\\w.-]+)/;
const m = "madeline@celeste.com".match(re);
console.log(m.groups.user); // "madeline"
console.log(m.groups.host); // "celeste.com"</pre>
</div>`,
    examples: [
      { pattern: "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})", flags: "g", text: "Date: 2026-06-09", desc: "Parses dates into descriptive groups." },
      { pattern: "(?<protocol>\\w+):\\/\\/(?<domain>[\\w.-]+)", flags: "g", text: "http://google.com, https://github.com", desc: "Parses URLs using named groups." },
      { pattern: "<(?<tag>\\w+)>.*?</\\k<tag>>", flags: "g", text: "<div>summit</div>, <b>flag</b>", desc: "Matches tag pairs using a named backreference." }
    ],
    exercises: [
      {
        task: "Write a pattern with <strong style='color:var(--accent)'>named groups</strong> to parse an IP address, extracting the four octets into groups (a, b, c, d).",
        text: "IP: 192.168.1.10, Gateway: 10.0.0.1",
        solution: "(?<a>\\d{1,3})\\.(?<b>\\d{1,3})\\.(?<c>\\d{1,3})\\.(?<d>\\d{1,3})",
        flags: "g",
        hint: "Each octet group is (?<name>\\d{1,3}) separated by literal dots \\."
      },
      {
        task: "Extract keys and values from configuration strings using named groups <strong style='color:var(--accent)'>key</strong> and <strong style='color:var(--accent)'>value</strong>.",
        text: "max_connections=100\nport=3306\ndatabase=main",
        solution: "(?<key>\\w+)=(?<value>\\w+)",
        flags: "g",
        hint: "Format is (?<key>\\w+)=(?<value>\\w+)."
      },
      {
        task: "Define groups <strong style='color:var(--accent)'>last</strong> and <strong style='color:var(--accent)'>first</strong> to parse names in 'LastName FirstName' format.",
        text: "Kowalski Jan, Smith John, Doe Jane",
        solution: "(?<last>\\w+)\\s(?<first>\\w+)",
        flags: "g",
        hint: "Use (?<last>\\w+)\\s(?<first>\\w+)."
      },
      {
        task: "Match duplicate adjacent words using a named group <strong style='color:var(--accent)'>word</strong> and backreference \\k<word>.",
        text: "the the code, compiling compiling fine, error error list",
        solution: "(?<word>\\b\\w+)\\s+\\k<word>\\b",
        flags: "g",
        hint: "Use (?<word>\\b\\w+) followed by \\s+ and \\k<word>\\b."
      }
    ]
  },
  {
    id: 8, title: "Chapter 8: Core", difficulty: "advanced",
    icon: "flag",
    intro: "Deep in the Core of the mountain, the environment switches between ice and fire. Regex flags change the global climate and matching behavior of the regex engine, letting Madeline adapt to different conditions.",
    concepts: [
      { key: "g", desc: "Global — matches all occurrences instead of stopping at the first" },
      { key: "i", desc: "Ignore Case — makes matching case-insensitive" },
      { key: "m", desc: "Multiline — anchors ^ and $ match start/end of lines" },
      { key: "s", desc: "DotAll — makes the dot . match newlines" },
      { key: "u", desc: "Unicode — enables full Unicode property escapes" },
      { key: "d", desc: "Indices — exposes start/end coordinates of match groups" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
By default, the dot wildcard <code style="color:var(--accent)">.</code> does not match newline characters (<code style="color:var(--accent)">\\n</code>). Enabling the <code style="color:var(--accent)">s</code> flag changes this behavior, which is essential for multi-line search tasks.
</p>
<p style="color:var(--text2);line-height:1.8;">
The <code style="color:var(--accent)">u</code> flag enables Unicode compliance, allowing you to match characters in non-latin alphabets or emojis using property escapes like <code style="color:var(--accent)">\\p{L}</code>.
</p>`,
    examples: [
      { pattern: "<div>.*?</div>", flags: "gs", text: "<div>ice 1\nfire 2</div>", desc: "s flag allows . to match across newlines." },
      { pattern: "\\p{L}+", flags: "gu", text: "Cześć Świecie! Hello World!", desc: "u flag correctly matches accented unicode letters." },
      { pattern: "core", flags: "gd", text: "Find core here", desc: "d flag adds character coordinate indices to the match object." }
    ],
    exercises: [
      {
        task: "Use flag <strong style='color:var(--accent)'>m</strong> to match the last word of each line in the text.",
        text: "First line data\nSecond line code\nThird line output",
        solution: "\\w+$",
        flags: "gm",
        hint: "Match \\w+ at the end of the line $ with the multiline flag active."
      },
      {
        task: "Match the contents inside <strong style='color:var(--accent)'>&lt;code&gt;...&lt;/code&gt;</strong> tags even when they span multiple lines. Use flag s.",
        text: "<code>const a = 1;\nconst b = 2;</code> and <code>let c = 3;</code>",
        solution: "<code>.*?<\\/code>",
        flags: "gs",
        hint: "Match <code>.*?</code> followed by </code>, ensuring dotAll flag s is enabled."
      },
      {
        task: "Match all words containing international characters using Unicode property escape <strong style='color:var(--accent)'>\\p{L}</strong>. Use flag u.",
        text: "Zażółć gęślą jaźń. Hello World.",
        solution: "\\p{L}+",
        flags: "gu",
        hint: "Enable the Unicode flag u and match letters with \\p{L}+."
      },
      {
        task: "Match all <strong style='color:var(--accent)'>Emoji</strong> characters using Unicode property escapes.",
        text: "Coding is fun! 💻 Learn regex! 🚀 Enjoy!",
        solution: "\\p{Emoji_Presentation}+",
        flags: "gu",
        hint: "Match emojis with \\p{Emoji_Presentation}+ and the gu flags."
      }
    ]
  },
  // --- LEVEL 4: EXPERT ---
  {
    id: 9, title: "Chapter 9: Farewell", difficulty: "expert",
    icon: "cpu",
    intro: "Floating in the starry space of Farewell, Madeline follows a glowing bird. An unoptimized path can lead to infinite loops and catastrophic backtracking. To find peace, she must learn to build secure paths.",
    concepts: [
      { key: "Catastrophic Backtracking", desc: "Exponential growth in engine steps on failing strings" },
      { key: "Tempered Greedy Token", desc: "Safe matching without over-consuming characters" },
      { key: "ReDoS Security", desc: "Avoiding nested quantifiers to protect server instances" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
A regular expression with nested optional quantifiers like <code style="color:var(--red)">(a+)+b</code> can take billions of steps to evaluate a string like "aaaaaaaaaaaaaaaaac".
</p>
<p style="color:var(--text2);line-height:1.8;">
To prevent ReDoS (Regular Expression Denial of Service), avoid nesting quantifiers, keep alternations mutually exclusive, and use specific character classes instead of wildcards where possible.
</p>`,
    examples: [
      { pattern: "(?=(\\w+))\\1(?=\\1)", flags: "g", text: "aa bb aaa bbbb", desc: "Emulates atomic grouping in JavaScript." },
      { pattern: "^(?:(?!ERROR).)*$", flags: "gm", text: "INFO: OK\nERROR: Failed\nDEBUG: Done", desc: "Matches lines that do not contain 'ERROR'." },
      { pattern: "^[^/]+$", flags: "g", text: "usr/local/bin vs usrlocalbin", desc: "Using strict negated character classes instead of wildcards." }
    ],
    exercises: [
      {
        task: "Match C-style multi-line comments <strong style='color:var(--accent)'>/* ... */</strong> safely so they do not contain */ inside them. Use a tempered greedy token.",
        text: "/* valid comment */ code() /* second comment */ /* invalid */ code /* /* nested */ */",
        solution: "\\/\\*(?:(?!\\*\\/).|\\n)*?\\*\\/",
        flags: "gs",
        hint: "Match /* followed by a non-capturing group asserting no */ exists, and close with */."
      },
      {
        task: "Use a tempered greedy token to match double-quoted strings <strong style='color:var(--accent)'>\"...\"</strong> that do not contain quotes or newlines.",
        text: 'Text: "first string" and "second\ninvalid" and "third"',
        solution: "\"(?:(?![\"\\n]).)*?\"",
        flags: "g",
        hint: "Match \" followed by a tempered group blocking quotes/newlines, and end with \"."
      },
      {
        task: "Match entire lines of logs that do NOT contain the word <strong style='color:var(--accent)'>SECRET</strong>.",
        text: "Line is public\nThis line has SECRET info\nAnother safe line\nSECRET message",
        solution: "^(?:(?!SECRET).)*$",
        flags: "gm",
        hint: "Start with ^, use a tempered greedy token (?!SECRET). to match line contents, and end with $."
      },
      {
        task: "Match entire lines of non-whitespace characters without nesting quantifiers to prevent backtracking.",
        text: "word\nsome_text_key\nline with spaces\nlast_word",
        solution: "^[^\\s]+$",
        flags: "gm",
        hint: "Avoid (\\w+)+ and use a single character class quantifier instead: ^[^\\s]+$."
      }
    ]
  },
  {
    id: 10, title: "Collectibles & Strawberries", difficulty: "expert",
    icon: "replace",
    intro: "After her climb, Madeline reviews her inventory of strawberries, cassette tapes, and records. By combining capturing groups with string replacements, she can reformat her lists and catalog her achievements.",
    concepts: [
      { key: "str.replace(re, '$1')", desc: "Injects capturing group 1 into the replacement string" },
      { key: "str.replace(re, fn)", desc: "Executes a function to dynamically calculate replacement" },
      { key: "$&", desc: "Represents the entire matched substring" },
      { key: "$<name>", desc: "References a named capturing group in the replacement string" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
JavaScript's <code style="color:var(--accent)">String.prototype.replace()</code> accepts regex. Capturing groups can be referenced in the replacement string using <code style="color:var(--accent)">$1</code>, <code style="color:var(--accent)">$2</code>, etc.
</p>
<p style="color:var(--text2);line-height:1.8;">
For named groups, you can reference them using <code style="color:var(--accent)">$&lt;name&gt;</code>, making replacements self-documenting.
</p>`,
    examples: [
      { pattern: "(\\d{4})-(\\d{2})-(\\d{2})", flags: "g", text: "2026-06-09", desc: "Can be replaced with '$3.$2.$1' to produce '09.06.2026'." },
      { pattern: "(\\b\\w)", flags: "g", text: "hello world code", desc: "Can be replaced dynamically to uppercase the first letter of each word." },
      { pattern: "(?<first>\\w+)\\s(?<last>\\w+)", flags: "g", text: "John Doe", desc: "Can be replaced with '$<last>, $<first>' to produce 'Doe, John'." }
    ],
    exercises: [
      {
        task: "Capture phone numbers in various formats to normalize them. Ensure you capture three sets of three digits.",
        text: "Phone: 123456789, 123-456-789, +48123456789, 48 123 456 789",
        solution: "(?:\\+?48[\\s-]?)?(\\d{3})[\\s-]?(\\d{3})[\\s-]?(\\d{3})",
        flags: "g",
        hint: "Ignore optional +48/48 prefixes and spaces/hyphens, and capture three groups of \\d{3}."
      },
      {
        task: "Capture first and last name as two groups, to swap them to 'LastName, FirstName'.",
        text: "John Doe, Jane Smith, Alan Turing",
        solution: "(\\w+)\\s(\\w+)",
        flags: "g",
        hint: "Capture the first word as group 1 and the second word as group 2."
      },
      {
        task: "Capture the contents of Markdown bold syntax <strong style='color:var(--accent)'>**text**</strong>.",
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
    id: 11, title: "Crystal Heart Validation", difficulty: "expert",
    icon: "wrench",
    intro: "To unlock the gates of the mountain's core, Madeline must validate the authenticity of the Crystal Hearts she collected. Standard patterns like IP, color codes, and password rules serve as gate locks.",
    concepts: [
      { key: "Validation Patterns", desc: "Ensure user inputs match specific syntax rules" },
      { key: "OWASP Guidelines", desc: "Best practices for writing secure input validation patterns" },
      { key: "Strict Anchoring", desc: "Using ^ and $ to ensure the entire input matches the pattern" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
When writing input validation patterns, always use the start anchor <code style="color:var(--accent)">^</code> and end anchor <code style="color:var(--accent)">$</code>. Without them, a user could append invalid content before or after a valid pattern.
</p>
<p style="color:var(--text2);line-height:1.8;">
For example, <code style="color:var(--accent)">/\\d{3}/</code> matches "abc123xyz", but <code style="color:var(--accent)">/^\\d{3}$/</code> only matches exactly "123".
</p>`,
    examples: [
      { pattern: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}$", flags: "i", text: "valid@email.com\ninvalid@\ntest@domain.co.uk", desc: "A standard email validation regex." },
      { pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$", flags: "", text: "weak123\nValidPass99\nUPPERCASE_ONLY", desc: "Password validation checking for length, uppercase, lowercase, and digit." },
      { pattern: "^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)$", flags: "g", text: "192.168.1.1\n300.400.5.1", desc: "Validates IPv4 addresses within the 0-255 range." }
    ],
    exercises: [
      {
        task: "Write a pattern to validate a <strong style='color:var(--accent)'>Polish PESEL ID number</strong> (11 digits, YYMMDD + 5 digits). Check month and day ranges.",
        text: "44051401458\n00271401458\n123\nABCDEFGHIJK\n85103112345\n990101XXXXX",
        solution: "^\\d{2}(?:0[1-9]|[1-2]\\d|3[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{5}$",
        flags: "gm",
        hint: "Verify PESEL structure: YY (MM 01-32) (DD 01-31) NNNNN. Shift month by +20 for years 2000+."
      },
      {
        task: "Write a validation pattern for <strong style='color:var(--accent)'>HEX color codes</strong> (e.g. #fff, #00AABB), supporting 3 or 6 hex digits.",
        text: "#FFF\n#00e5ff\n#12345\n#ABCDEFG\n#FF00FF\ngreen",
        solution: "^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$",
        flags: "gm",
        hint: "Anchor the pattern with ^ and $, and use alternation for 3 or 6 hex digits."
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
    id: 12, title: "PICO-8 Emulator Lexer", difficulty: "master",
    icon: "zap",
    intro: "Deep inside the resort, Madeline finds a hidden PICO-8 console running the original Celeste prototype. To run the game code, she must write a lexer using the sticky flag (y) to match tokens exactly at the cursor's location.",
    concepts: [
      { key: "/pattern/y", desc: "Sticky flag — matches only starting at the exact position of lastIndex" },
      { key: "regex.lastIndex", desc: "The index in the string where the next match attempt will begin" },
      { key: "Tokenization", desc: "Splitting a source code string into structured lexical tokens" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Like the global flag <code style="color:var(--accent)">g</code>, the sticky flag <code style="color:var(--accent)">y</code> allows multiple matches on a string. However, it does not scan ahead. It <strong>must</strong> match at <code style="color:var(--accent)">lastIndex</code>.
</p>
<p style="color:var(--text2);line-height:1.8;">
This makes lexical analysis incredibly fast, as the engine does not perform redundant forward scanning on mismatching positions.
</p>`,
    examples: [
      { pattern: "foo", flags: "y", text: "abc foo", desc: "Fails (returns null) because 'foo' does not start at index 0." },
      { pattern: "\\d+", flags: "y", text: "123 456", desc: "Matches 123. If lastIndex is set to 4, it matches 456." },
      { pattern: "[a-zA-Z_]\\w*", flags: "y", text: "x = 10", desc: "Matches 'x' starting at index 0." }
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
    id: 13, title: "Cassette Block Rhythm", difficulty: "master",
    icon: "git-merge",
    intro: "Blue and pink blocks appear and disappear in sync with the cassette music. Madeline must time her jumps conditionally based on the active color. Lookarounds and alternations let her build conditional assertions.",
    concepts: [
      { key: "(?=A)B|(?!A)C", desc: "If A matches, B must match. Else, C must match" },
      { key: "Stacked Lookaheads", desc: "Logical AND grouping of multiple lookaround checks" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
You can emulate if-then-else conditions using lookarounds:
<code style="color:var(--accent)">(?=condition)then_pattern|(?!condition)else_pattern</code>.
</p>
<p style="color:var(--text2);line-height:1.8;">
This lets you write complex assertions, such as validating fields based on the presence of certain characters elsewhere in the line.
</p>`,
    examples: [
      { pattern: "^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$", flags: "g", text: "secret123\nAdmin123", desc: "Ensures both uppercase and digit rules are met." },
      { pattern: "(?=.*a)(?=.*b)\\w+", flags: "g", text: "apple, banana, cab, boat", desc: "Matches words containing both 'a' and 'b'." }
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
    id: 14, title: "Heart of the Mountain", difficulty: "master",
    icon: "shield",
    intro: "At the summit's core, Madeline reaches the Heart of the Mountain. To stabilize the crystalline core and prevent infinite backtracking loops, she must audit her quantifiers, ensuring all paths are clean and ReDoS-proof.",
    concepts: [
      { key: "Overlapping Paths", desc: "Avoid branches that can match the same character sequences" },
      { key: "Deterministic Matching", desc: "Writing patterns that have exactly one path to succeed or fail" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
ReDoS occurs when a pattern has multiple ways to match the same input sequence, causing the engine to try all exponential combinations.
</p>
<p style="color:var(--text2);line-height:1.8;">
Ensure your alternations are mutually exclusive and restrict the scope of quantifiers. Instead of <code style="color:var(--red)">(a+)+</code>, use <code style="color:var(--green)">a+</code>.
</p>`,
    examples: [
      { pattern: "^a+$", flags: "g", text: "aaaaa", desc: "Safe, linear execution." },
      { pattern: "^[^/]+$", flags: "g", text: "usr/local/bin vs usrlocalbin", desc: "Using strict negated character classes instead of wildcards." }
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
