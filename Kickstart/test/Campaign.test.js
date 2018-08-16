const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledCampaignFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factoryContract;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = web3.eth.getAccounts();
  factoryContract = await new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface))
    .deploy({ data: compiledCampaignFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

});