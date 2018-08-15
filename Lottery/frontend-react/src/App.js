import React, { Component } from "react";
import "./App.css";
import web3 from "./web3.config";
import lottery from "./lottery";

class App extends Component {
  state = { 
    manager: "",
    newPlayer: "",
    players: [],
    balance: "",
    bettingAmount: ""
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const accounts = await web3.eth.getAccounts();
    // we assume that the first account of whoever visits the page is the account
    // he wants to use for betting
    const newPlayer = accounts[0];
    
    this.setState({ 
      manager: manager,
      newPlayer: newPlayer,
      players: players,
      balance: balance,
      message: ""
    });
  }

  // we declare this function as an arrow function so we don't have problems to work with "this" variable
  // "this" will now point to our component
  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ message: "Waiting for the transaction to be sent to the network..." });

    await lottery.methods.enter().send({
      from: this.state.newPlayer, 
      value: web3.utils.toWei(this.state.bettingAmount, "ether")
    });

    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ 
      players: players,
      balance: balance,
      message: "The player " + this.state.newPlayer + " has entered the lottery!" 
    });
  }

  pickWinner = async (event) => {
    this.setState({ message: "Picking the winner..." });

    await lottery.methods.pickWinner().send({
      from: this.state.manager
    });

    this.setState({ 
      players: [],
      balance: "",
      message: "The winner has been picked!" 
    });
  }

  render() {
    const playersList = this.state.players.map((player) =>
      <li>{player}</li>
    );

    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by account with the address { this.state.manager }.
        </p>
        <p>
          There are currently { this.state.players.length } players who entered the lottery, competing to 
          win { web3.utils.fromWei(this.state.balance, "ether") } ether.
        </p>
        <p>
          Players:<br/>
          <ul>{playersList}</ul>
        </p>
        <hr/>
        <form onSubmit={this.onSubmit}>
          <h4>How about trying your luck and win some coins?</h4>
          <div>
            <label>Amount of ether to enter the lottery:</label>
            <input value={this.state.bettingAmount} 
              onChange={event => this.setState({ bettingAmount: event.target.value })}/>
          </div>
          <button>Enter</button>
        </form>
        { this.state.newPlayer == this.state.manager &&
          <div>
            <hr/>
            <h4>Ready to pick a winner?</h4>
            <button onClick={this.pickWinner}>Pick a winner!</button>
          </div>
        }
        <hr/>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
