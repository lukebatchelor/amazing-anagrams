import React from 'react';
import getAllWordsFromString from './trie';

import styles from './Anagram.module.css';

export default class Anagram extends React.Component {
  static defaultProps = {
    trie: null,
    startString: '',
  };

  state = {
    phrase: [],
    lettersLeft: [],
  };

  componentDidMount() {
    const { startString } = this.props;
    const lettersLeft = startString
      .toLowerCase()
      .replace(/ /g, '')
      .split('');
    console.log(lettersLeft);
    this.setState({ lettersLeft });
  }

  onWordClicked = e => {
    const word = e.target.textContent;
    const letters = word.split('');
    const { lettersLeft, phrase } = this.state;
    const newPhrase = [...phrase, word];
    const newLettersLeft = Array.from(lettersLeft);

    for (let letter of letters) {
      newLettersLeft.splice(newLettersLeft.indexOf(letter), 1);
    }

    this.setState({ lettersLeft: newLettersLeft, phrase: newPhrase });
  };

  onPhraseClicked = e => {
    const word = e.target.textContent;
    const letters = word.split('');
    const { phrase, lettersLeft } = this.state;
    const newLettersLeft = [...lettersLeft, ...letters];
    const newPhrase = Array.from(phrase);
    newPhrase.splice(phrase.indexOf(word), 1);

    this.setState({ lettersLeft: newLettersLeft, phrase: newPhrase });
  };

  render() {
    const { trie } = this.props;
    const { phrase, lettersLeft } = this.state;
    // We sort and join the lettersLeft arr so that we can take full advantage
    // of the memoization (we'll always get equal strings passed in)
    const sortedLettersStr = lettersLeft.sort().join('');
    const words = getAllWordsFromString(trie, sortedLettersStr);
    return (
      <div>
        <h3>"{this.props.startString}"</h3>
        <div>
          <div className={styles.phraseContainer}>
            "
            {phrase.map(word => (
              <span
                key={'p-' + word}
                className={styles.phrase}
                onClick={this.onPhraseClicked}
              >
                {word}
              </span>
            ))}
            "
          </div>
          <p>
            Select words below to create your anagram
            <br />
            You can remove selected words by clicking them above.
          </p>
          <div>Letters left: [ {lettersLeft.join(', ')} ]</div>
        </div>
        <div className={styles.wordContainer}>
          {words.map(word => (
            <div
              key={word}
              className={styles.word}
              onClick={this.onWordClicked}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
