export const cyberpunk = [
  // --- LEVEL 1: BEGINNER ---
  {
    id: 0, title: "Breaching the Grid", difficulty: "beginner",
    icon: "terminal",
    intro: "Welcome, Netrunner. You are standing before the Arasaka mainframe firewall. To establish an initial uplink, you must execute literal matches against leaking telemetry streams. Literal matching targets exact data packets flowing through the net.",
    concepts: [
      { key: "/pattern/", desc: "Literal match — target exact security string signature" },
      { key: "g", desc: "Global flag — scan the entire system memory grid" },
      { key: "i", desc: "Case-insensitive flag — ignore casing on encrypted packets" },
    ],
    theory: `
<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Every node on the grid speaks in data packets. To filter out the firewall beacons, we write query signatures.
A signature like <code style="color:var(--accent)">/node/</code> will target exact signal matches.
</p>
<p style="color:var(--text2);line-height:1.8;">
In your cyber-deck, regex is written between forward slashes: <code style="color:var(--accent)">/pattern/flags</code>.<br>
Enable the <code style="color:var(--accent)">g</code> flag to breach all matching addresses, and the <code style="color:var(--accent)">i</code> flag to bypass upper/lowercase decryption.
</p>`,
    examples: [
      { pattern: "node", flags: "gi", text: "Active node. Node online. NODE breached.", desc: "Matches all cases of 'node' in the signal stream." },
      { pattern: "port", flags: "g", text: "Port open. Secure port. Port closed. PORT bypass.", desc: "Matches lowercase 'port' but misses capitalized instances." },
      { pattern: "hash", flags: "i", text: "New HASH. Read hash.", desc: "Matches first 'hash' case-insensitively but doesn't continue scanning." }
    ],
    exercises: [
      {
        task: "Locate the word <strong style='color:var(--accent)'>node</strong> in the console log stream (ignore case, find all).",
        text: "Connecting to Node 1... Primary node is secure. NODE bypass successful.",
        solution: "node",
        flags: "gi",
        hint: "Type 'node' and select both the g and i flags on your deck."
      },
      {
        task: "Locate the word <strong style='color:var(--accent)'>grid</strong> in the system telemetry (ignore case, find all).",
        text: "Main Grid offline. Backup grid operational. Overriding GRID protocols.",
        solution: "grid",
        flags: "gi",
        hint: "Match the keyword 'grid' with global and case-insensitive flags."
      },
      {
        task: "Find the word <strong style='color:var(--accent)'>port</strong> (exact lowercase match, all occurrences).",
        text: "Open port 80. Scan port 443. PORT 8080 restricted.",
        solution: "port",
        flags: "g",
        hint: "Search for 'port' using only the global flag. Casing must match exactly."
      },
      {
        task: "Find the word <strong style='color:var(--accent)'>hash</strong> (ignore case, find all matches).",
        text: "Analyzing HASH... Secure hash generated. HASH collision avoided.",
        solution: "hash",
        flags: "gi",
        hint: "Match the word 'hash' with the gi flags."
      }
    ]
  },
  {
    id: 1, title: "Subnet Scanning", difficulty: "beginner",
    icon: "shield",
    intro: "Mainframe nodes are segmented into subnets. Character classes let you scan a single slot for a set of permitted values. Use brackets to isolate targets like port digits, cipher letters, or network vectors.",
    concepts: [
      { key: "[abc]", desc: "Character set — match any single character: a, b, or c" },
      { key: "[a-z]", desc: "Range — match any lowercase letter in range" },
      { key: "[^abc]", desc: "Negate class — match any character EXCEPT a, b, or c" },
      { key: "[0-9]", desc: "Match any single digit in the grid sector" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Square brackets <code style="color:var(--accent)">[ ]</code> isolate character pools. The deck will match precisely <strong style="color:var(--text)">one character</strong> from the pool.
</p>
<p style="color:var(--text2);line-height:1.8;">
Inside pools, ranges are denoted by <code style="color:var(--accent)">-</code> (e.g. <code style="color:var(--accent)">0-9</code> for digits, <code style="color:var(--accent)">a-f</code> for hex values). Inserting <code style="color:var(--accent)">^</code> at the start negates the pool, targeting anything else.
</p>`,
    examples: [
      { pattern: "[aeiou]", flags: "g", text: "infiltrating deck", desc: "Isolate lowercase vowels in access string." },
      { pattern: "[^a-zA-Z ]", flags: "g", text: "Net_Node#99: bypass!", desc: "Target non-alphabetic system characters." },
      { pattern: "[0-9a-fA-F]", flags: "g", text: "Access Key: 0x9F3C", desc: "Select hexadecimal character digits." }
    ],
    exercises: [
      {
        task: "Write a pattern that matches only the <strong style='color:var(--accent)'>digits</strong> in the sector IP sequence.",
        text: "Uplink: +48 (123) 456-789",
        solution: "[0-9]",
        altSolutions: ["\\d"],
        flags: "g",
        hint: "Use character class [0-9] or the digit shorthand \\d."
      },
      {
        task: "Match only the letters <strong style='color:var(--accent)'>x, y, or z</strong> (case-sensitive) in the decryption stream.",
        text: "matrix, proxy, system, x-axis, zone",
        solution: "[xyz]",
        flags: "g",
        hint: "Specify the character set: [xyz]."
      },
      {
        task: "Match any character <strong style='color:var(--accent)'>except lowercase vowels</strong> (a, e, i, o, u) in the cipher code.",
        text: "cyber deck",
        solution: "[^aeiou]",
        flags: "g",
        hint: "Use negation in the character set: [^aeiou]."
      },
      {
        task: "Match letters <strong style='color:var(--accent)'>a, b, or c</strong> (case-insensitive, all occurrences) from the target list.",
        text: "Access Terminal A, Backup database B, Cluster C.",
        solution: "[abc]",
        flags: "gi",
        hint: "Use class [abc] and enable the i flag."
      }
    ]
  },
  {
    id: 2, title: "Mainframe Shorthands", difficulty: "beginner",
    icon: "cpu",
    intro: "In high-speed breaches, writing full character sets is too slow. Shorthand character classes provide ready-made macros to target digits, word characters, or blank spaces instantly.",
    concepts: [
      { key: "\\d", desc: "Target digits [0-9]" },
      { key: "\\D", desc: "Target non-digits" },
      { key: "\\w", desc: "Target alphanumeric characters & underscore" },
      { key: "\\W", desc: "Target non-word characters (symbols, operators)" },
      { key: "\\s", desc: "Target whitespace buffer spacing" },
      { key: "\\S", desc: "Target non-whitespace values" },
      { key: ".", desc: "Wildcard — match any single byte except newline" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Shorthands use backslashes. Remember the rule: <strong style="color:var(--text)">lowercase is inclusive</strong>, and <strong style="color:var(--text)">uppercase is exclusive (negation)</strong>.
</p>
<p style="color:var(--text2);line-height:1.8;">
The dot <code style="color:var(--accent)">.</code> matches any character except a newline. If you need to verify a literal dot in a hostname, escape it: <code style="color:var(--accent)">\\.</code>
</p>`,
    examples: [
      { pattern: "\\d+", flags: "g", text: "ID: 9482, secret: 2901", desc: "Matches sequences of digits." },
      { pattern: "\\w+", flags: "g", text: "net_id-99 dev_host", desc: "Matches word characters (ignores hyphens)." },
      { pattern: "\\S+", flags: "g", text: "Secure-Key: $99.99!", desc: "Matches non-whitespace character clusters." }
    ],
    exercises: [
      {
        task: "Extract the <strong style='color:var(--accent)'>node code</strong> in the format XX-XXX using \\d and a literal hyphen.",
        text: "Node code: 30-059, Sector 2",
        solution: "\\d{2}-\\d{3}",
        altSolutions: ["[0-9]{2}-[0-9]{3}"],
        flags: "g",
        hint: "Combine two digits, a hyphen, and three digits: \\d{2}-\\d{3}."
      },
      {
        task: "Find all <strong style='color:var(--accent)'>whitespace characters</strong> (spaces, tabs, newlines) in the packet buffer.",
        text: "Grid\tNode\nActive\tBypass.",
        solution: "\\s",
        flags: "g",
        hint: "Use the whitespace shorthand: \\s."
      },
      {
        task: "Match the sequence 'a', <strong style='color:var(--accent)'>any character</strong>, then 'b' in the decrypted key.",
        text: "axb, a-b, a.b, ab, a b, abb, acb",
        solution: "a.b",
        flags: "g",
        hint: "Use the wildcard dot: a.b"
      },
      {
        task: "Match any character that is <strong style='color:var(--accent)'>NOT a word character</strong> in the password payload.",
        text: "root_user: admin@10.0.0.1!",
        solution: "\\W",
        flags: "g",
        hint: "Use the uppercase negation shorthand: \\W."
      }
    ]
  },
  // --- LEVEL 2: INTERMEDIATE ---
  {
    id: 3, title: "Data Streams", difficulty: "intermediate",
    icon: "repeat",
    intro: "Mainframe transmissions vary in length. Quantifiers allow you to specify repeating patterns, matching precise data structures like hex hashes, phone lines, or code tags.",
    concepts: [
      { key: "*", desc: "Match 0 or more occurrences (greedy)" },
      { key: "+", desc: "Match 1 or more occurrences (greedy)" },
      { key: "?", desc: "Match 0 or 1 occurrence (optional)" },
      { key: "{n}", desc: "Match exactly n occurrences" },
      { key: "{n,m}", desc: "Match between n and m occurrences" },
      { key: "{n,}", desc: "Match at least n occurrences" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Quantifiers are <strong style="color:var(--accent)">greedy</strong> by default, consuming as much text as possible.
</p>
<p style="color:var(--text2);line-height:1.8;">
Adding <code style="color:var(--accent)">?</code> after a quantifier (e.g. <code style="color:var(--accent)">+?</code>, <code style="color:var(--accent)">*?</code>) toggles it to <strong style="color:var(--green)">lazy</strong> mode, making it stop at the first valid closing character.
</p>`,
    examples: [
      { pattern: "\\d{3}-\\d{3}-\\d{3}", flags: "g", text: "Comm link: 501-202-303", desc: "Matches 3 groups of 3 digits separated by hyphens." },
      { pattern: "hacke?r", flags: "g", text: "Class: hacker, Class: hackr", desc: "Matches both spellings by making the 'e' optional." },
      { pattern: "\\b\\d{4,}\\b", flags: "g", text: "Code: 99, Node: 2026, Cluster: 123456", desc: "Matches numbers that are at least 4 digits long." }
    ],
    exercises: [
      {
        task: "Match all <strong style='color:var(--accent)'>HTML/XML tags</strong> in the node response using a lazy quantifier.",
        text: "<h1>Terminal</h1> <p class=\"code\">Status <b>online</b>!</p>",
        solution: "<.+?>",
        flags: "g",
        hint: "Target tags with <.+?>, which matches characters lazily between angle brackets."
      },
      {
        task: "Match the terms <strong style='color:var(--accent)'>link</strong> and <strong style='color:var(--accent)'>links</strong> (where 's' is optional).",
        text: "Active link. Verify all links.",
        solution: "links?",
        flags: "g",
        hint: "Make 's' optional with ?: links?"
      },
      {
        task: "Find all words that contain <strong style='color:var(--accent)'>3 to 5 letters</strong>.",
        text: "The grid host runs fast logs.",
        solution: "\\b\\w{3,5}\\b",
        flags: "g",
        hint: "Use word boundaries \\b and the range quantifier: \\b\\w{3,5}\\b."
      },
      {
        task: "Find digit sequences that are <strong style='color:var(--accent)'>exactly 4 digits long</strong>.",
        text: "Years: 1999, 2020, 2026 and levels 12, 104, 88888.",
        solution: "\\b\\d{4}\\b",
        flags: "g",
        hint: "Match exactly 4 digits: \\b\\d{4}\\b."
      }
    ]
  },
  {
    id: 4, title: "Signal Boundaries", difficulty: "intermediate",
    icon: "anchor",
    intro: "Firewalls filter patterns based on their position. Anchors don't match characters, but they lock the pattern location: starting at the line edge, or isolated within word borders.",
    concepts: [
      { key: "^", desc: "Start of line anchor (with multiline flag m)" },
      { key: "$", desc: "End of line anchor (with multiline flag m)" },
      { key: "\\b", desc: "Word boundary anchor" },
      { key: "\\B", desc: "Non-word boundary anchor" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
<code style="color:var(--accent)">\\b</code> ensures you match a full token rather than a substring. It matches the border where alphanumeric characters meet symbols or spaces.
</p>
<p style="color:var(--text2);line-height:1.8;">
With the multiline flag <code style="color:var(--accent)">m</code>, the anchors <code style="color:var(--accent)">^</code> and <code style="color:var(--accent)">$</code> check the boundaries of every line in the console stack.
</p>`,
    examples: [
      { pattern: "\\bnet\\b", flags: "g", text: "Connect to net. Internet gateway. Network active.", desc: "Matches 'net' but not 'internet' or 'network'." },
      { pattern: "^\\d+", flags: "gm", text: "1. Login\n2. Bypass\n  3. Secure", desc: "Matches digits at the beginning of each line." },
      { pattern: "\\b\\w+ing\\b", flags: "g", text: "Hacking and tracing are starting.", desc: "Matches words ending in 'ing' at word boundaries." }
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
    id: 5, title: "Routing & Multiplexing", difficulty: "intermediate",
    icon: "git-branch",
    intro: "Mainframe lines contain multiplexed routing paths. Capturing groups let you extract target arguments, and alternation acts as a logical OR to scan multiple network protocols.",
    concepts: [
      { key: "(abc)", desc: "Capturing group — extract and save arguments" },
      { key: "(?:abc)", desc: "Non-capturing group — group without index overhead" },
      { key: "a|b", desc: "Alternation — OR operator matching path a or b" },
      { key: "\\1", desc: "Backreference — match the exact string caught in group 1" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Use parenthesis <code style="color:var(--accent)">()</code> to group tokens. The matches are stored in numeric indices, allowing backreferences like <code style="color:var(--accent)">\\1</code> to ensure repetition matches.
</p>
<p style="color:var(--text2);line-height:1.8;">
Alternation <code style="color:var(--accent)">|</code> acts as a choice path. In complex pipelines, use non-capturing groups <code style="color:var(--accent)">(?:...)</code> to group choices cleanly.
</p>`,
    examples: [
      { pattern: "(\\w+)\\s\\1", flags: "g", text: "bypass bypass terminal. code code loop.", desc: "Matches duplicate words." },
      { pattern: "(http|https|ftp)://", flags: "g", text: "http://host, https://node, ftp://data", desc: "Matches network protocols." },
      { pattern: "(?:level)?\\d{3}", flags: "g", text: "level104, 404, level200", desc: "Matches levels optionally without capturing tag." }
    ],
    exercises: [
      {
        task: "Extract the <strong style='color:var(--accent)'>protocol and host</strong> from these URL links as two capturing groups.",
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
    id: 6, title: "Lookaround Scans", difficulty: "advanced",
    icon: "eye",
    intro: "Firewall scanning tools probe nodes without modifying them. Lookarounds are zero-width checks: they scan ahead or behind to verify access conditions without consuming string index bytes.",
    concepts: [
      { key: "(?=abc)", desc: "Positive lookahead — verify pattern follows" },
      { key: "(?!abc)", desc: "Negative lookahead — verify pattern does not follow" },
      { key: "(?<=abc)", desc: "Positive lookbehind — verify pattern precedes" },
      { key: "(?<!abc)", desc: "Negative lookbehind — verify pattern does not precede" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Lookarounds perform scans without advancing the engine pointer. They return a true/false condition check.
</p>
<p style="color:var(--text2);line-height:1.8;">
For example, <code style="color:var(--accent)">\\d+(?=ms)</code> matches latency digits followed by "ms" but does not match "ms" itself, allowing clean numerical extraction.
</p>`,
    examples: [
      { pattern: "\\d+(?=db)", flags: "g", text: "cluster: 10db, node: 5db, power: 12", desc: "Matches numbers followed by 'db'." },
      { pattern: "(?<=\\$)\\d+", flags: "g", text: "$100, $200, 30eur", desc: "Matches values preceded by a dollar sign." }
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
    id: 7, title: "Named Registers", difficulty: "advanced",
    icon: "tag",
    intro: "For complex exploits, index numbers are hard to track. Named groups let you assign handles to captured parameters, making it easy to parse packet headers, ports, and addresses.",
    concepts: [
      { key: "(?<name>...)", desc: "Assign name handle to capturing group" },
      { key: "\\k<name>", desc: "Named backreference inside pattern" },
      { key: "groups.name", desc: "Extract via groups property object" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Instead of referencing group indexes like match[1], named groups provide handles:
</p>
<div class="code-block" style="padding:14px 16px;margin:12px 0;">
<span style="color:var(--text3);font-size:11px;">JAVASCRIPT</span>
<pre style="color:var(--text);font-size:13px;margin-top:8px;">const re = /(?&lt;node&gt;\\w+)@(?&lt;subnet&gt;[\\w.-]+)/;
const m = "admin@arasaka.com".match(re);
console.log(m.groups.node);   // "admin"
console.log(m.groups.subnet); // "arasaka.com"</pre>
</div>`,
    examples: [
      { pattern: "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})", flags: "g", text: "Exploit date: 2026-06-09", desc: "Extract date parameters as variables." },
      { pattern: "<(?<tag>\\w+)>.*?</\\k<tag>>", flags: "g", text: "<b>bold</b>, <i>italic</i>", desc: "Match tags using a named backreference." }
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
    id: 8, title: "Operational Flags", difficulty: "advanced",
    icon: "flag",
    intro: "Compiler flags dictate the global behavior of the regex engine. Tweak your deck flags to handle multi-line signal dumps, Unicode cipher characters, or group coordinate indices.",
    concepts: [
      { key: "g", desc: "Global scan — search entire buffer for matches" },
      { key: "i", desc: "Ignore case — bypass capitalization rules" },
      { key: "m", desc: "Multiline — check anchors ^ and $ per line" },
      { key: "s", desc: "DotAll — allow dot to match newline bytes" },
      { key: "u", desc: "Unicode — full compliance with international symbols" },
      { key: "d", desc: "Indices — expose match positions" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
By default, the dot wildcard <code style="color:var(--accent)">.</code> stops at newline boundaries. Enabling the <code style="color:var(--accent)">s</code> flag is required to scan multi-line signal logs.
</p>
<p style="color:var(--text2);line-height:1.8;">
The <code style="color:var(--accent)">u</code> flag enables Unicode property escapes like <code style="color:var(--accent)">\\p{L}</code> (letters) and emoji structures.
</p>`,
    examples: [
      { pattern: "<div>.*?</div>", flags: "gs", text: "<div>data\ncode</div>", desc: "Matches across line breaks." }
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
    id: 9, title: "Buffer Overflows", difficulty: "expert",
    icon: "cpu",
    intro: "Badly structured regular expressions can lead to ReDoS, locking your processor in a backtracking loop. You must optimize your patterns to prevent firewalls from lagging out your deck.",
    concepts: [
      { key: "Catastrophic Backtracking", desc: "Infinite recursion on non-matching strings" },
      { key: "Tempered Greedy Token", desc: "Verify line content without backtracking" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
A nested loop pattern like <code style="color:var(--red)">(a+)+b</code> forces the engine to try millions of path combinations on a mismatch, causing the CPU to hang.
</p>
<p style="color:var(--text2);line-height:1.8;">
Optimize by using negated character classes instead of open wildcards, and keep alternate paths completely distinct.
</p>`,
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
    id: 10, title: "Payload Injection", difficulty: "expert",
    icon: "replace",
    intro: "Hacking is not just reading, it's modifying. By combining capturing groups with deck replacements, you can rewrite system logs, swap variable coordinates, and sanitize headers.",
    concepts: [
      { key: "str.replace(re, '$1')", desc: "Substitute captured groups into output" },
      { key: "Named Replacements", desc: "Inject named parameters using $<name>" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Use JS <code style="color:var(--accent)">replace()</code> to swap or format captured data. Groups captured inside brackets can be referenced in the replacement payload using <code style="color:var(--accent)">$1</code> or <code style="color:var(--accent)">$&lt;name&gt;</code>.
</p>`,
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
    id: 11, title: "Credential Scrypts", difficulty: "expert",
    icon: "wrench",
    intro: "This level prepares you for field operations: auditing hex codes, validating passwords, verifying IPv4 subnets, and validating identity tokens.",
    concepts: [
      { key: "Validation", desc: "Lock down inputs using start/end anchors" },
      { key: "IPv4 Check", desc: "Validating octet ranges between 0 and 255" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Input validation requires strict anchoring with <code style="color:var(--accent)">^</code> and <code style="color:var(--accent)">$</code> to ensure malicious payloads aren't injected before or after valid segments.
</p>`,
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
        hint: "Anchor the pattern with ^ and $, and use alternation for 3 or 6 hex characters."
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
    id: 12, title: "Sticky Tokens", difficulty: "master",
    icon: "zap",
    intro: "The sticky flag (y) forces matching to start exactly at the current pointer offset, enabling the creation of lightning-fast code compilers and exploits.",
    concepts: [
      { key: "/pattern/y", desc: "Sticky flag — matches only at the index of lastIndex" },
      { key: "lastIndex", desc: "Cursor index governing the start of the next match attempt" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
The sticky flag <code style="color:var(--accent)">y</code> allows you to parse strings incrementally. If the pattern does not match starting precisely at <code style="color:var(--accent)">lastIndex</code>, it fails immediately rather than scanning forward.
</p>`,
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
    id: 13, title: "Quantum Gates", difficulty: "master",
    icon: "git-merge",
    intro: "In complex environments, you must branch conditions dynamically. Combine lookarounds and alternations to construct logical IF-THEN-ELSE gates within your patterns.",
    concepts: [
      { key: "Gate Logic", desc: "(?=cond)then|(!cond)else" },
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Emulate conditional routing in Javascript:
<code style="color:var(--accent)">(?=condition)then_pattern|(?!condition)else_pattern</code>.
</p>`,
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
    id: 14, title: "Icebreaker Protocols", difficulty: "master",
    icon: "shield",
    intro: "Congratulations, Netrunner. You have reached the core server. To safely extract the databases without triggering firewalls or locking up your CPU, perform a final audit on your quantifiers to block ReDoS vulnerabilities.",
    concepts: [
      { key: "ICE Protection", desc: "Avoid overlapping quantifier branches to ensure deterministic execution paths" }
    ],
    theory: `<p style="color:var(--text2);line-height:1.8;margin-bottom:16px;">
Writing safe regular expressions is a key netrunning skill. Overlapping quantifiers like <code style="color:var(--red)">(\\w+\\s*)+</code> allow the firewall to slow down your code and trigger alarms.
</p>`,
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
