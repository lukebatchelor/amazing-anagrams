const fs = require('fs');

const wordListFilePath = './words.txt';
const outputFilePath = './static/trie.json';

const file = fs.readFileSync(wordListFilePath, 'utf8');
const words = file.split('\n');
const trie = buildTrie(words);

console.log(`${words.length} total words loaded from ${wordListFilePath}`);
console.log(`Writing to ${outputFilePath}`);

const jsonStr = JSON.stringify(trie);
fs.writeFileSync(outputFilePath, jsonStr);

console.log('Done!');

function buildTrie(words) {
  let trie = {};

  for (let word of words) {
    let cur = trie;
    for (let i = 0; i < word.length; i++) {
      if (!cur[word[i]]) {
        cur[word[i]] = {};
      }
      cur = cur[word[i]];
    }
    cur['$'] = true;
  }

  return trie;
}
