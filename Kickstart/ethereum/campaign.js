// This file provides a contract instance of Campaign which can be used in any part of the app

import web3 from "./web3";
import Campaign from "./build/Campaign.json";

// a function which expects an address of a Campaign contract and returns the object of this contract
const campaignProvider = (campaignAddress) => {
  return new web3.eth.Contract(
    JSON.parse(Campaign.interface),
    campaignAddress
  );
}

export default campaignProvider;