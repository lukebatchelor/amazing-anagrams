const fs = require('fs');

const input = process.argv[2] || 'testing';
const file = fs.readFileSync('./words.txt', 'utf8');
const words = file.split('\n');
const trie = buildTrie(words);

console.log(words.length, 'total words loaded');
const subWords = Array.from(getAllWordsFromString(trie, input));
const sortedSubWords = subWords.sort((a, b) => b.length - a.length)
console.log(sortedSubWords);

fs.writeFileSync('trie.json', JSON.stringify(trie));

function buildTrie(words) {
  let trie = {};
  
  for (let word of words) {
    let cur = trie;
    for (let i=0; i < word.length; i++) {
      if (!cur[word[i]]) {
        cur[word[i]] = { };
      }
      cur = cur[word[i]];
    }
    cur['$'] = true;
  }

  return trie;
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


// Adapted from: https://gist.github.com/JeffML/0cee0d09d32347ea95e0f9cb4f851cd8
function* combinationsGenerator(remainder, current = []) {
  if (remainder.length === 0) {
    yield(current);
  } else {
      yield* combinationsGenerator(remainder.slice(1, remainder.length), current.concat(remainder[0]));
      yield* combinationsGenerator(remainder.slice(1, remainder.length), current);
  }
}

function getAllWordsFromString(trie, string) {
  const letters = string.split('');
  const generator = combinationsGenerator(letters);
  const words = new Set();
  for (let next of generator) {
    if (wordExists(trie, [...next])) {
      words.add(next.join(''));
    }
  }

  return words; 
}