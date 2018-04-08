import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export class SpotifyAuthButton extends Component {
  state = { shouldRedirect: false };
  /**
  * Creates an OAuth link to Spotify's API
  * @param {String} clientId: the applications client ID
  * @param {Array[String]} scopes: the required scopes of the application
  */
  createAuthUrl = () => {
    let url = "https://accounts.spotify.com/authorize";
    url += `?client_id=${this.props.clientId}`;
    url += "&response_type=token&show_dialog=true";
    url += `&redirect_uri=${this.props.redirectUri}`;
    url += "&scope=" + this.props.scopes.join(" ");
    return url;
  }

  componentDidMount = () => {
    console.log(window.location.hash);
    if (localStorage.getItem("accessToken") != null) {
      this.setState({ shouldRedirect: true });
    } 
    else if (window.location.hash.indexOf("#access_token=") > -1) {
      let token = window.location.hash.substring(14, window.location.hash.indexOf('&token_type=Bearer'));
      localStorage.setItem("accessToken", token);
      localStorage.setItem("tokenExpires", ((new Date()).getTime() + 3600 * 1000).toString());
      this.setState({ shouldRedirect: true });
    }
  }

  render() {
    return (
      <div>
        <a
          className="btn btn-success"
          href={this.createAuthUrl()}
        >
          Connect to Spotify
        </a>
        {this.state.shouldRedirect ? <Redirect to='/player' /> : ""}
      </div>
    );
  }
}