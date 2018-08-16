const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledCampaignFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let testAccount;
let factoryContract;
let campaignAddress;
let campaignContract;

beforeEach(async () => {
  accounts = web3.eth.getAccounts();
  testAccount = accounts[0];

  // we use this way of creating a new contract Javascript object when we want to 
  // deploy the contract
  factoryContract = await new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface))
    .deploy({ data: compiledCampaignFactory.bytecode })
    .send({ from: testAccount, gas: "1000000" });

  // the send method will not return anything, that's why we need to get the new campaing differently  
  await factoryContract.methods.createCampaign("1000").send({
    from: testAccount, 
    gas: "1000000"
  });

  const deployedCampaigns = await factoryContract.methods.getDeployedCampaigns().call();
  campaignAddress = deployedCampaigns[0];

  // we use this way of creating a new contract Javascript object when the contract is already
  // deployed and we have its address
  campaignAddress = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface), 
    campaignAddress
  );
});