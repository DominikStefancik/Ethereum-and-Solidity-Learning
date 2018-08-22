// This file provides a contract instance of Campaign factory which can be used in any part of the app

import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const campaignFactoryContract = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x57dC8F46629ad6780073b509184d2701EeD256Aa"
);

export default campaignFactoryContract;
