import React, { Component } from 'react';
import { SearchView } from './SearchView';
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Row
} from 'reactstrap';
import Web3 from 'web3';
import { SongQueueAbi } from './contract_abis/SongQueue';

export class RequestView extends Component {
  constructor() {
    super();
    this.state = { 
      selectedSong: null,
      wallet: null,
      estimatedCosts: 0
    };
    this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    this.web3 = new Web3(this.web3Provider);
    this.contract = new this.web3.eth.Contract(SongQueueAbi, "0x59ed41324E5d3820119571a21e8306CbD67AF528");
  }

  componentDidMount() {
    this.web3.eth.getAccounts()
      .then(accounts => {
        this.setState({ ...this.state, wallet: accounts[0]}, () => {
          this.estimateRequestCost().then(cost => {
            this.setState({ ...this.state, estimatedCosts: cost });
          });
        });
      });
  }

  /**
   * Converts a hexadecimal string to an ASCII string
   * @param str {string} Hex byte string (exclude '0x')
   * @returns {string}
   */
  a2hex = (str) => {
    var arr = [];
    for (var i = 0, l = str.length; i < l; i ++) {
      var hex = Number(str.charCodeAt(i)).toString(16);
      arr.push(hex);
    }
    return arr.join('');
  }

  selectSong = (song) => {
    this.setState({ ...this.state, selectedSong: song });
  }

  /**
   * Estimates the cost (in ETH) to call the specified method
   * @param method: A contract method from the predefined Ethereum contract object
   * @return {Promise} Resolves to a Number representing the price 
   */
  estimateRequestCost = (method) => {
    let gas, gasPrice;
    return this.contract.methods.addSong(this.state.wallet, '0x123456').estimateGas({ from: this.wallet })
      .then(amt => {
        gas = amt;
        return this.web3.eth.getGasPrice()
      })
      .then(price => {
        gasPrice = price;
        return this.web3.utils.fromWei(gasPrice, 'ether') * gas;
      });
  }

  submitRequest = () => {
    let song = this.web3.utils.fromAscii(this.state.selectedSong.id);
    console.log(song);
    this.contract.methods.addSong(this.wallet, song).call()
      .then(console.log);
  }

  render() {
    let selectedSong = "";
    if (this.state.selectedSong) {
      selectedSong = this.state.selectedSong.name;
    }

    return (
      <div>
        <SearchView
          accessToken={localStorage.getItem("accessToken")}
          selectSong={this.selectSong}
        />
        <Modal isOpen={this.state.selectedSong !== null}>
          <ModalHeader>Request {selectedSong}</ModalHeader>
          <ModalBody>
            <p>You are requesting to play "{selectedSong}" in the group
            {this.props.groupName}. Below is the total cost for this
            transaction.</p>
            <Row>
              <Col xs={7}>
                Request Cost
              </Col>
              <Col xs={5} style={{ textAlign: 'right' }}>
                <strong>2 Jukebucks</strong>
              </Col>
            </Row>
            <Row>
              <Col xs={7}>
                Transaction Cost
              </Col>
              <Col xs={5} style={{ textAlign: 'right' }}>
                <strong>{this.state.estimatedCosts} ETH</strong>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="danger">Cancel</Button>
            <Button color="success" onClick={this.submitRequest}>Submit Request</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}