import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { HomePage } from './HomePage';
import { Player } from './Player';
import { SPOTIFY_CLIENT_ID } from './secrets';
import { SpotifyAuthButton } from './SpotifyAuthButton';
import { RequestView } from './RequestView';

class App extends Component {
  render() {
    let scopes = ['user-modify-playback-state', 'user-read-playback-state'];
    return (
      <Container>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/player" component={Player} />
        <Route exact path="/request" component={RequestView} />
        <Route exact path="/auth(#access_token=)?" render={() => (
          <SpotifyAuthButton
            redirectUri="http://localhost:3000/auth"
            clientId={SPOTIFY_CLIENT_ID}
            scopes={scopes}
          />
        )}>
        </Route>
      </Container>
    );
  }
}

export default App;
