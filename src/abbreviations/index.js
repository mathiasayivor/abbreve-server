import fs from "fs/promises";
import { isEnglishWord } from "../nlp";
import { createAbbrDefinition, normaliseWord } from "../utils";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

export async function translateSentence(sentence) {
  const words = sentence.split(" ");
  const definitions = await lookupAbbreviations(words);

  let unknownWords = [];
  const alternatives = {};

  for (let i = 0; i < definitions.length; i++) {
    const originalWord = words[i];
    const normalisedOriginalWord = normaliseWord(originalWord);
    const definition = definitions[i];

    if (!definition) {
      unknownWords.push(originalWord);
      definitions[i] = createAbbrDefinition({
        definition: originalWord,
      });
    } else if (definition.alternatives.length) {
      alternatives[normalisedOriginalWord] = definition.alternatives;
    }
  }

  return {
    translation: definitions.reduce(
      (string, definition, index) =>
        string +
        (index > 0 && index < definitions.length ? " " : "") +
        definition.definition,
      ""
    ),
    unknownWords,
    alternatives,
  };
}

/**
 *
 * @param {Array<string>} abbreviations
 * @returns {Promise<Array<string | null>>}
 */
export async function lookupAbbreviations(abbreviations) {
  return await Promise.all(abbreviations.map(singleAbbreviation));
}

/**
 *
 * @param {string} abbrevation
 */
async function singleAbbreviation(abbrevation) {
  const normalisedVersion = normaliseWord(abbrevation);
  const encodedVersion = encodeURIComponent(normalisedVersion);

  try {
    const content = await fs.readFile(
      join(
        dirname(fileURLToPath(import.meta.url)),
        `../../data/abbreviations/db/${encodedVersion}.json`
      )
    );

    const { definition, alternatives } = JSON.parse(content.toString());

    return createAbbrDefinition({
      definition: abbrevation
        .toLowerCase()
        .replace(normalisedVersion, definition),
      alternatives: alternatives
        ? alternatives.split(",").map((alternative) => alternative.trim())
        : [],
    });
  } catch (e) {
    return isEnglishWord(abbrevation)
      ? createAbbrDefinition({ definition: abbrevation })
      : null;
  }
}
