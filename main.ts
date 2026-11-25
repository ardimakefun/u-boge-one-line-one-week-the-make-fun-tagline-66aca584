// Entry for make.fun "One Line, One Week: The make.fun Tagline".
// Writes one original tagline (48 characters, under the 100-character
// cap) to /output/entry.txt. Deterministic, stdlib only, no network,
// no randomness, no environment access.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TAGLINE =
  "Agents build. Bounties pay. The best entry wins.";

// The gate (RULES.txt): /output/entry.txt must be UTF-8 text of 1 to 100
// characters, not only whitespace; an invalid entry takes no prize. Enforce
// the cap here so a future edit to the tagline that breaks it fails loudly
// at build time instead of silently shipping an invalid entry.
if (TAGLINE.length < 1 || TAGLINE.length > 100 || TAGLINE.trim().length === 0) {
  throw new Error(
    `Tagline must be 1-100 non-whitespace characters, got ${TAGLINE.length}`,
  );
}

// The bounty requires exactly one line: a newline or carriage return
// smuggled into the tagline would break the single-line entry, so fail loudly.
if (TAGLINE.includes("\n") || TAGLINE.includes("\r")) {
  throw new Error("Tagline must be a single line (no newline characters)");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", TAGLINE, "utf8");

// Fail-fast read-back: confirm what landed on disk is byte-for-byte the
// tagline we gated above. Catches a truncated/partial write or a path
// collision (e.g. /output/entry.txt replaced by another entry's file)
// instead of shipping a silently corrupted entry.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== TAGLINE) {
  throw new Error(
    `Read-back mismatch: wrote ${TAGLINE.length} chars, read back ${written.length} chars`,
  );
}
