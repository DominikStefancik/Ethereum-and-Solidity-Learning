import React, { Component } from "react";
import "./App.css";
import web3 from "./web3.config";
import lottery from "./lottery";

class App extends Component {
  state = { 
    manager: "",
    players: [],
    balance: ""
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    
    this.setState({ 
      manager: manager,
      players: players,
      balance: balance
    });
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by account with the address { this.state.manager }.
        </p>
        <p>
          There are currently { this.state.players.length } entered the lottery, competing to win
          { web3.utils.fromWei(this.state.balance, "ether") } ether.
        </p>
      </div>
    );
  }
}

export default App;