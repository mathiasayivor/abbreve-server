/**
 *
 * @param {string} word
 */
export function normaliseWord(word) {
  return word.replace(/[^a-zA-Z0-9\-/_]/g, "").toLowerCase();
}

/**
 *
 * @param {{definition: string; alternatives?: Array<string>; contexts?: Array<string>}} definition
 */
export function createAbbrDefinition(definition) {
  return {
    definition: definition.definition,
    alternatives: definition.alternatives || [],
    contexts: definition.contexts || [],
  };
}
