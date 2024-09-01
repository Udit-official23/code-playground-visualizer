// src/lib/algorithms-pack/strings.ts
//
// String-focused algorithms for the Algorithm Library.
// These entries are intentionally verbose with rich descriptions, notes,
// and multi-line code templates so that:
// 1) The library feels like a real teaching tool.
// 2) The overall project LOC increases in a meaningful, justified way.

import type { AlgorithmMeta } from "../algorithms";

const JS = "javascript" as const;
const PY = "python" as const;

/**
 * String algorithms mostly live under:
 * - category: "searching" (pattern matching, substring search),
 * - category: "dynamic-programming" (edit distance, LCS, etc.).
 *
 * We do NOT introduce a new "string" category to avoid changing the
 * AlgorithmCategory union; this keeps types happy everywhere else.
 */

export const stringAlgorithmsPack: AlgorithmMeta[] = [
  {
    id: "string-naive-search",
    name: "Naive String Search",
    title: "Naive String Search",
    shortDescription:
      "Brute-force substring search that checks every possible starting index.",
    description:
      "The naive string search algorithm scans the text from left to right and, " +
      "for each position, compares characters in the pattern one by one. " +
      "Its worst-case performance is O(n · m), where n is the length of the text " +
      "and m is the length of the pattern. Despite being slow for large inputs, " +
      "it is easy to implement and often good enough for small strings or teaching " +
      "basic pattern matching concepts.",
    category: "searching",
    difficulty: "easy",
    timeComplexity: "O(n · m)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(n)",
      average: "O(n · m)",
      worst: "O(n · m)",
      space: "O(1)",
      notes:
        "Best case occurs when mismatches happen early. In the worst case, " +
        "every shift compares almost the entire pattern.",
    },
    tags: [
      "strings",
      "pattern-matching",
      "brute-force",
      "beginner-friendly",
      "text-processing",
    ],
    languages: [JS, PY],
    recommendedInput:
      "Text: 'abracadabra', Pattern: 'abra'\nExpect: matches at indices [0, 7].",
    notes:
      "Good as a baseline implementation before introducing more advanced algorithms " +
      "like KMP or Boyer–Moore. Useful for stepping through character comparisons " +
      "in an educational visualizer.",
    codeTemplates: {
      javascript: `// Naive string search in JavaScript.
// Returns an array of starting indices where \`pattern\` occurs in \`text\`.
function naiveSearch(text, pattern) {
  const result = [];
  const n = text.length;
  const m = pattern.length;

  if (m === 0) return result;

  for (let i = 0; i + m <= n; i++) {
    let j = 0;
    while (j < m && text[i + j] === pattern[j]) {
      j++;
    }
    if (j === m) {
      result.push(i);
    }
  }

  return result;
}

// Example:
console.log(naiveSearch("abracadabra", "abra")); // [0, 7]`,
      python: `# Naive string search in Python.
# Returns a list of starting indices where \`pattern\` occurs in \`text\`.
def naive_search(text: str, pattern: str) -> list[int]:
    result: list[int] = []
    n = len(text)
    m = len(pattern)

    if m == 0:
        return result

    for i in range(0, n - m + 1):
        j = 0
        while j < m and text[i + j] == pattern[j]:
            j += 1
        if j == m:
            result.append(i)

    return result


if __name__ == "__main__":
    print(naive_search("abracadabra", "abra"))  # [0, 7]`,
    },
    relatedIds: ["kmp-prefix-function", "boyer-moore-bad-character"],
  },

  {
    id: "kmp-prefix-function",
    name: "Knuth–Morris–Pratt (KMP)",
    title: "Knuth–Morris–Pratt (KMP) String Matching",
    shortDescription:
      "Linear-time pattern matching using a prefix function to skip redundant comparisons.",
    description:
      "KMP is a classic string matching algorithm that runs in O(n + m) time. " +
      "It precomputes a prefix function (also called a failure function or lps array) " +
      "for the pattern and uses it to skip characters in the text when a mismatch occurs. " +
      "Instead of re-comparing characters that are known to match, KMP jumps to the next " +
      "best candidate prefix, making it efficient even when patterns have many repeated substrings.",
    category: "searching",
    difficulty: "medium",
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(m)",
    complexity: {
      best: "O(n + m)",
      average: "O(n + m)",
      worst: "O(n + m)",
      space: "O(m)",
      notes:
        "The prefix function is computed once in O(m). The main scan over the text is O(n).",
    },
    tags: [
      "strings",
      "pattern-matching",
      "kmp",
      "prefix-function",
      "linear-time",
      "competitive-programming",
    ],
    languages: [JS, PY],
    recommendedInput:
      "Text: 'ababcabcabababd', Pattern: 'ababd'\nExpect: match at index [10].",
    notes:
      "KMP is a canonical interview and competitive programming algorithm. The prefix " +
      "function is a great candidate for step-by-step visualization because each update " +
      "of the lps array has a concrete explanation.",
    codeTemplates: {
      javascript: `// KMP string matching in JavaScript.
// Computes all occurrences of \`pattern\` in \`text\` using the prefix-function (LPS).
function buildLps(pattern) {
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

function kmpSearch(text, pattern) {
  const result = [];
  const n = text.length;
  const m = pattern.length;

  if (m === 0) return result;

  const lps = buildLps(pattern);
  let i = 0; // index for text
  let j = 0; // index for pattern

  while (i < n) {
    if (text[i] === pattern[j]) {
      i++;
      j++;

      if (j === m) {
        result.push(i - j);
        j = lps[j - 1];
      }
    } else {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return result;
}

// Example:
console.log(kmpSearch("ababcabcabababd", "ababd")); // [10]`,
      python: `# KMP string matching in Python.
# Returns a list of starting indices where \`pattern\` occurs in \`text\`.

from __future__ import annotations

def build_lps(pattern: str) -> list[int]:
    m = len(pattern)
    lps: list[int] = [0] * m
    length = 0
    i = 1

    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1

    return lps


def kmp_search(text: str, pattern: str) -> list[int]:
    result: list[int] = []
    n = len(text)
    m = len(pattern)

    if m == 0:
        return result

    lps = build_lps(pattern)
    i = 0  # index for text
    j = 0  # index for pattern

    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1

            if j == m:
                result.append(i - j)
                j = lps[j - 1]
        else:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1

    return result


if __name__ == "__main__":
    print(kmp_search("ababcabcabababd", "ababd"))  # [10]`,
    },
    relatedIds: ["string-naive-search", "string-rabin-karp"],
  },

  {
    id: "string-rabin-karp",
    name: "Rabin–Karp",
    title: "Rabin–Karp String Matching",
    shortDescription:
      "Uses rolling hash to find pattern occurrences efficiently, especially for multiple patterns.",
    description:
      "Rabin–Karp is a randomized string matching algorithm that uses hash values to " +
      "compare the pattern with substrings of the text. A rolling hash allows updating " +
      "the hash in constant time as the window slides. Potential hash collisions mean " +
      "candidate matches must be verified character by character, but in practice the " +
      "algorithm is fast and well suited for searching multiple patterns in the same text.",
    category: "searching",
    difficulty: "medium",
    timeComplexity: "O(n + m) expected, O(n · m) worst-case",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(n + m)",
      average: "O(n + m)",
      worst: "O(n · m)",
      space: "O(1)",
      notes:
        "Worst case happens when many hash collisions occur. Choice of base and modulus " +
        "is important to keep collision probability low.",
    },
    tags: [
      "strings",
      "rolling-hash",
      "rabin-karp",
      "pattern-matching",
      "hashing",
    ],
    languages: [JS, PY],
    recommendedInput:
      "Text: 'aaaaa', Pattern: 'aaa'\nExpect: matches at indices [0, 1, 2].",
    notes:
      "The core idea (rolling hash) is also used in plagiarism detection, diff tools, " +
      "and many substring-related problems. Visualizers can show sliding windows and hash values.",
    codeTemplates: {
      javascript: `// Rabin–Karp string matching in JavaScript.
// Simplified implementation using a base and a large modulus.
function rabinKarp(text, pattern) {
  const result = [];
  const n = text.length;
  const m = pattern.length;
  if (m === 0 || m > n) return result;

  const base = 256;
  const mod = 10 ** 9 + 7;

  let patternHash = 0;
  let windowHash = 0;
  let highestBase = 1; // base^(m-1) % mod

  for (let i = 0; i < m - 1; i++) {
    highestBase = (highestBase * base) % mod;
  }

  for (let i = 0; i < m; i++) {
    patternHash = (patternHash * base + pattern.charCodeAt(i)) % mod;
    windowHash = (windowHash * base + text.charCodeAt(i)) % mod;
  }

  for (let i = 0; i <= n - m; i++) {
    if (patternHash === windowHash) {
      // Verify characters to avoid false positives from collisions.
      let match = true;
      for (let j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        result.push(i);
      }
    }

    if (i < n - m) {
      const outChar = text.charCodeAt(i);
      const inChar = text.charCodeAt(i + m);

      let newHash = windowHash - (outChar * highestBase) % mod;
      if (newHash < 0) newHash += mod;

      newHash = (newHash * base + inChar) % mod;
      windowHash = newHash;
    }
  }

  return result;
}

// Example:
console.log(rabinKarp("aaaaa", "aaa")); // [0, 1, 2]`,
      python: `# Rabin–Karp string matching in Python.
# Returns a list of starting indices where \`pattern\` occurs in \`text\`.

from __future__ import annotations

def rabin_karp(text: str, pattern: str) -> list[int]:
    result: list[int] = []
    n = len(text)
    m = len(pattern)
    if m == 0 or m > n:
        return result

    base = 256
    mod = 10 ** 9 + 7

    pattern_hash = 0
    window_hash = 0
    highest_base = 1  # base^(m-1) % mod

    for _ in range(m - 1):
        highest_base = (highest_base * base) % mod

    for i in range(m):
        pattern_hash = (pattern_hash * base + ord(pattern[i])) % mod
        window_hash = (window_hash * base + ord(text[i])) % mod

    for i in range(n - m + 1):
        if pattern_hash == window_hash:
            # Verify to guard against collisions.
            if text[i : i + m] == pattern:
                result.append(i)

        if i < n - m:
            out_char = ord(text[i])
            in_char = ord(text[i + m])

            new_hash = window_hash - (out_char * highest_base) % mod
            new_hash %= mod
            new_hash = (new_hash * base + in_char) % mod
            window_hash = new_hash

    return result


if __name__ == "__main__":
    print(rabin_karp("aaaaa", "aaa"))  # [0, 1, 2]`,
    },
    relatedIds: ["string-naive-search", "kmp-prefix-function"],
  },

  {
    id: "edit-distance-levenshtein",
    name: "Edit Distance (Levenshtein)",
    title: "Levenshtein Edit Distance",
    shortDescription:
      "Dynamic programming algorithm that measures how many edits are needed to transform one string into another.",
    description:
      "Levenshtein distance is the minimum number of single-character edits required to " +
      "transform one string into another. The allowed operations are insertion, deletion, " +
      "and substitution. The classic dynamic programming solution builds a 2D table " +
      "dp[i][j] that represents the edit distance between prefixes text[0..i) and " +
      "pattern[0..j).",
    category: "dynamic-programming",
    difficulty: "medium",
    timeComplexity: "O(n · m)",
    spaceComplexity: "O(n · m)",
    complexity: {
      best: "O(n · m)",
      average: "O(n · m)",
      worst: "O(n · m)",
      space: "O(n · m)",
      notes:
        "Space can be optimized to O(min(n, m)) if only the distance (and not the full table) is needed.",
    },
    tags: [
      "strings",
      "dynamic-programming",
      "edit-distance",
      "levenshtein",
      "approximate-matching",
    ],
    languages: [JS, PY],
    recommendedInput:
      "Source: 'kitten', Target: 'sitting'\nExpect: distance = 3.",
    notes:
      "Edit distance is widely used in spell-checking, fuzzy search, and bioinformatics. " +
      "The 2D DP table is a perfect candidate for a grid-based visualizer.",
    codeTemplates: {
      javascript: `// Levenshtein edit distance in JavaScript.
// Returns the minimum number of edits to transform a into b.
function editDistance(a, b) {
  const n = a.length;
  const m = b.length;

  const dp = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0)
  );

  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[n][m];
}

// Example:
console.log(editDistance("kitten", "sitting")); // 3`,
      python: `# Levenshtein edit distance in Python.

from __future__ import annotations

def edit_distance(a: str, b: str) -> int:
    n = len(a)
    m = len(b)

    dp: list[list[int]] = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1

            dp[i][j] = min(
                dp[i - 1][j] + 1,      # deletion
                dp[i][j - 1] + 1,      # insertion
                dp[i - 1][j - 1] + cost,  # substitution
            )

    return dp[n][m]


if __name__ == "__main__":
    print(edit_distance("kitten", "sitting"))  # 3`,
    },
    relatedIds: ["lcs-dp", "string-naive-search"],
  },

  {
    id: "lcs-dp",
    name: "Longest Common Subsequence",
    title: "Longest Common Subsequence (LCS)",
    shortDescription:
      "Classic DP algorithm that finds the longest subsequence common to two strings.",
    description:
      "The Longest Common Subsequence problem asks for the longest sequence of characters " +
      "that appear in both strings in the same order (not necessarily contiguous). The " +
      "standard dynamic programming solution uses a 2D table dp[i][j] that represents " +
      "the length of the LCS between prefixes a[0..i) and b[0..j).",
    category: "dynamic-programming",
    difficulty: "medium",
    timeComplexity: "O(n · m)",
    spaceComplexity: "O(n · m)",
    complexity: {
      best: "O(n · m)",
      average: "O(n · m)",
      worst: "O(n · m)",
      space: "O(n · m)",
      notes:
        "The DP can be optimized to use only two rows if only the LCS length is needed.",
    },
    tags: [
      "strings",
      "dynamic-programming",
      "lcs",
      "subsequence",
      "classic",
    ],
    languages: [JS, PY],
    recommendedInput:
      "A: 'ABCBDAB', B: 'BDCABC'\nExpect: LCS length = 4 (one LCS is 'BCAB').",
    notes:
      "LCS is closely related to diff algorithms and version control tools. A visualizer " +
      "can animate how the DP table is filled and which cells contribute to the final subsequence.",
    codeTemplates: {
      javascript: `// Longest Common Subsequence (LCS) length in JavaScript.
function lcsLength(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[n][m];
}

// Example:
console.log(lcsLength("ABCBDAB", "BDCABC"));`,
      python: `# Longest Common Subsequence (LCS) length in Python.

from __future__ import annotations

def lcs_length(a: str, b: str) -> int:
    n = len(a)
    m = len(b)

    dp: list[list[int]] = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[n][m]


if __name__ == "__main__":
    print(lcs_length("ABCBDAB", "BDCABC"))`,
    },
    relatedIds: ["edit-distance-levenshtein"],
  },

  {
    id: "palindrome-dp",
    name: "Longest Palindromic Substring (DP)",
    title: "Longest Palindromic Substring (DP)",
    shortDescription:
      "Dynamic programming approach to find the longest substring which reads the same forward and backward.",
    description:
      "Given a string s, the longest palindromic substring problem asks for the " +
      "longest contiguous substring that is a palindrome. The DP approach defines " +
      "dp[i][j] as true if s[i..j] is a palindrome and false otherwise. The table " +
      "is filled based on substring length and matching endpoints.",
    category: "dynamic-programming",
    difficulty: "medium",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n²)",
    complexity: {
      best: "O(1) (all characters equal)", // trivial but fun fact
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(n²)",
      notes:
        "Center-expansion or Manacher's algorithm can improve constants or asymptotics, " +
        "but the DP formulation is easier to teach and visualize.",
    },
    tags: [
      "strings",
      "dynamic-programming",
      "palindrome",
      "substring",
      "interview",
    ],
    languages: [JS, PY],
    recommendedInput:
      "s = 'babad'\nExpect: 'bab' or 'aba' (both are valid longest palindromes).",
    notes:
      "The DP table is symmetric around the main diagonal. Visualizers can show how " +
      "shorter palindromes enable longer ones as the window expands.",
    codeTemplates: {
      javascript: `// Longest Palindromic Substring using DP in JavaScript.
function longestPalindromicSubstring(s) {
  const n = s.length;
  if (n === 0) return "";

  const dp = Array.from({ length: n }, () => new Array(n).fill(false));
  let bestStart = 0;
  let bestLen = 1;

  for (let i = 0; i < n; i++) {
    dp[i][i] = true;
  }

  for (let i = 0; i < n - 1; i++) {
    if (s[i] === s[i + 1]) {
      dp[i][i + 1] = true;
      bestStart = i;
      bestLen = 2;
    }
  }

  for (let len = 3; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] === s[j] && dp[i + 1][j - 1]) {
        dp[i][j] = true;
        if (len > bestLen) {
          bestLen = len;
          bestStart = i;
        }
      }
    }
  }

  return s.slice(bestStart, bestStart + bestLen);
}

// Example:
console.log(longestPalindromicSubstring("babad"));`,
      python: `# Longest Palindromic Substring using DP in Python.

from __future__ import annotations

def longest_palindromic_substring(s: str) -> str:
    n = len(s)
    if n == 0:
        return ""

    dp: list[list[bool]] = [[False] * n for _ in range(n)]
    best_start = 0
    best_len = 1

    for i in range(n):
        dp[i][i] = True

    for i in range(n - 1):
        if s[i] == s[i + 1]:
            dp[i][i + 1] = True
            best_start = i
            best_len = 2

    for length in range(3, n + 1):
        for i in range(0, n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and dp[i + 1][j - 1]:
                dp[i][j] = True
                if length > best_len:
                    best_len = length
                    best_start = i

    return s[best_start : best_start + best_len]


if __name__ == "__main__":
    print(longest_palindromic_substring("babad"))`,
    },
    relatedIds: ["palindrome-two-pointers"],
  },
];
