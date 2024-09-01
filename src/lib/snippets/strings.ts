// src/lib/snippets/strings.ts

/**
 * String practice snippets & templates.
 *
 * These snippets are designed to be:
 * - Shown in a "Snippet Library" inside the playground
 * - Copied into the editor as templates
 * - Used as teaching material for common string patterns
 */

export type StringSnippetLanguage = "javascript" | "typescript";

export type StringSnippetCategory =
  | "fundamentals"
  | "validation"
  | "parsing"
  | "two-pointers"
  | "sliding-window"
  | "counting"
  | "palindrome"
  | "interview-pattern";

export type StringSnippetDifficulty = "beginner" | "intermediate" | "advanced";

export interface StringSnippet {
  id: string;
  title: string;
  summary: string;
  category: StringSnippetCategory;
  difficulty: StringSnippetDifficulty;
  language: StringSnippetLanguage;
  tags: string[];
  code: string;
  explanation: string;
  complexityHint?: string;
}

export const stringSnippetCategoryLabels: Record<StringSnippetCategory, string> =
  {
    fundamentals: "Fundamentals",
    validation: "Validation",
    parsing: "Parsing",
    "two-pointers": "Two Pointers",
    "sliding-window": "Sliding Window",
    counting: "Counting / Frequency",
    palindrome: "Palindromes",
    "interview-pattern": "Interview Patterns",
  };

export const stringSnippetDifficultyLabels: Record<
  StringSnippetDifficulty,
  string
> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/**
 * Core collection of string snippets.
 * Each entry is heavily commented so it can double as documentation.
 */
