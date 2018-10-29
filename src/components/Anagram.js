import React from 'react';
import { List, AutoSizer } from 'react-virtualized';

import getAllWordsFromString from './trie';
import styles from './Anagram.module.css';
import backArrow from '../images/back-arrow.svg';

export default class Anagram extends React.Component {
  static defaultProps = {
    trie: null,
    startString: '',
    onBackClicked: () => {},
  };

  state = {
    phrase: [],
    lettersLeft: [],
    scrollToIdx: 0,
  };

  optionsContainerRef = React.createRef();

  componentDidMount() {
    const { startString } = this.props;
    const lettersLeft = startString
      .toLowerCase()
      .replace(/ /g, '')
      .split('');
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

    this.setState({
      lettersLeft: newLettersLeft,
      phrase: newPhrase,
      scrollToIdx: 0,
    });
  };

  onPhraseClicked = e => {
    const word = e.target.textContent;
    const letters = word.split('');
    const { phrase, lettersLeft } = this.state;
    const newLettersLeft = [...lettersLeft, ...letters];
    const newPhrase = Array.from(phrase);
    const removedWordIdx = phrase.indexOf(word);
    newPhrase.splice(removedWordIdx, 1);

    // We'll automatically sroll the user to the word they deleted
    const sortedLettersStr = newLettersLeft.sort().join('');
    const words = getAllWordsFromString(this.props.trie, sortedLettersStr);
    const scrollToIdx = words.indexOf(word);

    this.setState({
      lettersLeft: newLettersLeft,
      phrase: newPhrase,
      scrollToIdx,
    });
  };

  scrollOptionsToTop = () => {
    this.optionsContainerRef.current.scrollTo(0, 0);
  };

  render() {
    const { trie } = this.props;
    const { phrase, lettersLeft, scrollToIdx } = this.state;
    // We sort and join the lettersLeft arr so that we can take full advantage
    // of the memoization (we'll always get equal strings passed in)
    const sortedLettersStr = lettersLeft.sort().join('');
    const words = getAllWordsFromString(trie, sortedLettersStr);
    return (
      <div className={styles.anagramContainer}>
        <h3 style={{ marginLeft: '25px' }}>
          &ldquo;
          {this.props.startString}
          &rdquo;
        </h3>
        <div>
          <div className={styles.phraseContainer}>
            &ldquo;
            {phrase.map(word => (
              <span
                key={'p-' + word}
                className={styles.phrase}
                onClick={this.onPhraseClicked}
              >
                {word}
              </span>
            ))}
            &rdquo;
          </div>
          <p style={{ fontSize: '18px' }}>
            Select words below to create your anagram
            <br />
            You can remove selected words by clicking them above.
          </p>
        </div>
        <div>Letters left: [ {lettersLeft.join(', ')} ]</div>
        <div className={styles.wordContainer} ref={this.optionsContainerRef}>
          <AutoSizer>
            {({ width, height }) => (
              <List
                height={height}
                rowHeight={46}
                rowCount={words.length}
                scrollToIndex={scrollToIdx}
                rowRenderer={({ index, key, style }) => (
                  <div
                    key={key}
                    style={style}
                    className={styles.word}
                    onClick={this.onWordClicked}
                  >
                    {words[index]}
                  </div>
                )}
                width={width}
              />
            )}
          </AutoSizer>
        </div>
        <div>
          <button
            className={styles.backButton}
            onClick={this.props.onBackClicked}
          >
            <img src={backArrow} alt="" />
          </button>
        </div>
      </div>
    );
  }
}
