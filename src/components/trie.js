const memoize = require('fast-memoize');

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

// export default memoizedGetAllWordsFromString;

const FIND_LIMIT = Infinity;
const CHECK_LIMIT = Infinity;
// export function getAllAnagramsFromString(trie, string) {
function getAllAnagramsFromString(trie, string) {
  const matches = [];
  const seen = new Set();
  let checked = 0;
  let stack = [];
  const words = getAllWordsFromString(trie, string);
  for (let word of words) {
    stack.push(word);
  }
  while (
    stack.length !== 0 &&
    matches.length < FIND_LIMIT &&
    checked < CHECK_LIMIT
  ) {
    const next = stack.pop();
    checked += 1;
    if (!seen.has(next)) {
      seen.add(next);
      const newLettersLeft = Array.from(string);
      for (let letter of next) {
        if (letter != ' ') {
          newLettersLeft.splice(newLettersLeft.indexOf(letter), 1);
        }
      }
      if (newLettersLeft.length === 0) {
        matches.push(next);
        continue;
      }
      const newWords = getAllWordsFromString(trie, newLettersLeft.join(''));
      newWords.forEach(word => stack.push(next + ' ' + word));
    }
  }

  console.log('Done', {
    stack: stack.length,
    matches: matches.length,
    checked,
  });
  return matches;
}

function debug(queue) {
  console.log(
    queue.map(({ lettersLeft, soFar }) => ({
      lettersLeft,
      soFar,
    }))
  );
}
function getFullAnagrams(trie, phrase, CHECK_LIMIT = 500) {
  const anagrams = [];
  const explored = new Set();
  const queue = getInitialQueue(phrase);
  let checked = 0;

  // label all root nodes as explored
  queue.forEach(queueItem => explored.add(queueItem.soFar));

  while (queue.length !== 0 && checked < CHECK_LIMIT) {
    const next = queue.shift();
    checked += 1;
    if (next.lettersLeft.length === 0) {
      anagrams.push(next.soFar);
      return anagrams;
    }
    // if we are at a word boundary
    if (next.dictPtr['$']) {
      next.soFar += ' '; // add a space to our result
      next.dictPtr = trie; // reset out dictionary pointer
    }
    for (let letter of next.lettersLeft) {
      // if the next letter is part of a valid word
      if (next.dictPtr[letter]) {
        const newSoFar = next.soFar + letter;
        if (!explored.has(newSoFar)) {
          explored.add(newSoFar);
          const newLettersLeft = Array.from(next.lettersLeft);
          newLettersLeft.splice(next.lettersLeft.indexOf(letter), 1);
          queue.push({
            soFar: newSoFar,
            lettersLeft: newLettersLeft,
            dictPtr: next.dictPtr[letter],
          });
        }
      }
    }
  }

  console.log({ found: anagrams.length, checked });
  // if (checked >= CHECK_LIMIT) debug(queue.slice(0, 200));
  return anagrams;
}

function getInitialQueue(phrase) {
  const intialQueue = Array.from(phrase)
    // remove duplicate letters as start locations
    .filter((letter, idx) => phrase.indexOf(letter) === idx)
    .map(letter => ({
      lettersLeft: Array.from(phrase.replace(letter, '')),
      dictPtr: trie[letter],
      soFar: letter,
    }));
  return intialQueue;
}

const args = process.argv.slice(2);
const trie = require('../../static/trie.json');
// console.log(Object.keys(trie));
const res = getFullAnagrams(trie, 'foobar', Number(args[0]) || 500);
const matches = Array.from(res).slice(100);
console.log(matches);
