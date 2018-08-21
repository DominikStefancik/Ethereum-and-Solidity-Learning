import React, { Component } from "react";
import campaignFactory from "../ethereum/factory";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();

    // this object is returned as "props" object when the component is rendered 
    return { campaigns: campaigns };
  }

  render() {
    return (
      <div>{this.props.campaigns}</div>
    );
  }
}

export default CampaignIndex;