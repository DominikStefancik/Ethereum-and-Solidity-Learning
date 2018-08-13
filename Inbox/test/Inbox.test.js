const assert = require("assert");
const ganache = require("ganache-cli");

// this a Web3 constructor function which is used to create instances of Web3 library
// we can create more instances of Web3 library, each of them will be capable to connect to a different
// Ethereum network
const Web3 = require("web3");

// this constant represent an instance of web3 library
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

// NOTE: Almost every web3 method is assynchronous and returns a promise! 

let accounts;
let testAccount;
let inboxContract;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  testAccount = accounts[0];

  // Use one of those accounts to deploy a contract
  inboxContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ["Hi there!"] }) // the method "deploy" only creates an object
                                                          // which can be then deployed
    .send({ from: testAccount, gas: "1000000" }) // actually deploys a contract (object) to the network
});

describe("Inbox contract", () => {
  it("the contract is deployed", () => {
    // "assert.ok()" checks whether the argument is a truthy value
    assert.ok(inboxContract.options.address);
  });

  it("the contract has a default message", async () => {
    const message = await inboxContract.methods.message().call();
    assert.strictEqual(message, "Hi there!");
  });

  it("message of the contract can be changed", async () => {
    // the method "setMessage()" changes the contract data, that's why we need to call "send" with parameters
    await inboxContract.methods.setMessage("Hello").send({ from: testAccount });
    const message = await inboxContract.methods.message().call();
    assert.strictEqual(message, "Hello");
  });
});