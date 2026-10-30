export const cyberpunk = [
  {
    "id": 0,
    "title": "Breaching the Grid",
    "difficulty": "beginner",
    "icon": "terminal",
    "intro": "Welcome, Netrunner. You are standing before the Arasaka mainframe firewall. To establish an initial uplink, you must execute literal matches against leaking telemetry streams. Literal matching targets exact data packets flowing through the net.",
    "concepts": [
      {
        "key": "/pattern/",
        "desc": "Literal match — target exact security string signature"
      },
      {
        "key": "g",
        "desc": "Global flag — scan the entire system memory grid"
      },
      {
        "key": "i",
        "desc": "Case-insensitive flag — ignore casing on encrypted packets"
      }
    ],
    "theory": "\n<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nEvery node on the grid speaks in data packets. To filter out the firewall beacons, we write query signatures.\nA signature like <code style=\"color:var(--accent)\">/node/</code> will target exact signal matches.\n</p>\n<p style=\"color:var(--text2);line-height:1.8;\">\nIn your cyber-deck, regex is written between forward slashes: <code style=\"color:var(--accent)\">/pattern/flags</code>.<br>\nEnable the <code style=\"color:var(--accent)\">g</code> flag to breach all matching addresses, and the <code style=\"color:var(--accent)\">i</code> flag to bypass upper/lowercase decryption.\n</p>",
    "examples": [
      {
        "pattern": "node",
        "flags": "gi",
        "text": "Active node. Node online. NODE breached.",
        "desc": "Matches all cases of 'node' in the signal stream."
      },
      {
        "pattern": "port",
        "flags": "g",
        "text": "Port open. Secure port. Port closed. PORT bypass.",
        "desc": "Matches lowercase 'port' but misses capitalized instances."
      },
      {
        "pattern": "hash",
        "flags": "i",
        "text": "New HASH. Read hash.",
        "desc": "Matches first 'hash' case-insensitively but doesn't continue scanning."
      }
    ],
    "exercises": [
      {
        "task": "Locate the word <code class=\"target-token\">node</code> in the console log stream (ignore case, find all).",
        "text": "Connecting to Node 1... Primary node is secure. NODE bypass successful.",
        "solution": "node",
        "flags": "gi",
        "hint": "Type 'node' and select both the g and i flags on your deck."
      },
      {
        "task": "Locate the word <code class=\"target-token\">grid</code> in the system telemetry (ignore case, find all).",
        "text": "Main Grid offline. Backup grid operational. Overriding GRID protocols.",
        "solution": "grid",
        "flags": "gi",
        "hint": "Match the keyword 'grid' with global and case-insensitive flags."
      },
      {
        "task": "Find the word <code class=\"target-token\">port</code> (exact lowercase match, all occurrences).",
        "text": "Open port 80. Scan port 443. PORT 8080 restricted.",
        "solution": "port",
        "flags": "g",
        "hint": "Search for 'port' using only the global flag. Casing must match exactly."
      },
      {
        "task": "Find the word <code class=\"target-token\">hash</code> (ignore case, find all matches).",
        "text": "Analyzing HASH... Secure hash generated. HASH collision avoided.",
        "solution": "hash",
        "flags": "gi",
        "hint": "Match the word 'hash' with the gi flags."
      }
    ],
    "ects": 1,
    "section": "core",
    "technicalSummary": "Literal Pattern Matching & Search Modifiers (g, i). Searches for exact, verbatim character sequences without wildcards, applying global iteration and case-insensitivity.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> ENGINE ARCHITECTURE: EXACT STRING SCANNING\n        </h4>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          Under the hood, when JavaScript compiles a literal regular expression without meta-characters (like <code>/proxy/gi</code>), the V8 engine (Irregexp) can optimize the search using specialized Boyer-Moore-Horspool or SIMD vector algorithms rather than spinning up full state transitions.\n        </p>\n        <ul style=\"color:var(--text2);padding-left:20px;margin-bottom:10px;line-height:1.7;\">\n          <li><strong>The Global Flag (<code>g</code>):</strong> Keeps track of the internal <code>lastIndex</code> pointer on the RegExp instance. Each consecutive <code>exec()</code> call starts matching at <code>lastIndex</code> rather than index 0.</li>\n          <li><strong>Case Insensitivity (<code>i</code>):</strong> Folds uppercase and lowercase Unicode characters into common canonical cases before byte comparison.</li>\n        </ul>\n        <div style=\"background:rgba(0,229,255,0.05);border-left:3px solid var(--accent);padding:8px 12px;font-size:12px;color:var(--text3);\">\n          <strong>Performance Note:</strong> Literal string searching with regex is fast, but if you don't need wildcards or regex features, native <code>String.prototype.includes()</code> or <code>indexOf()</code> is even faster.\n        </div>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Find all occurrences of the system daemon name <code class=\"target-token\">daemon</code> regardless of casing.",
        "text": "The Daemon was initialized. Another daemon restarted. Kill DAEMON process now.",
        "solution": "daemon",
        "flags": "gi",
        "hint": "Search for 'daemon' with both 'g' and 'i' flags enabled."
      }
    ]
  },
  {
    "id": 1,
    "title": "Subnet Scanning",
    "difficulty": "beginner",
    "icon": "shield",
    "intro": "Mainframe nodes are segmented into subnets. Character classes let you scan a single slot for a set of permitted values. Use brackets to isolate targets like port digits, cipher letters, or network vectors.",
    "concepts": [
      {
        "key": "[abc]",
        "desc": "Character set — match any single character: a, b, or c"
      },
      {
        "key": "[a-z]",
        "desc": "Range — match any lowercase letter in range"
      },
      {
        "key": "[^abc]",
        "desc": "Negate class — match any character EXCEPT a, b, or c"
      },
      {
        "key": "[0-9]",
        "desc": "Match any single digit in the grid sector"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nSquare brackets <code style=\"color:var(--accent)\">[ ]</code> isolate character pools. The deck will match precisely <strong style=\"color:var(--text)\">one character</strong> from the pool.\n</p>\n<p style=\"color:var(--text2);line-height:1.8;\">\nInside pools, ranges are denoted by <code style=\"color:var(--accent)\">-</code> (e.g. <code style=\"color:var(--accent)\">0-9</code> for digits, <code style=\"color:var(--accent)\">a-f</code> for hex values). Inserting <code style=\"color:var(--accent)\">^</code> at the start negates the pool, targeting anything else.\n</p>",
    "examples": [
      {
        "pattern": "[aeiou]",
        "flags": "g",
        "text": "infiltrating deck",
        "desc": "Isolate lowercase vowels in access string."
      },
      {
        "pattern": "[^a-zA-Z ]",
        "flags": "g",
        "text": "Net_Node#99: bypass!",
        "desc": "Target non-alphabetic system characters."
      },
      {
        "pattern": "[0-9a-fA-F]",
        "flags": "g",
        "text": "Access Key: 0x9F3C",
        "desc": "Select hexadecimal character digits."
      }
    ],
    "exercises": [
      {
        "task": "Write a pattern that matches only the <code class=\"target-token\">digits</code> in the sector IP sequence .",
        "text": "Uplink: +48 (123) 456-789",
        "solution": "[0-9]",
        "altSolutions": [
          "\\d"
        ],
        "flags": "g",
        "hint": "Use character class [0-9] or the digit shorthand \\d."
      },
      {
        "task": "Match only the letters <code class=\"target-token\">x, y, or z</code> (case-sensitive) in the decryption stream .",
        "text": "matrix, proxy, system, x-axis, zone",
        "solution": "[xyz]",
        "flags": "g",
        "hint": "Specify the character set: [xyz]."
      },
      {
        "task": "Match any character <code class=\"target-token\">except lowercase vowels</code> (a, e, i, o, u) in the cipher code .",
        "text": "cyber deck",
        "solution": "[^aeiou]",
        "flags": "g",
        "hint": "Use negation in the character set: [^aeiou]."
      },
      {
        "task": "Match letters <code class=\"target-token\">a, b, or c</code> (case-insensitive, all occurrences) from the target list .",
        "text": "Access Terminal A, Backup database B, Cluster C.",
        "solution": "[abc]",
        "flags": "gi",
        "hint": "Use class [abc] and enable the i flag."
      }
    ],
    "ects": 2,
    "section": "core",
    "technicalSummary": "Character Classes & Inversion ([abc], [^abc], [0-9]). Matches exactly one character from a custom defined set or range, or negates the set with the caret operator.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> ENGINE ARCHITECTURE: BITSETS & BYTE LOOKUP TABLES\n        </h4>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          Inside the regex engine, a bracketed character class like <code>[0-9a-fA-F]</code> is compiled into a 256-bit bitset (lookup table) for ASCII code points. Testing whether a character matches is an <strong>O(1)</strong> bitwise operation:\n        </p>\n        <pre style=\"background:rgba(0,0,0,0.4);border:1px solid var(--border);padding:8px 12px;border-radius:6px;font-family:'JetBrains Mono',monospace;color:var(--accent);font-size:12px;margin-bottom:10px;\">is_match = (bitset[char_code >> 3] & (1 << (char_code & 7))) !== 0;</pre>\n        <p style=\"color:var(--text2);line-height:1.7;\">\n          Negation with <code>^</code> inside brackets simply inverts the bitmask check. Note that <code>^</code> only negates if it is the <em>very first character</em> inside the brackets.\n        </p>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Match any alphanumeric ASCII character that is <code class=\"target-token\">NOT a number or vowel</code> (consonants only).",
        "text": "a b c d e 1 2 3 f g h 9",
        "solution": "[^0-9aeiou ]",
        "flags": "g",
        "hint": "Use negation [^0-9aeiou ] to exclude digits, lowercase vowels, and spaces."
      }
    ]
  },
  {
    "id": 2,
    "title": "Mainframe Shorthands",
    "difficulty": "beginner",
    "icon": "cpu",
    "intro": "In high-speed breaches, writing full character sets is too slow. Shorthand character classes provide ready-made macros to target digits, word characters, or blank spaces instantly.",
    "concepts": [
      {
        "key": "\\d",
        "desc": "Target digits [0-9]"
      },
      {
        "key": "\\D",
        "desc": "Target non-digits"
      },
      {
        "key": "\\w",
        "desc": "Target alphanumeric characters & underscore"
      },
      {
        "key": "\\W",
        "desc": "Target non-word characters (symbols, operators)"
      },
      {
        "key": "\\s",
        "desc": "Target whitespace buffer spacing"
      },
      {
        "key": "\\S",
        "desc": "Target non-whitespace values"
      },
      {
        "key": ".",
        "desc": "Wildcard — match any single byte except newline"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nShorthands use backslashes. Remember the rule: <strong style=\"color:var(--text)\">lowercase is inclusive</strong>, and <strong style=\"color:var(--text)\">uppercase is exclusive (negation)</strong>.\n</p>\n<p style=\"color:var(--text2);line-height:1.8;\">\nThe dot <code style=\"color:var(--accent)\">.</code> matches any character except a newline. If you need to verify a literal dot in a hostname, escape it: <code style=\"color:var(--accent)\">\\.</code>\n</p>",
    "examples": [
      {
        "pattern": "\\d+",
        "flags": "g",
        "text": "ID: 9482, secret: 2901",
        "desc": "Matches sequences of digits."
      },
      {
        "pattern": "\\w+",
        "flags": "g",
        "text": "net_id-99 dev_host",
        "desc": "Matches word characters (ignores hyphens)."
      },
      {
        "pattern": "\\S+",
        "flags": "g",
        "text": "Secure-Key: $99.99!",
        "desc": "Matches non-whitespace character clusters."
      }
    ],
    "exercises": [
      {
        "task": "Extract the <code class=\"target-token\">node code</code> in the format XX-XXX using \\d and a literal hyphen .",
        "text": "Node code: 30-059, Sector 2",
        "solution": "\\d{2}-\\d{3}",
        "altSolutions": [
          "[0-9]{2}-[0-9]{3}"
        ],
        "flags": "g",
        "hint": "Combine two digits, a hyphen, and three digits: \\d{2}-\\d{3}."
      },
      {
        "task": "Find all <code class=\"target-token\">whitespace characters</code> (spaces, tabs, newlines) in the packet buffer .",
        "text": "Grid\tNode\nActive\tBypass.",
        "solution": "\\s",
        "flags": "g",
        "hint": "Use the whitespace shorthand: \\s."
      },
      {
        "task": "Match the sequence 'a', <code class=\"target-token\">any character</code>, then 'b' in the decrypted key .",
        "text": "axb, a-b, a.b, ab, a b, abb, acb",
        "solution": "a.b",
        "flags": "g",
        "hint": "Use the wildcard dot: a.b"
      },
      {
        "task": "Match any character that is <code class=\"target-token\">NOT a word character</code> in the password payload .",
        "text": "root_user: admin@10.0.0.1!",
        "solution": "\\W",
        "flags": "g",
        "hint": "Use the uppercase negation shorthand: \\W."
      }
    ],
    "ects": 2,
    "section": "core",
    "technicalSummary": "Shorthand Character Classes (\\d, \\w, \\s). Built-in escape tokens representing common character sets: digits, word characters (alphanumeric + underscore), and whitespace.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> UNICODE VS ASCII SHORTHAND PITFALLS\n        </h4>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          By default in JavaScript, <code>\\w</code> matches only ASCII characters: <code>[a-zA-Z0-9_]</code>. It will <strong>fail</strong> on accented characters (like <code>ą, ć, ü, é</code>) or Cyrillic letters:\n        </p>\n        <ul style=\"color:var(--text2);padding-left:20px;margin-bottom:10px;line-height:1.7;\">\n          <li>Without the <code>u</code> flag: <code>\\w</code> is strictly 63 ASCII characters.</li>\n          <li>With the <code>u</code> flag and Unicode property escapes: Use <code>[\\p{L}\\p{N}_]</code> to match internationalized word characters correctly.</li>\n          <li><code>\\s</code> matches standard ASCII space, tab (<code>\\t</code>), linefeed (<code>\\n</code>), carriage return (<code>\\r</code>), as well as Unicode non-breaking spaces.</li>\n        </ul>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Match all non-whitespace tokens that start with an underscore followed by word characters <code class=\"target-token\">_\\w+</code> in the signal log.",
        "text": "const _secret = 1; let var2 = 2; function _init() {}",
        "solution": "_\\w+",
        "flags": "g",
        "hint": "Target an underscore followed by one or more word characters: _\\w+."
      }
    ]
  },
  {
    "id": 3,
    "title": "Data Streams",
    "difficulty": "intermediate",
    "icon": "repeat",
    "intro": "Mainframe transmissions vary in length. Quantifiers allow you to specify repeating patterns, matching precise data structures like hex hashes, phone lines, or code tags.",
    "concepts": [
      {
        "key": "*",
        "desc": "Match 0 or more occurrences (greedy)"
      },
      {
        "key": "+",
        "desc": "Match 1 or more occurrences (greedy)"
      },
      {
        "key": "?",
        "desc": "Match 0 or 1 occurrence (optional)"
      },
      {
        "key": "{n}",
        "desc": "Match exactly n occurrences"
      },
      {
        "key": "{n,m}",
        "desc": "Match between n and m occurrences"
      },
      {
        "key": "{n,}",
        "desc": "Match at least n occurrences"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nQuantifiers are <strong style=\"color:var(--accent)\">greedy</strong> by default, consuming as much text as possible.\n</p>\n<p style=\"color:var(--text2);line-height:1.8;\">\nAdding <code style=\"color:var(--accent)\">?</code> after a quantifier (e.g. <code style=\"color:var(--accent)\">+?</code>, <code style=\"color:var(--accent)\">*?</code>) toggles it to <strong style=\"color:var(--green)\">lazy</strong> mode, making it stop at the first valid closing character.\n</p>",
    "examples": [
      {
        "pattern": "\\d{3}-\\d{3}-\\d{3}",
        "flags": "g",
        "text": "Comm link: 501-202-303",
        "desc": "Matches 3 groups of 3 digits separated by hyphens."
      },
      {
        "pattern": "hacke?r",
        "flags": "g",
        "text": "Class: hacker, Class: hackr",
        "desc": "Matches both spellings by making the 'e' optional."
      },
      {
        "pattern": "\\b\\d{4,}\\b",
        "flags": "g",
        "text": "Code: 99, Node: 2026, Cluster: 123456",
        "desc": "Matches numbers that are at least 4 digits long."
      }
    ],
    "exercises": [
      {
        "task": "Match all <code class=\"target-token\">HTML/XML tags</code> in the node response using a lazy quantifier .",
        "text": "<h1>Terminal</h1> <p class=\"code\">Status <b>online</b>!</p>",
        "solution": "<.+?>",
        "flags": "g",
        "hint": "Target tags with <.+?>, which matches characters lazily between angle brackets."
      },
      {
        "task": "Match the terms <code class=\"target-token\">link</code> and <code class=\"target-token\">links</code> (where 's' is optional).",
        "text": "Active link. Verify all links.",
        "solution": "links?",
        "flags": "g",
        "hint": "Make 's' optional with ?: links?"
      },
      {
        "task": "Find all words that contain <code class=\"target-token\">3 to 5 letters</code>.",
        "text": "The grid host runs fast logs.",
        "solution": "\\b\\w{3,5}\\b",
        "flags": "g",
        "hint": "Use word boundaries \\b and the range quantifier: \\b\\w{3,5}\\b."
      },
      {
        "task": "Find digit sequences that are <code class=\"target-token\">exactly 4 digits long</code>.",
        "text": "Years: 1999, 2020, 2026 and levels 12, 104, 88888.",
        "solution": "\\b\\d{4}\\b",
        "flags": "g",
        "hint": "Match exactly 4 digits: \\b\\d{4}\\b."
      }
    ],
    "ects": 2,
    "section": "core",
    "technicalSummary": "Quantifiers (*, +, ?, {n,m}) & Greediness. Specifies how many times an entity can repeat. Greedy quantifiers consume as much as possible; lazy quantifiers consume as little as possible.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> GREEDY VS LAZY (NON-GREEDY) EXECUTION MECHANICS\n        </h4>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          Regular expression engines are greedy by default. When matching <code>&lt;.*&gt;</code> against <code>&lt;div&gt;hello&lt;/div&gt;</code>, the dot matches the entire rest of the line first, then backtracks backward until it finds the last <code>&gt;</code>.\n        </p>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          Adding a question mark <code>?</code> turns a quantifier lazy (e.g. <code>*?</code> or <code>+?</code>). The engine tests the following token after consuming each individual character, stopping at the earliest possible match boundary.\n        </p>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Use lazy quantification to capture everything inside square brackets <code class=\"target-token\">\\[.*?\\]</code> individually.",
        "text": "[Node1] connected to [Node2] via [Proxy9]",
        "solution": "\\[.*?\\]",
        "flags": "g",
        "hint": "Escape brackets \\[ and \\], and place lazy wildcard .*? in between."
      }
    ]
  },
  {
    "id": 4,
    "title": "Signal Boundaries",
    "difficulty": "intermediate",
    "icon": "anchor",
    "intro": "Firewalls filter patterns based on their position. Anchors don't match characters, but they lock the pattern location: starting at the line edge, or isolated within word borders.",
    "concepts": [
      {
        "key": "^",
        "desc": "Start of line anchor (with multiline flag m)"
      },
      {
        "key": "$",
        "desc": "End of line anchor (with multiline flag m)"
      },
      {
        "key": "\\b",
        "desc": "Word boundary anchor"
      },
      {
        "key": "\\B",
        "desc": "Non-word boundary anchor"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\n<code style=\"color:var(--accent)\">\\b</code> ensures you match a full token rather than a substring. It matches the border where alphanumeric characters meet symbols or spaces.\n</p>\n<p style=\"color:var(--text2);line-height:1.8;\">\nWith the multiline flag <code style=\"color:var(--accent)\">m</code>, the anchors <code style=\"color:var(--accent)\">^</code> and <code style=\"color:var(--accent)\">$</code> check the boundaries of every line in the console stack.\n</p>",
    "examples": [
      {
        "pattern": "\\bnet\\b",
        "flags": "g",
        "text": "Connect to net. Internet gateway. Network active.",
        "desc": "Matches 'net' but not 'internet' or 'network'."
      },
      {
        "pattern": "^\\d+",
        "flags": "gm",
        "text": "1. Login\n2. Bypass\n  3. Secure",
        "desc": "Matches digits at the beginning of each line."
      },
      {
        "pattern": "\\b\\w+ing\\b",
        "flags": "g",
        "text": "Hacking and tracing are starting.",
        "desc": "Matches words ending in 'ing' at word boundaries."
      }
    ],
    "exercises": [
      {
        "task": "Match lines that <code class=\"target-token\">start with 'ERROR'</code>. Use anchors ^ and $ with the multiline flag .",
        "text": "INFO: System OK\nERROR: Connection failed\nINFO: Retry 1\nERROR: Timeout occurred\nDEBUG: Port open",
        "solution": "^ERROR.*$",
        "flags": "gm",
        "hint": "^ERROR matches the start of the line. .* matches the rest of the line, and $ asserts the end of line."
      },
      {
        "task": "Match words that <code class=\"target-token\">end in 'ly'</code>. Use the word boundary anchor \\b .",
        "text": "She quickly ran to the highly advanced laboratory.",
        "solution": "\\b\\w+ly\\b",
        "flags": "g",
        "hint": "Start with \\b, match letters with \\w+, end with 'ly', and add another \\b."
      },
      {
        "task": "Match a <code class=\"target-token\">number</code> only when it is located at the very end of a line .",
        "text": "Version 10\nStatus 200\nCode 404\nPort 8080",
        "solution": "\\d+$",
        "flags": "gm",
        "hint": "Use \\d+ followed by the end anchor $, with the multiline flag m active."
      },
      {
        "task": "Match the word <code class=\"target-token\">import</code>, but only when it appears at the start of a line .",
        "text": "import sys\nlocal import\nimport os",
        "solution": "^import",
        "flags": "gm",
        "hint": "Use the start anchor ^ followed immediately by the word 'import'."
      }
    ],
    "ects": 2,
    "section": "core",
    "technicalSummary": "Anchors & Boundaries (^, $, \\b, \\B). Zero-width assertions that verify positions rather than consuming characters: start/end of line or transitions between word characters.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> ZERO-WIDTH POSITION ASSERTIONS\n        </h4>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          Anchors consume <strong>0 bytes</strong> of the input stream. They merely execute a conditional truth-check on the current character index:\n        </p>\n        <ul style=\"color:var(--text2);padding-left:20px;margin-bottom:10px;line-height:1.7;\">\n          <li><code>^</code> checks if <code>currentIndex === 0</code> (or directly following a newline <code>\\n</code> when the <code>m</code> flag is active).</li>\n          <li><code>\\b</code> tests whether the adjacent characters represent a boundary between a word character (<code>\\w</code>) and a non-word character (<code>\\W</code>) or string edge.</li>\n        </ul>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Match the word <code class=\"target-token\">grid</code> only when it appears at the exact end of a line with the multiline flag.",
        "text": "access grid\ngrid status offline\nconnected to grid",
        "solution": "grid$",
        "flags": "gm",
        "hint": "Place $ after grid and use flags 'gm'."
      }
    ]
  },
  {
    "id": 5,
    "title": "Routing & Multiplexing",
    "difficulty": "intermediate",
    "icon": "git-branch",
    "intro": "Mainframe lines contain multiplexed routing paths. Capturing groups let you extract target arguments, and alternation acts as a logical OR to scan multiple network protocols.",
    "concepts": [
      {
        "key": "(abc)",
        "desc": "Capturing group — extract and save arguments"
      },
      {
        "key": "(?:abc)",
        "desc": "Non-capturing group — group without index overhead"
      },
      {
        "key": "a|b",
        "desc": "Alternation — OR operator matching path a or b"
      },
      {
        "key": "\\1",
        "desc": "Backreference — match the exact string caught in group 1"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nUse parenthesis <code style=\"color:var(--accent)\">()</code> to group tokens. The matches are stored in numeric indices, allowing backreferences like <code style=\"color:var(--accent)\">\\1</code> to ensure repetition matches.\n</p>\n<p style=\"color:var(--text2);line-height:1.8;\">\nAlternation <code style=\"color:var(--accent)\">|</code> acts as a choice path. In complex pipelines, use non-capturing groups <code style=\"color:var(--accent)\">(?:...)</code> to group choices cleanly.\n</p>",
    "examples": [
      {
        "pattern": "(\\w+)\\s\\1",
        "flags": "g",
        "text": "bypass bypass terminal. code code loop.",
        "desc": "Matches duplicate words."
      },
      {
        "pattern": "(http|https|ftp)://",
        "flags": "g",
        "text": "http://host, https://node, ftp://data",
        "desc": "Matches network protocols."
      },
      {
        "pattern": "(?:level)?\\d{3}",
        "flags": "g",
        "text": "level104, 404, level200",
        "desc": "Matches levels optionally without capturing tag."
      }
    ],
    "exercises": [
      {
        "task": "Extract the <code class=\"target-token\">protocol and host</code> from these URL links as two capturing groups .",
        "text": "Go to http://google.com or https://github.com or ftp://ftp.mirror.org",
        "solution": "(https?|ftp):\\/\\/([\\w.-]+)",
        "flags": "g",
        "hint": "Capture the protocol (https?|ftp) as group 1, then match ://, and capture the host ([\\w.-]+) as group 2."
      },
      {
        "task": "Match dates in the format <code class=\"target-token\">DD.MM .YYYY</code> or <code class=\"target-token\">DD/MM/YYYY</code>, ensuring both separators are identical .",
        "text": "Today is 09.06.2026. Yesterday was 08/06/2026. Invalid date: 09/06.2026",
        "solution": "(\\d{2})([./])(\\d{2})\\2(\\d{4})",
        "flags": "g",
        "hint": "Capture the separator ([./]) as group 2, and use \\2 as a backreference for the second separator."
      },
      {
        "task": "Match log filenames ending in <code class=\"target-token\">.log, .txt, or .ini</code> using a non-capturing group .",
        "text": "app.log, readme.txt, config.ini, script.py, database.db",
        "solution": "\\w+\\.(?:log|txt|ini)",
        "flags": "g",
        "hint": "Use \\w+\\. followed by a non-capturing group containing the extensions separated by pipe characters: (?:log|txt|ini)."
      },
      {
        "task": "Match the words <code class=\"target-token\">GET</code> or <code class=\"target-token\">POST</code> followed by a space and a path .",
        "text": "GET /index.html, POST /submit, PUT /delete",
        "solution": "(?:GET|POST)\\s\\/[\\w.-]+",
        "flags": "g",
        "hint": "Group (GET|POST) as a non-capturing group, followed by \\s and a path matching \\/[\\w.-]+."
      }
    ],
    "ects": 3,
    "section": "core",
    "technicalSummary": "Alternation (|) & Capturing Groups ((...)). Enables logical OR branching between sub-expressions and isolates matched substrings into indexed memory registers.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> NFA BRANCH EVALUATION & CAPTURE OVERHEAD\n        </h4>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          Alternation evaluates branches from <strong>left to right</strong>. In <code>cat|category</code>, the engine matches <code>cat</code> first and satisfies the pattern; it will not evaluate <code>category</code> unless forced by later tokens.\n        </p>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          Capturing groups allocate memory slots for slice indices. If you only need grouping for operator precedence (e.g. repetition or alternation), always use <strong>non-capturing groups</strong> <code>(?:...)</code> to avoid allocation overhead.\n        </p>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Use non-capturing group alternation <code class=\"target-token\">(?:tcp|udp|ssl)</code> to match protocol names followed by a port number.",
        "text": "Service tcp:80, service udp:53, service ssl:443",
        "solution": "(?:tcp|udp|ssl):\\d+",
        "flags": "g",
        "hint": "Combine (?:tcp|udp|ssl) with :\\d+."
      }
    ]
  },
  {
    "id": 6,
    "title": "Lookaround Scans",
    "difficulty": "advanced",
    "icon": "eye",
    "intro": "Firewall scanning tools probe nodes without modifying them. Lookarounds are zero-width checks: they scan ahead or behind to verify access conditions without consuming string index bytes.",
    "concepts": [
      {
        "key": "(?=abc)",
        "desc": "Positive lookahead — verify pattern follows"
      },
      {
        "key": "(?!abc)",
        "desc": "Negative lookahead — verify pattern does not follow"
      },
      {
        "key": "(?<=abc)",
        "desc": "Positive lookbehind — verify pattern precedes"
      },
      {
        "key": "(?<!abc)",
        "desc": "Negative lookbehind — verify pattern does not precede"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nLookarounds perform scans without advancing the engine pointer. They return a true/false condition check.\n</p>\n<p style=\"color:var(--text2);line-height:1.8;\">\nFor example, <code style=\"color:var(--accent)\">\\d+(?=ms)</code> matches latency digits followed by \"ms\" but does not match \"ms\" itself, allowing clean numerical extraction.\n</p>",
    "examples": [
      {
        "pattern": "\\d+(?=db)",
        "flags": "g",
        "text": "cluster: 10db, node: 5db, power: 12",
        "desc": "Matches numbers followed by 'db'."
      },
      {
        "pattern": "(?<=\\$)\\d+",
        "flags": "g",
        "text": "$100, $200, 30eur",
        "desc": "Matches values preceded by a dollar sign."
      }
    ],
    "exercises": [
      {
        "task": "Use <code class=\"target-token\">lookbehind</code> to extract only the port number (without the preceding colon ':') from the service list .",
        "text": "web: :80, secure: :443, database: :5432, proxy: :8080",
        "solution": "(?<=:)\\d+",
        "flags": "g",
        "hint": "Use positive lookbehind (?<=:) followed by \\d+ to match the port digits."
      },
      {
        "task": "Match numbers that are immediately followed by the unit <code class=\"target-token\">ms</code> (but do not include 'ms' in the match).",
        "text": "delay: 150ms, timeout: 5000ms, retry: 3",
        "solution": "\\d+(?=ms)",
        "flags": "g",
        "hint": "Match digits \\d+ followed by a positive lookahead (?=ms)."
      },
      {
        "task": "Find the word 'test' only when it is NOT followed by 'case'.",
        "text": "testcase, testsuite, unit test, testrun, test script",
        "solution": "test(?!case)",
        "flags": "g",
        "hint": "Use negative lookahead: test(?!case)."
      },
      {
        "task": "Match <code class=\"target-token\">integers</code> (standalone words) that are NOT preceded by a minus sign <code class=\"target-token\">-</code>.",
        "text": "Values: 45, -12, 100, -99, 5",
        "solution": "(?<!-)\\b\\d+\\b",
        "flags": "g",
        "hint": "Use negative lookbehind (?<!-) before the word-bounded digits \\b\\d+\\b."
      }
    ],
    "ects": 3,
    "section": "extended",
    "technicalSummary": "Lookaround Assertions ((?=...), (?!...), (?<=...), (?<!...)). Non-consuming zero-width assertions that look ahead or behind the current position to validate conditions without consuming text.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> LOOKAROUND TIME COMPLEXITY & HISTORICAL ROOTS\n        </h4>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          Lookahead <code>(?=...)</code> scans forward from the current position. If the sub-pattern succeeds, the engine resets its character cursor back to the starting point.\n        </p>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          Lookbehind <code>(?&lt;=...)</code> was introduced in ECMAScript 2018. The engine must scan backward in the stream. JavaScript supports variable-length lookbehinds (unlike Python's standard <code>re</code> module), but heavy lookbehinds can degrade matching performance on long strings.\n        </p>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Match numbers that are preceded by a dollar sign <code class=\"target-token\">$</code> using positive lookbehind.",
        "text": "Price: $450, code: 450, cost: $99.99",
        "solution": "(?<=\\$)\\d+(?:\\.\\d+)?",
        "flags": "g",
        "hint": "Use positive lookbehind (?<=\\$) followed by digits and optional decimals."
      }
    ]
  },
  {
    "id": 7,
    "title": "Named Registers",
    "difficulty": "advanced",
    "icon": "tag",
    "intro": "For complex exploits, index numbers are hard to track. Named groups let you assign handles to captured parameters, making it easy to parse packet headers, ports, and addresses.",
    "concepts": [
      {
        "key": "(?<name>...)",
        "desc": "Assign name handle to capturing group"
      },
      {
        "key": "\\k<name>",
        "desc": "Named backreference inside pattern"
      },
      {
        "key": "groups.name",
        "desc": "Extract via groups property object"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nInstead of referencing group indexes like match[1], named groups provide handles:\n</p>\n<div class=\"code-block\" style=\"padding:14px 16px;margin:12px 0;\">\n<span style=\"color:var(--text3);font-size:11px;\">JAVASCRIPT</span>\n<pre style=\"color:var(--text);font-size:13px;margin-top:8px;\">const re = /(?&lt;node&gt;\\w+)@(?&lt;subnet&gt;[\\w.-]+)/;\nconst m = \"admin@arasaka.com\".match(re);\nconsole.log(m.groups.node);   // \"admin\"\nconsole.log(m.groups.subnet); // \"arasaka.com\"</pre>\n</div>",
    "examples": [
      {
        "pattern": "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})",
        "flags": "g",
        "text": "Exploit date: 2026-06-09",
        "desc": "Extract date parameters as variables."
      },
      {
        "pattern": "<(?<tag>\\w+)>.*?</\\k<tag>>",
        "flags": "g",
        "text": "<b>bold</b>, <i>italic</i>",
        "desc": "Match tags using a named backreference."
      }
    ],
    "exercises": [
      {
        "task": "Write a pattern with <code class=\"target-token\">named groups</code> to parse an IP address, extracting the four octets into groups (a, b, c, d).",
        "text": "IP: 192.168.1.10, Gateway: 10.0.0.1",
        "solution": "(?<a>\\d{1,3})\\.(?<b>\\d{1,3})\\.(?<c>\\d{1,3})\\.(?<d>\\d{1,3})",
        "flags": "g",
        "hint": "Each octet group is (?<name>\\d{1,3}) separated by literal dots \\."
      },
      {
        "task": "Extract keys and values from configuration strings using named groups <code class=\"target-token\">key</code> and <code class=\"target-token\">value</code>.",
        "text": "max_connections=100\nport=3306\ndatabase=main",
        "solution": "(?<key>\\w+)=(?<value>\\w+)",
        "flags": "g",
        "hint": "Format is (?<key>\\w+)=(?<value>\\w+)."
      },
      {
        "task": "Define groups <code class=\"target-token\">last</code> and <code class=\"target-token\">first</code> to parse names in 'LastName FirstName' format .",
        "text": "Kowalski Jan, Smith John, Doe Jane",
        "solution": "(?<last>\\w+)\\s(?<first>\\w+)",
        "flags": "g",
        "hint": "Use (?<last>\\w+)\\s(?<first>\\w+)."
      },
      {
        "task": "Match duplicate adjacent words using a named group <code class=\"target-token\">word</code> and backreference \\k<word>.",
        "text": "the the code, compiling compiling fine, error error list",
        "solution": "(?<word>\\b\\w+)\\s+\\k<word>\\b",
        "flags": "g",
        "hint": "Use (?<word>\\b\\w+) followed by \\s+ and \\k<word>\\b."
      }
    ],
    "ects": 3,
    "section": "extended",
    "technicalSummary": "Backreferences (\\1, \\k<name>) & Group Registers. References values previously captured by earlier groups to enforce matching of identical duplicate tokens or symmetric structures.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> BACKREFERENCES & NON-REGULAR LANGUAGES\n        </h4>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          In formal language theory (Chomsky hierarchy), standard Regular Languages cannot match palindromes or arbitrary duplicated strings <code>{ w w | w ∈ Σ* }</code>.\n        </p>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          Adding backreferences elevates RegEx engines into the class of <strong>NP-complete</strong> matching systems! When an engine encounters <code>\\1</code>, it dynamically dereferences the memory buffer stored during the capture phase and attempts string comparison.\n        </p>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Match duplicate consecutive words separated by a space using backreferences <code class=\"target-token\">\\b(\\w+)\\s+\\1\\b</code> in the stream.",
        "text": "system system failure detected error in the the memory",
        "solution": "\\b(\\w+)\\s+\\1\\b",
        "flags": "gi",
        "hint": "Capture (\\w+) and refer back to it with \\1 after \\s+."
      }
    ]
  },
  {
    "id": 8,
    "title": "Operational Flags",
    "difficulty": "advanced",
    "icon": "flag",
    "intro": "Compiler flags dictate the global behavior of the regex engine. Tweak your deck flags to handle multi-line signal dumps, Unicode cipher characters, or group coordinate indices.",
    "concepts": [
      {
        "key": "g",
        "desc": "Global scan — search entire buffer for matches"
      },
      {
        "key": "i",
        "desc": "Ignore case — bypass capitalization rules"
      },
      {
        "key": "m",
        "desc": "Multiline — check anchors ^ and $ per line"
      },
      {
        "key": "s",
        "desc": "DotAll — allow dot to match newline bytes"
      },
      {
        "key": "u",
        "desc": "Unicode — full compliance with international symbols"
      },
      {
        "key": "d",
        "desc": "Indices — expose match positions"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nBy default, the dot wildcard <code style=\"color:var(--accent)\">.</code> stops at newline boundaries. Enabling the <code style=\"color:var(--accent)\">s</code> flag is required to scan multi-line signal logs.\n</p>\n<p style=\"color:var(--text2);line-height:1.8;\">\nThe <code style=\"color:var(--accent)\">u</code> flag enables Unicode property escapes like <code style=\"color:var(--accent)\">\\p{L}</code> (letters) and emoji structures.\n</p>",
    "examples": [
      {
        "pattern": "<div>.*?</div>",
        "flags": "gs",
        "text": "<div>data\ncode</div>",
        "desc": "Matches across line breaks."
      }
    ],
    "exercises": [
      {
        "task": "Use flag <code class=\"target-token\">m</code> to match the last word of each line in the text .",
        "text": "First line data\nSecond line code\nThird line output",
        "solution": "\\w+$",
        "flags": "gm",
        "hint": "Match \\w+ at the end of the line $ with the multiline flag active."
      },
      {
        "task": "Match the contents inside <code class=\"target-token\">&lt;code&gt;...&lt;/code&gt;</code> tags even when they span multiple lines . Use flag s .",
        "text": "<code>const a = 1;\nconst b = 2;</code> and <code>let c = 3;</code>",
        "solution": "<code>.*?<\\/code>",
        "flags": "gs",
        "hint": "Match <code>.*?</code> followed by </code>, ensuring dotAll flag s is enabled."
      },
      {
        "task": "Match all words containing international characters using Unicode property escape <code class=\"target-token\">\\p{L}</code>. Use flag u .",
        "text": "Zażółć gęślą jaźń. Hello World.",
        "solution": "\\p{L}+",
        "flags": "gu",
        "hint": "Enable the Unicode flag u and match letters with \\p{L}+."
      },
      {
        "task": "Match all <code class=\"target-token\">Emoji</code> characters using Unicode property escapes .",
        "text": "Coding is fun! 💻 Learn regex! 🚀 Enjoy!",
        "solution": "\\p{Emoji_Presentation}+",
        "flags": "gu",
        "hint": "Match emojis with \\p{Emoji_Presentation}+ and the gu flags."
      }
    ],
    "ects": 3,
    "section": "extended",
    "technicalSummary": "Modern Engine Flags (s, u, d, m). Modifies pattern compilation: multiline anchor routing (m), dotAll newlines (s), full Unicode handling (u), and match index exposure (d).",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> ECMASCRIPT MODERN FLAGS DEEP DIVE\n        </h4>\n        <ul style=\"color:var(--text2);padding-left:20px;margin-bottom:10px;line-height:1.7;\">\n          <li><strong><code>s</code> (dotAll):</strong> By default in JS, <code>.</code> matches all characters except <code>\\n</code>, <code>\\r</code>, <code>\\u2028</code>, and <code>\\u2029</code>. Flag <code>s</code> includes line breaks.</li>\n          <li><strong><code>u</code> (Unicode):</strong> Treats astral plane characters (surrogate pairs like Emojis <code>\\uD83D\\uDE80</code>) as single code points. Also enables <code>\\p{Property}</code>.</li>\n          <li><strong><code>d</code> (hasIndices):</strong> Attaches a <code>.indices</code> array to each match object with exact <code>[start, end]</code> character indices for every captured group.</li>\n        </ul>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Match multiline JSON blocks <code class=\"target-token\">\\{[\\s\\S]*?\\}</code> across line breaks using flag s.",
        "text": "{\n  \"status\": 200,\n  \"node\": \"cyber\"\n}",
        "solution": "\\{.*?\\}",
        "flags": "s",
        "hint": "With the 's' flag active, \\{.*?\\} matches across newline boundaries."
      }
    ]
  },
  {
    "id": 9,
    "title": "Buffer Overflows",
    "difficulty": "expert",
    "icon": "cpu",
    "intro": "Badly structured regular expressions can lead to ReDoS, locking your processor in a backtracking loop. You must optimize your patterns to prevent firewalls from lagging out your deck.",
    "concepts": [
      {
        "key": "Catastrophic Backtracking",
        "desc": "Infinite recursion on non-matching strings"
      },
      {
        "key": "Tempered Greedy Token",
        "desc": "Verify line content without backtracking"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nA nested loop pattern like <code style=\"color:var(--red)\">(a+)+b</code> forces the engine to try millions of path combinations on a mismatch, causing the CPU to hang.\n</p>\n<p style=\"color:var(--text2);line-height:1.8;\">\nOptimize by using negated character classes instead of open wildcards, and keep alternate paths completely distinct.\n</p>",
    "examples": [
      {
        "pattern": "(?=(\\w+))\\1(?=\\1)",
        "flags": "g",
        "text": "aa bb aaa bbbb",
        "desc": "Simulates atomic grouping in JS to lock matched tokens."
      },
      {
        "pattern": "^(?:(?!ICE_ERROR).)*$",
        "flags": "gm",
        "text": "SIGNAL: OK\nICE_ERROR: Breach\nNODE: Sync",
        "desc": "Matches lines that do not trigger the ICE_ERROR alarm."
      },
      {
        "pattern": "^[^/]+$",
        "flags": "g",
        "text": "net/proxy/stream vs netproxystream",
        "desc": "Using restricted negated character classes to prevent deep backtracking."
      }
    ],
    "exercises": [
      {
        "task": "Match C-style multi-line comments <code class=\"target-token\">/* ... */</code> safely so they do not contain */ inside them . Use a tempered greedy token .",
        "text": "/* valid comment */ code() /* second comment */ /* invalid */ code /* /* nested */ */",
        "solution": "\\/\\*(?:(?!\\*\\/).|\\n)*?\\*\\/",
        "flags": "gs",
        "hint": "Match /* followed by a non-capturing group asserting no */ exists, and close with */."
      },
      {
        "task": "Use a tempered greedy token to match double-quoted strings <code class=\"target-token\">\"...\"</code> that do not contain quotes or newlines .",
        "text": "Text: \"first string\" and \"second\ninvalid\" and \"third\"",
        "solution": "\"(?:(?![\"\\n]).)*?\"",
        "flags": "g",
        "hint": "Match \" followed by a tempered group blocking quotes/newlines, and end with \"."
      },
      {
        "task": "Match entire lines of logs that do NOT contain the word <code class=\"target-token\">SECRET</code>.",
        "text": "Line is public\nThis line has SECRET info\nAnother safe line\nSECRET message",
        "solution": "^(?:(?!SECRET).)*$",
        "flags": "gm",
        "hint": "Start with ^, use a tempered greedy token (?!SECRET). to match line contents, and end with $."
      },
      {
        "task": "Match entire lines of non-whitespace characters without nesting quantifiers to prevent backtracking .",
        "text": "word\nsome_text_key\nline with spaces\nlast_word",
        "solution": "^[^\\s]+$",
        "flags": "gm",
        "hint": "Avoid (\\w+)+ and use a single character class quantifier instead: ^[^\\s]+$."
      }
    ],
    "ects": 4,
    "section": "specialized",
    "technicalSummary": "Buffer Overflows & Catastrophic Backtracking (ReDoS). Identifying and neutralizing nested quantifiers and overlapping branches that trigger exponential execution time.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> EXPONENTIAL COMPLEXITY (O(2^n)) ANALYSIS\n        </h4>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          A classic ReDoS vulnerability occurs with nested multipliers such as <code>(a+)+$</code>. When given an input of 30 'a's followed by an exclamation mark:\n        </p>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          The engine partitions the 30 characters in <strong>2^29 = 536,870,912</strong> combinations before determining failure. On a typical 3GHz CPU, this takes over 30 seconds of 100% frozen CPU time.\n        </p>\n        <div style=\"background:rgba(255,77,77,0.06);border-left:3px solid var(--red);padding:8px 12px;font-size:12px;color:var(--text2);\">\n          <strong>The Golden Rule:</strong> Ensure alternate repetition branches are mutually exclusive. Never nest a quantifier inside another quantifier without restricted character sets.\n        </div>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Refactor the dangerous nested pattern <code class=\"target-token\">([a-z]+)+</code> into a linear safe pattern anchored to the entire string.",
        "text": "alphanumericstringonly",
        "solution": "^[a-z]+$",
        "flags": "g",
        "hint": "Replace the nested loop with a single character class quantifier: ^[a-z]+$."
      }
    ]
  },
  {
    "id": 10,
    "title": "Payload Injection",
    "difficulty": "expert",
    "icon": "replace",
    "intro": "Hacking is not just reading, it's modifying. By combining capturing groups with deck replacements, you can rewrite system logs, swap variable coordinates, and sanitize headers.",
    "concepts": [
      {
        "key": "str.replace(re, '$1')",
        "desc": "Substitute captured groups into output"
      },
      {
        "key": "Named Replacements",
        "desc": "Inject named parameters using $<name>"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nUse JS <code style=\"color:var(--accent)\">replace()</code> to swap or format captured data. Groups captured inside brackets can be referenced in the replacement payload using <code style=\"color:var(--accent)\">$1</code> or <code style=\"color:var(--accent)\">$&lt;name&gt;</code>.\n</p>",
    "examples": [
      {
        "pattern": "(\\d{4})-(\\d{2})-(\\d{2})",
        "flags": "g",
        "text": "2077-11-04",
        "desc": "Replaces timestamp coordinates using captured group backreferences."
      },
      {
        "pattern": "(\\b\\w)",
        "flags": "g",
        "text": "access granted bypass",
        "desc": "Targets word initial characters to inject uppercase authorization tags."
      },
      {
        "pattern": "(?<target>\\w+):(?<port>\\d+)",
        "flags": "g",
        "text": "mainframe:8080",
        "desc": "Matches named groups for payload injection."
      }
    ],
    "exercises": [
      {
        "task": "Capture phone numbers in various formats to normalize them . Ensure you capture three sets of three digits .",
        "text": "Phone: 123456789, 123-456-789, +48123456789, 48 123 456 789",
        "solution": "(?:\\+?48[\\s-]?)?(\\d{3})[\\s-]?(\\d{3})[\\s-]?(\\d{3})",
        "flags": "g",
        "hint": "Ignore optional +48/48 prefixes and spaces/hyphens, and capture three groups of \\d{3}."
      },
      {
        "task": "Capture first and last name as two groups, to swap them to 'LastName, FirstName'.",
        "text": "John Doe, Jane Smith, Alan Turing",
        "solution": "(\\w+)\\s(\\w+)",
        "flags": "g",
        "hint": "Capture the first word as group 1 and the second word as group 2."
      },
      {
        "task": "Capture the contents of Markdown bold syntax <code class=\"target-token\">**text**</code>.",
        "text": "This is **bold** text and **another bold** word.",
        "solution": "\\*\\*(.*?)\\*\\*",
        "flags": "g",
        "hint": "Escape the asterisks \\*\\* and capture content inside with a lazy quantifier (.*?)."
      },
      {
        "task": "Capture the domain name from URLs like <code class=\"target-token\">http://domain .com</code> (without protocol) for transformation .",
        "text": "http://test.com, https://site.org, http://sub.domain.net",
        "solution": "https?:\\/\\/([\\w.-]+)",
        "flags": "g",
        "hint": "Escape the slashes and place the domain character class [\\w.-]+ in a capturing group."
      }
    ],
    "ects": 3,
    "section": "extended",
    "technicalSummary": "Payload Injection & Dynamic String Replacement. Utilizing capture registers and callback replacers via String.prototype.replace() to transform input streams.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> ADVANCED REPLACEMENT TOKENS\n        </h4>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          In JavaScript <code>str.replace(pattern, replacement)</code>:\n        </p>\n        <ul style=\"color:var(--text2);padding-left:20px;margin-bottom:10px;line-height:1.7;\">\n          <li><code>$1, $2, ... $n</code>: Inserts the n-th capturing group string.</li>\n          <li><code>$&lt;name&gt;</code>: Inserts the named group value.</li>\n          <li><code>$&amp;</code>: Inserts the entire matched string.</li>\n          <li><code>$`</code> and <code>$'</code>: Inserts the text portion preceding or following the match.</li>\n        </ul>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Capture key-value pairs in config format <code class=\"target-token\">(\\w+)=(\\w+)</code> for dictionary extraction.",
        "text": "host=localhost port=8080 mode=production",
        "solution": "(\\w+)=(\\w+)",
        "flags": "g",
        "hint": "Place keys and values in two separate capturing groups: (\\w+)=(\\w+)."
      }
    ]
  },
  {
    "id": 11,
    "title": "Credential Scrypts",
    "difficulty": "expert",
    "icon": "wrench",
    "intro": "This level prepares you for field operations: auditing hex codes, validating passwords, verifying IPv4 subnets, and validating identity tokens.",
    "concepts": [
      {
        "key": "Validation",
        "desc": "Lock down inputs using start/end anchors"
      },
      {
        "key": "IPv4 Check",
        "desc": "Validating octet ranges between 0 and 255"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nInput validation requires strict anchoring with <code style=\"color:var(--accent)\">^</code> and <code style=\"color:var(--accent)\">$</code> to ensure malicious payloads aren't injected before or after valid segments.\n</p>",
    "examples": [
      {
        "pattern": "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}$",
        "flags": "i",
        "text": "netrunner@subgrid.net\ninvalid_auth@\noperator@corp.tech",
        "desc": "Validates incoming network communications email credentials."
      },
      {
        "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
        "flags": "",
        "text": "pass123\nCipherGate99\nALL_CAPS",
        "desc": "Audits passcode complexity: length >= 8, lower, upper, digit."
      },
      {
        "pattern": "^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)$",
        "flags": "g",
        "text": "10.0.0.1\n999.1.1.1",
        "desc": "Audits IPv4 octet ranges (0-255) for secure terminal routing."
      }
    ],
    "exercises": [
      {
        "task": "Write a pattern to validate a <code class=\"target-token\">Polish PESEL ID number</code> (11 digits, YYMMDD + 5 digits). Check month and day ranges .",
        "text": "44051401458\n00271401458\n123\nABCDEFGHIJK\n85103112345\n990101XXXXX",
        "solution": "^\\d{2}(?:0[1-9]|[1-2]\\d|3[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{5}$",
        "flags": "gm",
        "hint": "Verify PESEL structure: YY (MM 01-32) (DD 01-31) NNNNN. Shift month by +20 for years 2000+."
      },
      {
        "task": "Write a validation pattern for <code class=\"target-token\">HEX color codes</code> (e.g . #fff, #00AABB), supporting 3 or 6 hex digits .",
        "text": "#FFF\n#00e5ff\n#12345\n#ABCDEFG\n#FF00FF\ngreen",
        "solution": "^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$",
        "flags": "gm",
        "hint": "Anchor the pattern with ^ and $, and use alternation for 3 or 6 hex characters."
      },
      {
        "task": "Design a password validation pattern: <code class=\"target-token\">minimum 8 characters</code>, at least one uppercase letter, one lowercase letter, and one digit .",
        "text": "Password123\nweakpass\n12345678\nUPPERCASE1\nValidPass9",
        "solution": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
        "flags": "gm",
        "hint": "Use lookaheads (?=.*[a-z]), (?=.*[A-Z]), and (?=.*\\d), then assert length with .{8,}."
      },
      {
        "task": "Write a validation pattern for IPv4 addresses (four octets 0-255 separated by dots).",
        "text": "192.168.1.1\n255.255.255.255\n256.0.0.1\n99.99.99.99",
        "solution": "^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)$",
        "flags": "gm",
        "hint": "Use explicit bounds for 0-255: 25[0-5]|2[0-4]\\d|[01]?\\d?\\d for each octet."
      }
    ],
    "ects": 4,
    "section": "specialized",
    "technicalSummary": "Production Credential Scrypts & Validation Suites. Formulating bulletproof, fully-anchored validation patterns for emails, IPv4 addresses, passwords, and IDs.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> VALIDATION PITFALLS & THE NEED FOR FULL ANCHORING\n        </h4>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          The single most common bug in commercial web apps is validating input without <code>^</code> and <code>$</code>. If an email validation regex lacks <code>^</code> and <code>$</code>, an attacker can input <code>malicious_payload user@domain.com</code> and bypass the check.\n        </p>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Validate a strict 24-hour time format <code class=\"target-token\">HH:MM</code> (00:00 to 23:59) from start to end.",
        "text": "00:00\n23:59\n24:00\n12:60\n08:30",
        "solution": "^(?:[01]\\d|2[0-3]):[0-5]\\d$",
        "flags": "gm",
        "hint": "Hours are [01]\\d or 2[0-3], minutes are [0-5]\\d, anchored with ^ and $."
      }
    ]
  },
  {
    "id": 12,
    "title": "Sticky Tokens",
    "difficulty": "master",
    "icon": "zap",
    "intro": "The sticky flag (y) forces matching to start exactly at the current pointer offset, enabling the creation of lightning-fast code compilers and exploits.",
    "concepts": [
      {
        "key": "/pattern/y",
        "desc": "Sticky flag — matches only at the index of lastIndex"
      },
      {
        "key": "lastIndex",
        "desc": "Cursor index governing the start of the next match attempt"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nThe sticky flag <code style=\"color:var(--accent)\">y</code> allows you to parse strings incrementally. If the pattern does not match starting precisely at <code style=\"color:var(--accent)\">lastIndex</code>, it fails immediately rather than scanning forward.\n</p>",
    "examples": [
      {
        "pattern": "sys",
        "flags": "y",
        "text": "data sys",
        "desc": "Fails because sys does not begin at current stream index 0."
      },
      {
        "pattern": "\\d+",
        "flags": "y",
        "text": "2077 4096",
        "desc": "Matches 2077. Advancing lastIndex to 5 allows parsing 4096 next."
      },
      {
        "pattern": "[a-zA-Z_]\\w*",
        "flags": "y",
        "text": "neural_link = 1",
        "desc": "Parses programming token starting at the exact stream cursor."
      }
    ],
    "exercises": [
      {
        "task": "Match a sequence of exactly 3 digits <code class=\"target-token\">\\d{3}</code> at the current position using the sticky flag .",
        "text": "12345",
        "solution": "\\d{3}",
        "flags": "y",
        "hint": "Use the sticky flag y and the pattern \\d{3}."
      },
      {
        "task": "Match word identifiers (starting with a letter or underscore) using the sticky flag .",
        "text": "myVar_1 = 100",
        "solution": "[a-zA-Z_]\\w*",
        "flags": "y",
        "hint": "Enter [a-zA-Z_]\\w* with flag y."
      },
      {
        "task": "Extract a tag handle in format <code class=\"target-token\">@handle</code> starting exactly at index 0 using the sticky flag .",
        "text": "@admin @user",
        "solution": "@[a-zA-Z0-9]+",
        "flags": "y",
        "hint": "Pattern: @ followed by alphanumeric characters, using the sticky flag."
      },
      {
        "task": "Match the hex prefix <code class=\"target-token\">0x</code> followed by hex digits using the sticky flag .",
        "text": "0x7F4B",
        "solution": "0x[0-9a-fA-F]+",
        "flags": "y",
        "hint": "Write 0x and hex character class with + using flag y."
      }
    ],
    "ects": 4,
    "section": "specialized",
    "technicalSummary": "Sticky Flag (/y) & High-Speed Stream Lexing. Anchoring evaluation directly to RegExp.lastIndex to construct sub-millisecond compilers and stream parsers.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> BUILDING TOKENIZERS WITH THE STICKY FLAG\n        </h4>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          Normally, if a regex fails at index 0, it scans indices 1, 2, 3... until a match is found. The sticky flag <code>y</code> suppresses this search behavior: it matches <strong>only</strong> at <code>re.lastIndex</code>.\n        </p>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          This enables writing lexical analyzers that step through multi-megabyte source files in <strong>O(n)</strong> linear time without string slicing or substring allocations.\n        </p>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Match a semicolon token <code class=\"target-token\">;</code> at index 0 using the sticky flag.",
        "text": "; next_instruction()",
        "solution": ";",
        "flags": "y",
        "hint": "Match ';' using the sticky flag 'y'."
      }
    ]
  },
  {
    "id": 13,
    "title": "Quantum Gates",
    "difficulty": "master",
    "icon": "git-merge",
    "intro": "In complex environments, you must branch conditions dynamically. Combine lookarounds and alternations to construct logical IF-THEN-ELSE gates within your patterns.",
    "concepts": [
      {
        "key": "Gate Logic",
        "desc": "(?=cond)then|(!cond)else"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nEmulate conditional routing in Javascript:\n<code style=\"color:var(--accent)\">(?=condition)then_pattern|(?!condition)else_pattern</code>.\n</p>",
    "examples": [
      {
        "pattern": "^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$",
        "flags": "g",
        "text": "subdeck1\nRootDeck9",
        "desc": "Logical AND: requires at least one uppercase letter and one digit."
      },
      {
        "pattern": "(?=.*hack)(?=.*matrix)\\w+",
        "flags": "g",
        "text": "cyberhack, matrixcode, netrunner",
        "desc": "Asserts presence of multiple target keywords within stream."
      }
    ],
    "exercises": [
      {
        "task": "Match words that contain at least two digits <code class=\"target-token\">\\d</code> inside . Use a lookahead .",
        "text": "item1, it23em, i1t2e3m, apple, 12",
        "solution": "\\b(?=(?:.*\\d){2,})\\w+\\b",
        "flags": "g",
        "hint": "Use lookahead (?=(?:.*\\d){2,}) after the word boundary \\b."
      },
      {
        "task": "Match passwords of minimum 6 characters that <code class=\"target-token\">do NOT contain</code> the word 'password' (case-insensitive).",
        "text": "secret123\npassword99\nAdmin123\nPassWord!1",
        "solution": "^(?!.*password).{6,}$",
        "flags": "gim",
        "hint": "Use negative lookahead (?!.*password) at the line start, then match .{6,}$ with m flag."
      },
      {
        "task": "Match text inside parenthesis <code class=\"target-token\">(...)</code> only when there are no square brackets inside .",
        "text": "(simple text), (text [bad] inside), (another text), ([error] at start)",
        "solution": "\\([^[\\]]*?\\)",
        "flags": "g",
        "hint": "Pattern: \\( followed by any characters except square brackets [^[\\]]*? ending with \\)."
      },
      {
        "task": "Match an email address only if its domain is <code class=\"target-token\">wowk .ua</code> or <code class=\"target-token\">gmail .com</code>.",
        "text": "test@wowk.ua\nadmin@gmail.com\nuser@yahoo.com\nhello@wowk.ua",
        "solution": "^[\\w.-]+@(?:wowk\\.ua|gmail\\.com)$",
        "flags": "gm",
        "hint": "Use a non-capturing group with alternation (?:wowk\\.ua|gmail\\.com) at the end."
      }
    ],
    "ects": 5,
    "section": "specialized",
    "technicalSummary": "Quantum Gate Logic & Conditional Branching. Emulating logical IF-THEN-ELSE decision trees within pattern architectures using lookarounds and alternations.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> EMULATING CONDITIONALS IN JAVASCRIPT REGEXP\n        </h4>\n        <p style=\"color:var(--text2);margin-bottom:10px;\">\n          PCRE supports explicit conditional syntax: <code>(?(condition)then|else)</code>. JavaScript does not have native conditional syntax, but it can be mathematically modeled with zero-width lookaheads:\n        </p>\n        <pre style=\"background:rgba(0,0,0,0.4);border:1px solid var(--border);padding:8px 12px;border-radius:6px;font-family:'JetBrains Mono',monospace;color:var(--accent);font-size:12px;margin-bottom:10px;\">^(?:(?=condition)then_branch|(?!condition)else_branch)$</pre>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Match lines that contain both the keyword <code class=\"target-token\">node</code> and the keyword <code class=\"target-token\">sync</code> in any order.",
        "text": "node is in sync\nsync with node\nnode alone\nsync alone",
        "solution": "^(?=.*node)(?=.*sync).*$",
        "flags": "gm",
        "hint": "Use two positive lookaheads (?=.*node)(?=.*sync) followed by .*$."
      }
    ]
  },
  {
    "id": 14,
    "title": "Icebreaker Protocols",
    "difficulty": "master",
    "icon": "shield",
    "intro": "Congratulations, Netrunner. You have reached the core server. To safely extract the databases without triggering firewalls or locking up your CPU, perform a final audit on your quantifiers to block ReDoS vulnerabilities.",
    "concepts": [
      {
        "key": "ICE Protection",
        "desc": "Avoid overlapping quantifier branches to ensure deterministic execution paths"
      }
    ],
    "theory": "<p style=\"color:var(--text2);line-height:1.8;margin-bottom:16px;\">\nWriting safe regular expressions is a key netrunning skill. Overlapping quantifiers like <code style=\"color:var(--red)\">(\\w+\\s*)+</code> allow the firewall to slow down your code and trigger alarms.\n</p>",
    "examples": [
      {
        "pattern": "^a+$",
        "flags": "g",
        "text": "aaaaa",
        "desc": "Linear deterministic traversal without vulnerable nested quantifiers."
      },
      {
        "pattern": "^[^/]+$",
        "flags": "g",
        "text": "root/subgrid/kernel",
        "desc": "Bounded negated character classes prevent catastrophic backtracking in path traversal."
      }
    ],
    "exercises": [
      {
        "task": "Optimize the dangerous pattern <code class=\"target-token\">(a+)+</code> into a safe version while preserving its matching logic (matching a sequence of 'a's from start to end of line).",
        "text": "aaaaa\naaaaaa\naba",
        "solution": "^a+$",
        "flags": "gm",
        "hint": "Replace the nested quantifiers with a single quantifier: ^a+$."
      },
      {
        "task": "Optimize the slow pattern <code class=\"target-token\">.*(x|y).*</code> into a safe and efficient version to match lines containing 'x' or 'y'.",
        "text": "hello x world\nno match here\ncontains y",
        "solution": "^.*?[xy].*$",
        "flags": "gm",
        "hint": "Use lazy matching .*? at start, character class [xy] instead of alternation, ending with .*$."
      },
      {
        "task": "The pattern <code class=\"target-token\">^(\\w+\\s*)+$</code> is unsafe due to whitespace backtracking . Refactor it to match space-separated word sequences safely .",
        "text": "one two three\ntest\ninvalid!",
        "solution": "^\\w+(?:\\s+\\w+)*$",
        "flags": "gm",
        "hint": "A safe layout is: word, followed by an optional group containing spaces and another word."
      },
      {
        "task": "Rewrite the unsafe path validation pattern <code class=\"target-token\">^([^.]+\\.?)+$</code> (which matches dot-separated names) to be ReDoS-proof .",
        "text": "config.json\nindex.html\nmain.js\nplain_text",
        "solution": "^[^.]+(?:\\.[^.]+)*$",
        "flags": "gm",
        "hint": "Follow the same pattern as the word task: segment without dots, then an optional dot followed by more segments without dots."
      }
    ],
    "ects": 5,
    "section": "specialized",
    "technicalSummary": "Engine Hardening & Deterministic Icebreaker Protocols. Auditing quantifiers, eliminating ambiguity, and ensuring strictly linear matching performance under adversarial inputs.",
    "deepDive": "\n      <div class=\"deep-dive-box\">\n        <h4 style=\"color:var(--accent);font-family:'Orbitron',sans-serif;font-size:13px;margin-bottom:8px;letter-spacing:1px;\">\n          <i data-lucide=\"cpu\" style=\"width:14px;height:14px;display:inline-block;vertical-align:-2px;margin-right:6px;\"></i> DETERMINISTIC PATTERN AUDIT CHECKLIST\n        </h4>\n        <ul style=\"color:var(--text2);padding-left:20px;margin-bottom:10px;line-height:1.7;\">\n          <li><strong>Disjoint Character Classes:</strong> Adjacent repeating tokens must not share characters (e.g. <code>\\d+\\w+</code> can backtrack endlessly; <code>\\d+[^\\d\\s]+</code> is deterministic).</li>\n          <li><strong>Avoid Unbounded Wildcards with Anchors:</strong> <code>^.*payload.*$</code> scans to end-of-string and steps backward; <code>^.*?payload.*$</code> or targeted lookups minimize backtracking steps.</li>\n          <li><strong>Atomic Grouping Emulation:</strong> Use <code>(?=(pattern))\\1</code> to prevent the engine from discarding partial successful paths.</li>\n        </ul>\n      </div>\n    ",
    "extendedExercises": [
      {
        "task": "Deep Dive Task: Safely match HTML tags <code class=\"target-token\">&lt;[^&gt;]+&gt;</code> without wildcard backtracking.",
        "text": "<div class=\"box\"><span>text</span></div>",
        "solution": "<[^>]+>",
        "flags": "g",
        "hint": "Use a negated character class <[^>]+> instead of lazy wildcard <.*?>."
      }
    ]
  }
];