export const stringSnippets: StringSnippet[] = [
  {
    id: "string-reverse-basic",
    title: "Reverse a String (Manual Loop)",
    summary:
      "Reverse a string character-by-character without using built-in reverse helpers.",
    category: "fundamentals",
    difficulty: "beginner",
    language: "typescript",
    tags: ["reverse", "loop", "fundamentals"],
    code: `// Reverse a string manually without relying on array reverse().
// In JavaScript / TypeScript, strings are immutable, so we build a new one.

export function reverseString(input: string): string {
  // Early exit for very small strings.
  if (input.length <= 1) {
    return input;
  }

  let result = "";

  // Walk the string from the end towards the beginning.
  for (let i = input.length - 1; i >= 0; i--) {
    result += input[i];
  }

  return result;
}

// Example usage:
console.log(reverseString("hello")); // "olleh"
console.log(reverseString("a"));     // "a"`,
    explanation:
      "This snippet demonstrates basic string iteration and emphasises that strings are immutable in JavaScript/TypeScript. In interviews, you might additionally discuss complexity and memory behaviour.",
    complexityHint: "Time: O(n), Space: O(n)",
  },
  {
    id: "string-is-anagram-frequency",
    title: "Check if Two Strings Are Anagrams (Frequency Map)",
    summary:
      "Determine whether two strings are anagrams by comparing character frequencies.",
    category: "counting",
    difficulty: "intermediate",
    language: "typescript",
    tags: ["anagram", "frequency map", "hash map"],
    code: `// Return true if s and t are anagrams: they contain the same
// characters with the same multiplicities, possibly in a different order.
//
// This implementation is case-sensitive and considers all characters;
// in a real system you might want to normalise case and strip whitespace.

export function areAnagrams(s: string, t: string): boolean {
  if (s.length !== t.length) {
    return false;
  }

  const freq = new Map<string, number>();

  for (const ch of s) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }

  for (const ch of t) {
    const count = freq.get(ch);
    if (count === undefined) {
      // Character appears in t but not in s.
      return false;
    }
    if (count === 1) {
      freq.delete(ch);
    } else {
      freq.set(ch, count - 1);
    }
  }

  return freq.size === 0;
}

// Example usage:
console.log(areAnagrams("listen", "silent")); // true
console.log(areAnagrams("cat", "taco"));      // false`,
    explanation:
      "The key idea is to count how many times each character appears in the first string and then decrement those counts as we scan the second string. If we ever see a character that does not exist or the final map is not empty, the strings are not anagrams.",
    complexityHint: "Time: O(n), Space: O(k) for distinct characters",
  },
  {
    id: "string-first-unique-char",
    title: "First Non-Repeating Character",
    summary:
      "Find the index of the first character that appears exactly once in the string.",
    category: "counting",
    difficulty: "intermediate",
    language: "typescript",
    tags: ["frequency", "first unique", "map"],
    code: `// Return the index of the first non-repeating character in a string.
// If every character repeats at least once, return -1.

export function firstUniqueCharIndex(s: string): number {
  if (s.length === 0) {
    return -1;
  }

  const freq = new Map<string, number>();

  // First pass: frequency count.
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }

  // Second pass: locate the first index with frequency 1.
  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) {
      return i;
    }
  }

  return -1;
}

// Example usage:
console.log(firstUniqueCharIndex("leetcode")); // 0 ('l')
console.log(firstUniqueCharIndex("aabb"));     // -1`,
    explanation:
      "Many interview questions follow the same two-pass pattern: first compute frequencies, then scan again to pick the earliest (or smallest) index satisfying some property. Using a Map rather than a plain object avoids prototype pitfalls and works for any string content.",
    complexityHint: "Time: O(n), Space: O(k)",
  },
  {
    id: "string-palindrome-two-pointers",
    title: "Palindrome Check (Ignore Non-Alphanumeric)",
    summary:
      "Use two pointers to check if a string is a palindrome while ignoring punctuation and case.",
    category: "palindrome",
    difficulty: "intermediate",
    language: "typescript",
    tags: ["palindrome", "two pointers", "validation"],
    code: `// Determine whether a string is a palindrome when we ignore
// non-alphanumeric characters and treat uppercase and lowercase
// letters as equivalent.

function isAlphaNumeric(ch: string): boolean {
  if (ch.length !== 1) return false;
  const code = ch.charCodeAt(0);
  // '0'..'9'
  if (code >= 48 && code <= 57) return true;
  // 'A'..'Z'
  if (code >= 65 && code <= 90) return true;
  // 'a'..'z'
  if (code >= 97 && code <= 122) return true;
  return false;
}

export function isCleanPalindrome(input: string): boolean {
  let left = 0;
  let right = input.length - 1;

  while (left < right) {
    let leftChar = input[left];
    let rightChar = input[right];

    if (!isAlphaNumeric(leftChar)) {
      left++;
      continue;
    }
    if (!isAlphaNumeric(rightChar)) {
      right--;
      continue;
    }

    leftChar = leftChar.toLowerCase();
    rightChar = rightChar.toLowerCase();

    if (leftChar !== rightChar) {
      return false;
    }

    left++;
    right--;
  }

  return true;
}

// Example usage:
console.log(isCleanPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isCleanPalindrome("race a car"));                     // false`,
    explanation:
      "Rather than cleaning the string into a new buffer first, this version uses two pointers to walk towards the centre while skipping non-alphanumeric characters on the fly. This keeps memory usage small and makes the control flow explicit for visualisers.",
    complexityHint: "Time: O(n), Space: O(1)",
  },
  {
    id: "string-longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    summary:
      "Sliding-window pattern to find the length of the longest substring with all unique characters.",
    category: "sliding-window",
    difficulty: "advanced",
    language: "typescript",
    tags: ["sliding window", "hash map", "substring"],
    code: `// Compute the length of the longest substring of s that contains
// no repeated characters. This is a classic sliding-window problem.

export function lengthOfLongestUniqueSubstring(s: string): number {
  // Map from character → index of its most recent appearance.
  const lastSeen = new Map<string, number>();

  let windowStart = 0;
  let bestLength = 0;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const prevIndex = lastSeen.get(ch);

    // If we have seen this character inside the current window,
    // move the window start just past the previous occurrence.
    if (prevIndex !== undefined && prevIndex >= windowStart) {
      windowStart = prevIndex + 1;
    }

    lastSeen.set(ch, i);

    const windowLength = i - windowStart + 1;
    if (windowLength > bestLength) {
      bestLength = windowLength;
    }
  }

  return bestLength;
}

// Example usage:
console.log(lengthOfLongestUniqueSubstring("abcabcbb")); // 3 ("abc")
console.log(lengthOfLongestUniqueSubstring("bbbbb"));    // 1 ("b")
console.log(lengthOfLongestUniqueSubstring("pwwkew"));   // 3 ("wke")`,
    explanation:
      "The window [windowStart, i] always contains unique characters. When we see a duplicate that falls inside the current window we jump the start just past the previous index. This ensures each character is processed at most twice, giving linear time complexity.",
    complexityHint: "Time: O(n), Space: O(k)",
  },
  {
    id: "string-parse-int-safe",
    title: "Safe Integer Parsing with Validation",
    summary:
      "Convert a string to an integer with explicit validation and helpful error messages.",
    category: "parsing",
    difficulty: "intermediate",
    language: "typescript",
    tags: ["parsing", "validation", "number"],
    code: `// Parse an integer from a string and perform strict validation.
// Unlike Number() or parseInt(), this helper refuses malformed input.

export interface ParseIntResult {
  ok: boolean;
  value?: number;
  error?: string;
}

export function parseStrictInt(raw: string): ParseIntResult {
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return { ok: false, error: "Empty string is not a valid integer." };
  }

  // Optional leading sign.
  let index = 0;
  let sign = 1;

  if (trimmed[index] === "+") {
    index++;
  } else if (trimmed[index] === "-") {
    sign = -1;
    index++;
  }

  if (index >= trimmed.length) {
    return { ok: false, error: "String contains only a sign but no digits." };
  }

  let value = 0;
  const zeroCode = "0".charCodeAt(0);
  const nineCode = "9".charCodeAt(0);

  for (; index < trimmed.length; index++) {
    const ch = trimmed[index];
    const code = ch.charCodeAt(0);

    if (code < zeroCode || code > nineCode) {
      return {
        ok: false,
        error: \`Invalid digit '\${ch}' at position \${index}.\`,
      };
    }

    value = value * 10 + (code - zeroCode);
  }

  return { ok: true, value: sign * value };
}

// Example usage:
console.log(parseStrictInt("42"));       // { ok: true, value: 42 }
console.log(parseStrictInt("0042"));     // { ok: true, value: 42 }
console.log(parseStrictInt("4a2"));      // { ok: false, error: "Invalid digit 'a' ..." }`,
    explanation:
      "This helper walks through the string manually and implements a tiny finite-state machine: optional sign, then digits, and nothing else. It is a good example of low-level parsing that is easy for a visualiser to step through.",
    complexityHint: "Time: O(n), Space: O(1)",
  },
  {
    id: "string-validate-email-simple",
    title: "Simple E-mail Validation (Pattern-Based)",
    summary:
      "Perform a pragmatic e-mail validation using a conservative regular expression.",
    category: "validation",
    difficulty: "intermediate",
    language: "typescript",
    tags: ["validation", "regex", "email"],
    code: `// E-mail validation is notoriously tricky to get perfect according to
// the full RFC, but many applications only need a conservative check.
//
// This snippet uses a pragmatic regular expression that disallows many
// edge cases but works well for typical addresses.

const SIMPLE_EMAIL_REGEX =
  /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;

export function isPlausibleEmail(input: string): boolean {
  return SIMPLE_EMAIL_REGEX.test(input.trim());
}

// Example usage:
console.log(isPlausibleEmail("user@example.com"));  // true
console.log(isPlausibleEmail("not-an-email"));      // false
console.log(isPlausibleEmail("a@b"));               // false (no TLD)`,
    explanation:
      "Real e-mail validation is usually offloaded to backend libraries or confirmation flows. For many UIs it is enough to quickly reject obviously malformed inputs. This regex-based approach is intentionally conservative and easy to customise.",
    complexityHint: "Time: O(n) typically, depending on the regex engine",
  },
  {
    id: "string-two-pointer-compress-runs",
    title: "Run-Length Encoding (Basic Compression)",
    summary:
      "Compress runs of repeated characters using a simple run-length encoding scheme.",
    category: "two-pointers",
    difficulty: "intermediate",
    language: "typescript",
    tags: ["run-length encoding", "compression", "two pointers"],
    code: `// Implement a basic run-length encoding (RLE) for strings.
// Example: "aaabbc" → "a3b2c1".
// This is not a general-purpose compression algorithm but it is a
// handy interview exercise that combines counting with two pointers.

export function encodeRLE(input: string): string {
  if (input.length === 0) {
    return "";
  }

  let result = "";
  let runChar = input[0];
  let runLength = 1;

  for (let i = 1; i < input.length; i++) {
    const ch = input[i];
    if (ch === runChar) {
      runLength++;
    } else {
      result += runChar + String(runLength);
      runChar = ch;
      runLength = 1;
    }
  }

  // Flush final run.
  result += runChar + String(runLength);

  return result;
}

export function decodeRLE(encoded: string): string {
  let result = "";
  let i = 0;

  while (i < encoded.length) {
    const ch = encoded[i];
    i++;

    if (!ch) break;

    // Parse one or more digits representing the run length.
    let runLengthStr = "";

    while (i < encoded.length && encoded[i] >= "0" && encoded[i] <= "9") {
      runLengthStr += encoded[i];
      i++;
    }

    const runLength = Number(runLengthStr || "1");

    for (let j = 0; j < runLength; j++) {
      result += ch;
    }
  }

  return result;
}

// Example usage:
const original = "aaabbc";
const encoded = encodeRLE(original);
const decoded = decodeRLE(encoded);
console.log({ original, encoded, decoded });`,
    explanation:
      "Run-length encoding turns repeated characters into (character, count) pairs. It is not space-efficient for all inputs but provides a compact demonstration of grouping logic and parsing within the same snippet.",
    complexityHint:
      "Encoding: O(n) time / O(n) space, Decoding: O(m) time / O(m) space",
  },
  {
    id: "string-interview-atoi",
    title: "LeetCode-Style atoi (String to Integer)",
    summary:
      "Robust string-to-integer conversion mimicking the behaviour of C's atoi, including clamping.",
    category: "interview-pattern",
    difficulty: "advanced",
    language: "typescript",
    tags: ["atoi", "parsing", "overflow", "leetcode"],
    code: `// Parse an integer from a string following rules similar to
// LeetCode's "String to Integer (atoi)" problem.
// - Discards leading whitespace
// - Optional '+' or '-' sign
// - Reads digits until the first non-digit
// - Clamps to 32-bit signed integer range

const INT_MIN = -2147483648;
const INT_MAX = 2147483647;

export function stringToIntAtoi(raw: string): number {
  const s = raw.trimStart();

  if (s.length === 0) {
    return 0;
  }

  let index = 0;
  let sign = 1;

  if (s[index] === "+") {
    index++;
  } else if (s[index] === "-") {
    sign = -1;
    index++;
  }

  let value = 0;

  while (index < s.length) {
    const ch = s[index];
    if (ch < "0" || ch > "9") {
      break;
    }

    const digit = ch.charCodeAt(0) - "0".charCodeAt(0);

    // Check potential overflow before multiplying.
    if (value > Math.floor(INT_MAX / 10)) {
      return sign === 1 ? INT_MAX : INT_MIN;
    }
    if (value === Math.floor(INT_MAX / 10)) {
      if (sign === 1 && digit > INT_MAX % 10) {
        return INT_MAX;
      }
      if (sign === -1 && digit > (INT_MAX % 10) + 1) {
        return INT_MIN;
      }
    }

    value = value * 10 + digit;
    index++;
  }

  return sign * value;
}

// Example usage:
console.log(stringToIntAtoi("42"));                // 42
console.log(stringToIntAtoi("   -42"));            // -42
console.log(stringToIntAtoi("4193 with words"));   // 4193
console.log(stringToIntAtoi("91283472332"));       // 2147483647 (clamped)`,
    explanation:
      "This snippet captures many edge cases: whitespace, optional sign, early termination on non-digits, and overflow handling. It demonstrates how to reason about integer bounds before performing arithmetic that could overflow.",
    complexityHint: "Time: O(n), Space: O(1)",
  },
];

/**
 * Precomputed lookup from id → snippet for fast access.
 */
export const stringSnippetsById: Record<string, StringSnippet> = (() => {
  const map: Record<string, StringSnippet> = {};
  for (const snippet of stringSnippets) {
    map[snippet.id] = snippet;
  }
  return map;
})();

/**
 * Safe helper for retrieving a snippet by id.
 */
export function getStringSnippetById(
  id: string
): StringSnippet | undefined {
  return stringSnippetsById[id];
}
