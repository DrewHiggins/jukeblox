import React, { Component } from 'react';
import { 
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from 'reactstrap';

export class SearchView extends Component {
  state = {
    query: '',
    searchResults: []
  };

  handleQueryChange = (e) => {
    let newQuery = e.target.value;
    this.setState({ query: newQuery });
  }

  searchOnSpotify = (query) => {
    let url = "https://api.spotify.com/v1/search";
    url += `?q=${query}`;
    url += '&type=track&market=US&limit=5';
    fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.props.accessToken
      }
    }).then(res => res.json())
      .then(res => {
        console.log(res);
        let results = res.tracks.items;
        let resultsList = results.map((result, index) => {
          return (
            <ListGroupItem key={result.id}>
              <ListGroupItemHeading>{result.name}</ListGroupItemHeading>
              <ListGroupItemText>
                {result.artists.map(artist => artist.name).join(', ')} &mdash;
                <em>{result.album.name}</em>
              </ListGroupItemText>
            </ListGroupItem>
          );
        });
        this.setState({ ...this.state, searchResults: resultsList });
      });
  }

  render() {
    return (
      <div>
        <input 
          type="text" 
          value={this.state.query} 
          placeholder="Search on Spotify..."
          onChange={this.handleQueryChange}
        />
        {' '}
        <Button 
          onClick={() => this.searchOnSpotify(this.state.query)}
          color="success"
        >
          Search
        </Button>
        <ListGroup>
          {this.state.searchResults}
        </ListGroup>
      </div>
    );
  }
}