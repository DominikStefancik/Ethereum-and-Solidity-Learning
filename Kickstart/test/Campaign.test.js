const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledCampaignFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let creator;
let contributor;
let recipient;
let factoryContract;
let campaignAddress;
let campaignContract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  creator = accounts[0];
  contributor = accounts[1];
  recipient = accounts[2];

  // we use this way of creating a new contract Javascript object when we want to 
  // deploy the contract
  factoryContract = await new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface))
    .deploy({ data: compiledCampaignFactory.bytecode })
    .send({ from: creator, gas: "1000000" });

  // the send method will not return anything, that's why we need to get the new campaing differently  
  await factoryContract.methods.createCampaign("1000").send({
    from: creator, 
    gas: "1000000"
  });

  const deployedCampaigns = await factoryContract.methods.getDeployedCampaigns().call();
  campaignAddress = deployedCampaigns[0];

  // we use this way of creating a new contract Javascript object when the contract is already
  // deployed and we have its address
  campaignContract = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface), 
    campaignAddress
  );
});

describe("Campaign factory contract", () => {
  it("The campaign factory is deployed", () => {
    assert.ok(factoryContract.options.address);
  });

  it("A campaign created by the factory is deployed", () => {
    assert.ok(campaignContract.options.address);
  });

  it("Creator of a campaign is its manager", async () => {
    const manager = await campaignContract.methods.manager().call();
    assert.strictEqual(manager, creator);
  });
});

describe("Campaign contract", () => {
  it("People can contribute to a campaign", async () => {
    await campaignContract.methods.contribute().send({ 
      from: contributor,
      value: "1100" 
    });

    // "contributors" is a mapping and we can only use it fo lookup
    // by calling "contributors(contributor)" we search a value from the mapping
    const isContributor = await campaignContract.methods.contributors(contributor).call();
    assert(isContributor);
  });

  it("A person needs to provide minimum amount of money to become a contributor", async () => {
    try {
      await campaignContract.methods.contribute().send({ 
        from: contributor,
        value: "10" 
      });

      assert(false, "The amount of contributed money is less than a minimum");
    } catch (error) {
      assert(error); // we check if the error happened
    }
  });
});

describe("Payment request", () => {
  it("A manager can create a payment request", async () => {
    await campaignContract.methods
      .createRequest("Buy batteries", "2000", recipient)
      .send({ from: creator, gas: "1000000"});

    const request = await campaignContract.methods.requestList(0).call();
    assert.ok(request);
    assert.strictEqual("Buy batteries", request.description);
    assert.strictEqual("2000", request.value);
    assert.strictEqual(recipient, request.recipient);
  });
});

describe("End to end tests", () => {
  it("A request is processed", async () => {
    await campaignContract.methods.contribute().send({ 
      from: contributor,
      value: web3.utils.toWei("10", "ether") 
    });

    await campaignContract.methods
      .createRequest("Buy batteries", web3.utils.toWei("5", "ether"), recipient)
      .send({ from: creator, gas: "1000000"});
    const request = await campaignContract.methods.requestList(0).call();

    await campaignContract.methods.approveRequest(0).send({ from: contributor, gas: "1000000"});

    await campaignContract.methods.finalizeRequest(0).send({ from: creator, gas: "1000000"});

    let balance = await web3.eth.getBalance(recipient);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});