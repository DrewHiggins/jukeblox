import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { 
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import Web3 from 'web3';
import { SongQueueAbi } from './contract_abis/SongQueue';

export class Player extends Component {
  constructor() {
    super();
    this.state = { 
      accessToken: null,
      selectedDeviceId: null,
      selectedPlaylist: null,
      devices: [],
      playlists: [],
      songQueue: [],
      fetching: true,
      partyStarted: false,
      wallet: null
    };
    this.web3 = new Web3(Web3.givenProvider);
    this.queueContract = new this.web3.eth.Contract(SongQueueAbi, "0x59ed41324E5d3820119571a21e8306CbD67AF528");
  }

  componentDidMount() {
    console.log(this.queueContract);
    this.queueContract.events.allEvents(this.handleSongAdd);
    let accessToken, devices, playlists;
    accessToken = localStorage.getItem("accessToken");
    let devicePromise = fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: { 
        'Authorization': 'Bearer ' + accessToken,
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => devices = res.devices)
    let playlistPromise = fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
      .then(res => res.json())
      .then(res => playlists = res.items);
    Promise.all([devicePromise, playlistPromise]).then(() => {
      this.setState({
        ...this.state,
        accessToken,
        devices,
        playlists,
        fetching: false
      });
    });
    this.web3.eth.getAccounts().then(accounts => {
      this.setState({ ...this.state, wallet: accounts[0]});
    });
  }

  startParty = () => {
    fetch('https://api.spotify.com/v1/me/player/play', {
      headers: { 'Authorization': 'Bearer ' + this.state.accessToken },
      body: JSON.stringify({
        'context_uri': this.state.selectedPlaylist.context_uri
      }),
      method: 'PUT'
    })
      .then(() => this.setState({ ...this.state, partyStarted: true }));
  }

  tokenExpired = () => {
    let expireTime = parseInt(localStorage.getItem("tokenExpires"), 10);
    return expireTime < (new Date()).getTime();
  }

  reauth = () => {
    localStorage.clear();
    return <Redirect to="/auth" />;
  }

  handleSongAdd = (err, e) => {
    let songId = this.web3.utils.hexToAscii(e.returnValues.songId);
    fetch(`https://api.spotify.com/v1/users/drewhiggins/playlists/${this.state.selectedPlaylist.id}/tracks?uris=spotify:track:${songId}`, {
      headers: {
        'Authorization': 'Bearer ' + this.state.accessToken
      },
      method: 'POST'
    });
  }

  render() {
    let deviceList = this.state.devices.map((device, index) => {
      return (
        <ListGroupItem
          key={index}
          onClick={() => this.setState({ ...this.state, selectedDeviceId: device.id })}
        >
          {device.name}
        </ListGroupItem>
      );
    });
    let playlistList = this.state.playlists.map((playlist) => {
      return (
        <ListGroupItem
          key={playlist.id}
          onClick={() => this.setState({ ...this.state, selectedPlaylist: playlist })}
        >
          {playlist.name}
        </ListGroupItem>
      );
    });
    return (
      <div>
        {!this.state.partyStarted ? <Button 
          color="primary" 
          className="btn btn-block" 
          onClick={this.startParty}
        >
          Get the Party Started 🎉
        </Button> : ''}
        <Modal isOpen={this.state.password !== null && this.state.selectedDeviceId === null}>
          <ModalHeader>Select Device</ModalHeader>
          <ModalBody>
            <ListGroup>
              {this.state.fetching ? <em>Loading...</em> : deviceList}
            </ListGroup>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.selectedDeviceId !== null && this.state.selectedPlaylist === null}>
          <ModalHeader>Select Playlist</ModalHeader>
          <ModalBody>
            <ListGroup>
              {playlistList}
            </ListGroup>
          </ModalBody>
        </Modal>
        {this.tokenExpired() ? this.reauth() : ""}
      </div>
    );
  }
}