import React, { Component } from 'react';
import { SearchView } from './SearchView';

export class RequestView extends Component {
  render() {
    return <SearchView accessToken={localStorage.getItem("accessToken")} />;
  }
}