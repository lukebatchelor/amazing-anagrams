import React from 'react';

export default class App extends React.Component {
  state = {
    trie: null,
  };

  componentDidMount() {
    fetch('/trie.json')
      .then(resp => resp.json)
      .then(jsonResp => {
        this.setState({
          trie: jsonResp,
        });
      });
  }

  render() {
    return <div>{this.state.trie ? 'Data loaded!' : 'Loading Data'}</div>;
  }
}
