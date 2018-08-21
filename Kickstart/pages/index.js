import React, { Component } from "react";
import { Card } from "semantic-ui-react";

import campaignFactory from "../ethereum/factory";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();

    // this object is returned as "props" object when the component is rendered 
    return { campaigns: campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: <a>View campaign</a>,
        fluid: true
      };
    });

    return <Card.Group items={items} />
  }

  render() {
    return (
      <div>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css" />
        <div>{this.renderCampaigns()}</div>
      </div>
    );
  }
}

export default CampaignIndex;