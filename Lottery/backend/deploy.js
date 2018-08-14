const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { bytecode, interface } = require("./compile");

const provider = new HDWalletProvider(
  "rail shove napkin hand cool grass ordinary behave pilot agent reason mystery",
  "https://rinkeby.infura.io/v3/48563856dfcb4e068564732cc8d4ee38"
);

const web3 = new Web3(provider);

let deploymentAccount;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  deploymentAccount = accounts[0];

  console.log("Attempting to deploy from account", deploymentAccount);

  const deployedContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: "0x" + bytecode })
    .send({ from: deploymentAccount, gas: "1000000" });

  console.log("ABI of the deployed contract:\n", interface);  
  console.log("Contract deployed to address", deployedContract.options.address);
}

deploy();