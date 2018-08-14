import web3 from "./web3.config";

const contractAddress = "0x19bc9C8F7b4a97f21Ca91721ea684B504F241EdA";
const contractABI = [
  {
    "constant":true,
    "inputs":[],
    "name":"manager",
    "outputs":[{"name":"","type":"address"}],
    "payable":false,
    "stateMutability":"view",
    "type":"function"
  },
  {
    "constant":false,
    "inputs":[],
    "name":"pickWinner",
    "outputs":[],
    "payable":false,
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "constant":true,
    "inputs":[],
    "name":"getPlayers",
    "outputs":[{"name":"","type":"address[]"}],
    "payable":false,
    "stateMutability":"view",
    "type":"function"
  },
  {
    "constant":false,
    "inputs":[],
    "name":"enter",
    "outputs":[],
    "payable":true,
    "stateMutability":"payable",
    "type":"function"
  },
  {
    "constant":true,
    "inputs":[{"name":"","type":"uint256"}],
    "name":"players",
    "outputs":[{"name":"","type":"address"}],
    "payable":false,
    "stateMutability":"view",
    "type":"function"},
    {"inputs":[],
    "payable":false,
    "stateMutability":"nonpayable","type":"constructor"
  }
];

// this will create a local copy of our contract which is deployed on the Rinkeby Test network
const lotteryContract = new web3.eth.Contract(contractABI, contractAddress);

export default lotteryContract;