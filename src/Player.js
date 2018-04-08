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

export class Player extends Component {
  state = { 
    accessToken: null,
    selectedDeviceId: null,
    devices: []
  };

  componentDidMount() {
    this.setState({ ...this.state, accessToken: localStorage.getItem("accessToken") }, () => {
      fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: { 
          'Authorization': 'Bearer ' + this.state.accessToken,
          'Accept': 'application/json'
        }
      }).then((res) => res.json())
        .then(res => this.setState({ ...this.state, devices: res.devices }));
    });
  }

  playTrack = (trackId) => {
    fetch('https://api.spotify.com/v1/me/player/play', {
      headers: { 'Authorization': 'Bearer ' + this.state.accessToken },
      body: JSON.stringify({
        uris: [trackId]
      }),
      method: 'PUT'
    });
  }

  tokenExpired = () => {
    let expireTime = parseInt(localStorage.getItem("tokenExpires"));
    return expireTime < (new Date()).getTime();
  }

  reauth = () => {
    localStorage.clear();
    return <Redirect to="/auth" />;
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
    return (
      <div>
        <h1>Player goes here</h1>
        <pre>token: {this.state.accessToken}</pre>
        <Button onClick={() => this.playTrack("spotify:track:5AiNZnMDCWwujIENPj9PV9")}>
          Play Radiohead
        </Button>
        <Modal isOpen={this.state.selectedDeviceId === null}>
          <ModalHeader>Select Device</ModalHeader>
          <ModalBody>
            <ListGroup>
              {deviceList}
            </ListGroup>
          </ModalBody>
        </Modal>
        {this.tokenExpired() ? this.reauth() : ""}
      </div>
    );
  }
}