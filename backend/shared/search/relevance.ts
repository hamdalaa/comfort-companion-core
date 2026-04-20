import { compactText, normalizeText } from "../catalog/normalization.js";

const TOKEN_SPLIT_RE = /[\s/_\-(),.]+/;

const QUERY_ALIASES: Record<string, string[]> = {
  mac: ["macbook", "mac mini", "macmini", "imac", "apple", "ماك", "ماكبوك"],
  macbook: ["mac", "apple", "ماك", "ماكبوك"],
  imac: ["mac", "apple", "ماك"],
  apple: ["iphone", "ipad", "macbook", "mac", "ابل", "آبل"],
  iphone: ["apple", "ايفون", "آيفون"],
  "ماك": ["mac", "macbook", "mac mini", "macmini", "imac", "apple", "ماكبوك"],
  "ماكبوك": ["macbook", "mac", "apple", "ماك"],
  "ايفون": ["iphone", "apple"],
  "آيفون": ["iphone", "apple"],
};

export interface WeightedSearchField {
  value?: string;
  weight?: number;
}

interface PreparedQuery {
  raw: string;
  normalized: string;
  compact: string;
  baseTokens: string[];
  aliasTokens: string[];
}

export function scoreSearchTextMatch(query: string, fields: WeightedSearchField[]): number {
  const prepared = prepareQuery(query);
  if (!prepared.normalized) return 0;

  let score = 0;
  for (const field of fields) {
    if (!field.value) continue;
    score += scoreFieldMatch(prepared, field.value) * (field.weight ?? 1);
  }
  return score;
}

function prepareQuery(query: string): PreparedQuery {
  const normalized = normalizeText(query);
  const compact = compactText(query);
  const baseTokens = tokenize(normalized).filter(isMeaningfulToken);
  const aliasTokens = [...collectAliasTokens(baseTokens)].filter((token) => !baseTokens.includes(token));

  return {
    raw: query,
    normalized,
    compact,
    baseTokens,
    aliasTokens,
  };
}

function tokenize(input: string): string[] {
  return normalizeText(input)
    .split(TOKEN_SPLIT_RE)
    .map((token) => token.trim())
    .filter(Boolean);
}

function collectAliasTokens(baseTokens: string[]): Set<string> {
  const aliases = new Set<string>();
  for (const token of baseTokens) {
    const related = QUERY_ALIASES[token];
    if (!related) continue;
    for (const alias of related) {
      for (const aliasToken of tokenize(alias)) {
        if (isMeaningfulToken(aliasToken)) aliases.add(aliasToken);
      }
    }
  }
  return aliases;
}

function isMeaningfulToken(token: string): boolean {
  if (!token) return false;
  if (token.length >= 3) return true;
  return /\d/.test(token);
}

function scoreFieldMatch(query: PreparedQuery, value: string): number {
  const normalized = normalizeText(value);
  if (!normalized) return 0;

  const compact = compactText(value);
  const tokens = tokenize(normalized).filter(isMeaningfulToken);

  let score = 0;

  if (query.compact && compact === query.compact) score += 40;
  if (query.normalized && normalized === query.normalized) score += 32;
  if (query.normalized && normalized.startsWith(query.normalized)) score += 24;
  if (query.compact && compact.startsWith(query.compact)) score += 18;
  if (query.compact && compact.includes(query.compact)) score += query.compact.length <= 3 ? 3 : 7;

  const baseMatches = scoreTokenSet(query.baseTokens, tokens, {
    exact: 14,
    prefix: 8,
    contains: 4,
    fuzzy: 3,
  });
  const aliasMatches = scoreTokenSet(query.aliasTokens, tokens, {
    exact: 4,
    prefix: 2.5,
    contains: 1,
    fuzzy: 0.75,
  });

  score += baseMatches.score + aliasMatches.score;
  if (query.baseTokens.length > 0) {
    const coverage = baseMatches.matches / query.baseTokens.length;
    if (coverage === 1) score += 10;
    else if (coverage >= 0.6) score += 5;
  }

  return score;
}

function scoreTokenSet(
  queryTokens: string[],
  fieldTokens: string[],
  weights: { exact: number; prefix: number; contains: number; fuzzy: number },
): { score: number; matches: number } {
  let score = 0;
  let matches = 0;

  for (const queryToken of queryTokens) {
    let best = 0;
    for (const fieldToken of fieldTokens) {
      if (fieldToken === queryToken) {
        best = Math.max(best, weights.exact);
        continue;
      }
      if (fieldToken.startsWith(queryToken) || queryToken.startsWith(fieldToken)) {
        best = Math.max(best, weights.prefix);
        continue;
      }
      if (queryToken.length >= 4 && (fieldToken.includes(queryToken) || queryToken.includes(fieldToken))) {
        best = Math.max(best, weights.contains);
        continue;
      }
      if (
        queryToken.length >= 4 &&
        fieldToken.length >= 4 &&
        !/\d/.test(queryToken) &&
        !/\d/.test(fieldToken) &&
        withinEditDistance(fieldToken, queryToken, 1)
      ) {
        best = Math.max(best, weights.fuzzy);
      }
    }

    if (best > 0) {
      score += best;
      matches += 1;
    }
  }

  return { score, matches };
}

function withinEditDistance(a: string, b: string, maxDistance: number): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > maxDistance) return false;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array(b.length + 1).fill(0);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    let rowMin = current[0];

    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        (current[j - 1] ?? 0) + 1,
        (previous[j] ?? 0) + 1,
        (previous[j - 1] ?? 0) + cost,
      );
      rowMin = Math.min(rowMin, current[j] ?? rowMin);
    }

    if (rowMin > maxDistance) return false;
    for (let j = 0; j <= b.length; j += 1) previous[j] = current[j];
  }

  return (previous[b.length] ?? Number.POSITIVE_INFINITY) <= maxDistance;
}
