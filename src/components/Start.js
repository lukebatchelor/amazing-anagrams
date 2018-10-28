import React from 'react';

import styles from './Start.module.css';

export default class Start extends React.Component {
  static defaultProps = {
    onPhraseChange: () => {},
    onGoPressed: () => {},
  };

  render() {
    return (
      <div className={styles.startScreenWrapper}>
        <h1>START SCREEN</h1>

        <p>Find anagrams of your favourite words, names or phrases!</p>
        <div style={{ marginTop: '30px' }}>
          <input
            type="text"
            placeholder="Your phrase here"
            className={styles.phraseInput}
            onChange={this.props.onPhraseChange}
          />
        </div>
        <div style={{ marginTop: '30px' }}>
          <button className={styles.goButton} onClick={this.props.onGoPressed}>
            Go!
          </button>
        </div>
      </div>
    );
  }
}
