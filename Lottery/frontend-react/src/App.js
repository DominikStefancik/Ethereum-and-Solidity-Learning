import React, { Component } from "react";
import "./App.css";
import web3 from "./web3.config";
import lottery from "./lottery";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { manager: "" };
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    
    this.setState({ manager: manager });
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by account with the address { this.state.manager }</p>
      </div>
    );
  }
}

export default App;
