import React from 'react';

import Start from './Start';
import Anagram from './Anagram';

const START_SCREEN = 'START_SCREEN';
const ANAGRAM_SCREEN = 'ANAGRAM_SCREEN';

export default class App extends React.Component {
  state = {
    trie: null,
    curScreen: START_SCREEN,
  };

  startString = '';

  componentDidMount() {
    fetch('/trie.json')
      .then(resp => resp.json())
      .then(jsonResp => {
        this.setState({
          trie: jsonResp,
        });
      });
  }

  onPhraseChange = e => {
    const newValue = e.target.value;
    this.startString = newValue;
  };

  onGoPressed = () => {
    if (this.startString.length > 0) {
      this.setState({
        curScreen: ANAGRAM_SCREEN,
      });
    } else {
      alert('You need to put a word or phrase in!');
    }
  };

  onBackClicked = () => {
    this.setState({ curScreen: START_SCREEN });
  };

  render() {
    return (
      <>
        {this.state.curScreen === START_SCREEN && (
          <Start
            onPhraseChange={this.onPhraseChange}
            onGoPressed={this.onGoPressed}
          />
        )}
        {this.state.curScreen === ANAGRAM_SCREEN && (
          <Anagram
            trie={this.state.trie}
            startString={this.startString}
            onBackClicked={this.onBackClicked}
          />
        )}
      </>
    );
  }
}
