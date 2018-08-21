import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // We are in a browser and Metamask is running
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server or a user is not running Metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/48563856dfcb4e068564732cc8d4ee38"
  );

  web3 = new Web3(provider);
}

export default web3;