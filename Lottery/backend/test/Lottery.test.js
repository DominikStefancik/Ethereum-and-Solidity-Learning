const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require(web3);

const web3 = new Web3(ganache.provider());
const { bytecode, interface } = require("../compile");

let lotteryContract;
let accounts;
let creatorAccount;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  creatorAccount = accounts[0];
  lotteryContract = await web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: "0x" + bytecode})
    .send({ from: creatorAccount, gas: "1000000" })
});