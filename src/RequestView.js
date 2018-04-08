import React, { Component } from 'react';
import { SearchView } from './SearchView';

export class RequestView extends Component {
  selectSong = (song) => {
    console.log(song);
  }

  render() {
    return <SearchView accessToken={localStorage.getItem("accessToken")} selectSong={this.selectSong} />;
  }
}