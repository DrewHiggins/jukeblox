import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';

export class HomePage extends Component {
    constructor() {
        super();
        this.state = { choice: null }
    }

    render() {
        return (
            <div>
                <Button onClick={() => this.setState({ choice: '/player' })}>Start a Room</Button>
                <Button onClick={() => this.setState({ choice: '/request' })}>Join a Room</Button>
                {
                    this.state.choice !== null ?
                    <Redirect to={{ pathname: '/auth', state: { callbackLocation: this.state.choice } }} />
                    : ''
                }
            </div>
        );
    }
}