// This file provides a contract instance of Campaign factory which can be used in any part of the app

import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const campaignFactoryContract = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x9a8B0075507A602e15f02e800f2cb1120CBF7Ad5"
);

export default campaignFactoryContract;
