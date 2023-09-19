import { franc } from "franc";
import words from "an-array-of-english-words" assert { type: "json" };

import languageCodes from "./language-codes.json" assert { type: "json" };
import { normaliseWord } from "../utils";

/**
 * @type {Set<string>}
 */
const englishWords = new Set(words);

/**
 * @param {string} input
 */
export function detectLanguage(input) {
  const langCode = franc(input);

  return languageCodes[langCode];
}

/**
 *
 * @param {string} word
 */
export function isEnglishWord(word) {
  return englishWords.has(normaliseWord(word));
}
