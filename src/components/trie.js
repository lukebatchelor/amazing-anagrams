import memoize from 'fast-memoize';

/**
 * Recursive function for searching a down a trie. Prefixes is a Map in the shape:
 * {
 *   [prefix]: {
 *     ptr: <a reference to the part of the trie we are in>
 *     letters: <the list of letters we still have left to use>
 *   }
 * }
 * Where the "prefix" key is a validPrefix withing the trie (there exists at least
 * one more word that starts with that string).
 */
function getAllWordsFromStringRecurse(trie, prefixes, words) {
  if (prefixes.size === 0) {
    return Array.from(words).sort((a, b) => b.length - a.length);
  }

  const newPrefixes = new Map();
  prefixes.forEach((cur, prefix) => {
    const { ptr, letters } = cur;
    if (ptr['$']) {
      words.add(prefix);
    }
    letters.forEach((letter, idx) => {
      if (ptr[letter]) {
        const lettersLeft = [...letters];
        lettersLeft.splice(idx, 1);
        newPrefixes.set(`${prefix}${letter}`, {
          ptr: ptr[letter],
          letters: lettersLeft,
        });
      }
    });
  });
  return getAllWordsFromStringRecurse(trie, newPrefixes, words);
}

/**
 * Get all the words in a trie that can be made up using the letters in string.
 */
function getAllWordsFromString(trie, string) {
  const letters = string.split('');
  const prefixes = new Map();
  // We use a set to automatically take care of de-duping for us
  const words = new Set();

  // To start the search, we'll create the inital "pointers" to where we are searching
  letters.forEach((letter, idx) => {
    if (trie[letter]) {
      const lettersLeft = [...letters];
      lettersLeft.splice(idx, 1);
      // For each pointer we track the current total prefix (just the starting
      // letter in this case), a reference to where we are in the trie (ptr)
      // and a list of letters that are still left to use
      prefixes.set(letter, { ptr: trie[letter], letters: lettersLeft });
    }
  });

  return getAllWordsFromStringRecurse(trie, prefixes, words);
}

const memoizedGetAllWordsFromString = memoize(getAllWordsFromString);

export default memoizedGetAllWordsFromString;
