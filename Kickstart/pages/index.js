import React, { Component } from "react";
import campaignFactory from "../ethereum/factory";

class CampaignIndex extends Component {
  async componentDidMount() {
    const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
    console.log(campaigns);
  }

  render() {
    return (
      <h1>Test</h1>
    );
  }
}

export default CampaignIndex;