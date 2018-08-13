const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { bytecode, interface } = require("./compile");

// the purpose of the provider is to get access to the accounts on an ethereum network and
// unlock that account 
// Note: in this case we use 12 mnemonic word to unlock the account
const provider = new HDWalletProvider(
  "rail shove napkin hand cool grass ordinary behave pilot agent reason mystery",
  "https://rinkeby.infura.io/v3/48563856dfcb4e068564732cc8d4ee38"
);

const web3 = new Web3(provider);

let deploymentAccount;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  deploymentAccount = accounts[0];

  console.log("Attempting to deploy from account ", deploymentAccount);

  const deployedContract = await new web3.eth.Contract(JSON.parse(interface))
              .deploy({ data: "0x" + bytecode, arguments: ["Hi there!"] })
              .send({ from: deploymentAccount, gas: "1000000" });

  console.log("Contract deployed to address", deployedContract.options.address);
}

deploy();