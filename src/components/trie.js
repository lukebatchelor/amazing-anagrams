import memoize from 'fast-memoize';

// Adapted from: https://gist.github.com/JeffML/0cee0d09d32347ea95e0f9cb4f851cd8
function* combinationsGenerator(remainder, current = []) {
  if (remainder.length === 0) {
    yield current;
  } else {
    yield* combinationsGenerator(
      remainder.slice(1, remainder.length),
      current.concat(remainder[0])
    );
    yield* combinationsGenerator(remainder.slice(1, remainder.length), current);
  }
}

function wordExists(trie, letters) {
  let nextLetter = letters.shift();
  let curNode = trie;
  while (nextLetter) {
    if (curNode[nextLetter]) {
      curNode = curNode[nextLetter];
      nextLetter = letters.shift();
    } else {
      return false;
    }
  }
  if (curNode['$']) return true;
  return false;
}

function getAllWordsFromString(trie, string) {
  if (!trie || !string) {
    return [];
  }
  const letters = string.split('');
  const generator = combinationsGenerator(letters);
  const words = new Set();
  for (let next of generator) {
    if (wordExists(trie, [...next])) {
      words.add(next.join(''));
    }
  }
  const sorted = Array.from(words).sort((a, b) => b.length - a.length);

  return sorted;
}

const memoizedGetAllWordsFromString = memoize(getAllWordsFromString);

export default memoizedGetAllWordsFromString;
