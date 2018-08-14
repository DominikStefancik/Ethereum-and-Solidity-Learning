const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { bytecode, interface } = require("../compile");

let lotteryContract;
let accounts;
let creatorAccount;
let player1Account;
let player2Account;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  creatorAccount = accounts[0];
  player1Account = accounts[1];
  player2Account = accounts[2];
  lotteryContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: "0x" + bytecode})
    .send({ from: creatorAccount, gas: "1000000" })
});

describe("Lottery contract deployment", () => {
  it("Lottery contract is deployed", () => {
    assert.ok(lotteryContract.options.address);
  });

  it("Manager address is the same as the address of the account which created the contract", async () => {
    const managerAddress = await lotteryContract.methods.manager().call();
    assert.strictEqual(managerAddress, creatorAccount); 
  });

  it("Lottery balance is zero after deployment", async () => {
    const lotteryBallance = await web3.eth.getBalance(lotteryContract.options.address);
    assert.strictEqual(lotteryBallance, "0");
  });
});

describe("Entering lottery", () => {
  it("One account is allowed to enter the lottery", async () => {
    await lotteryContract.methods.enter().send({ 
      from: player1Account, 
      // value represents an amount of "money" (wei, ether, etc.) sent
      // method "web3.utils.toWei" converts any other units to wei
      value: web3.utils.toWei("0.11", "ether")
    });
    
    const players = await lotteryContract.methods.getPlayers().call();
    assert.strictEqual(players.length, 1, "The list must contain exactly one player");
    assert.strictEqual(players[0], player1Account);
  });

  it("Multiple accounts are allowed to enter the lottery", async () => {
    await lotteryContract.methods.enter().send({ 
      from: creatorAccount, 
      value: web3.utils.toWei("1", "ether")
    });

    await lotteryContract.methods.enter().send({ 
      from: player1Account, 
      value: web3.utils.toWei("1", "ether")
    });

    await lotteryContract.methods.enter().send({ 
      from: player2Account,
      value: web3.utils.toWei("1", "ether")
    });
    
    const players = await lotteryContract.methods.getPlayers().call();
    assert.strictEqual(players.length, 3, "The list must contain exactly three players");
    assert.strictEqual(players[0], creatorAccount);
    assert.strictEqual(players[1], player1Account);
    assert.strictEqual(players[2], player2Account);
  });

  it("An account cannot enter the lottery without required minimum amount of ether", async () => {
    try {
      await lotteryContract.methods.enter().send({
        from: player1Account,
        value: 0
      });

      // if this assert is executed, then the account entered the lottery
      assert(false, "The account cannot enter the lottery");
    } catch (error) {
      assert(error); // we check if the error happened
    }
  })
});

describe("Picking up the winner of the lottery", () => {
  it("Only manager can pick up the winner", async () => {
    try {
      await lotteryContract.methods.pickWinner.send({
        from: player1Account
      })
      assert(false, "The account which didn't create the lottery cannot pick the winner");
    } catch (error) {
      assert(error);
    }
  });
});

describe("End to end tests", () => {
  it("Lottery contract sends money to the winner", async () => {
    let balanceBeforeTransaction = await web3.eth.getBalance(player1Account);

    await lotteryContract.methods.enter().send({
      from: player1Account,
      value: web3.utils.toWei("1", "ether")
    });

    let balanceAfterTransaction = await web3.eth.getBalance(player1Account);
    let difference = balanceBeforeTransaction - balanceAfterTransaction;
    assert(difference < web3.utils.toWei("1.5", "ether"));

    balanceBeforeTransaction = await web3.eth.getBalance(player1Account);
    await lotteryContract.methods.pickWinner().send({
      from: creatorAccount
    });

    balanceAfterTransaction = await web3.eth.getBalance(player1Account);
    difference = balanceAfterTransaction - balanceBeforeTransaction;
    assert(difference > web3.utils.toWei("0.8", "ether"));
  });

  it("Lottery contract resets the player array after picking up the winner", async () => {
    await lotteryContract.methods.enter().send({
      from: creatorAccount,
      value: web3.utils.toWei("1", "ether")
    });

    await lotteryContract.methods.enter().send({
      from: player1Account,
      value: web3.utils.toWei("1", "ether")
    });

    let players = await lotteryContract.methods.getPlayers().call();
    assert.strictEqual(players.length, 2);

    await lotteryContract.methods.pickWinner().send({
      from: creatorAccount
    });

    players = await lotteryContract.methods.getPlayers().call();
    assert.strictEqual(players.length, 0, "After picking up the winner the player list have to be empty");
  });

  it("Lottery balance is updated after players enter it", async () => {
    await lotteryContract.methods.enter().send({ 
      from: creatorAccount, 
      value: web3.utils.toWei("1", "ether")
    });

    await lotteryContract.methods.enter().send({ 
      from: player1Account, 
      value: web3.utils.toWei("1", "ether")
    });

    await lotteryContract.methods.enter().send({ 
      from: player2Account,
      value: web3.utils.toWei("1", "ether")
    });

    const lotteryBalance = await web3.eth.getBalance(lotteryContract.options.address);
    assert.strictEqual(lotteryBalance, web3.utils.toWei("3", "ether"));
  });
});