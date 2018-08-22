import React, { Component } from "react";
import { Button, Card } from "semantic-ui-react";

import Layout from "../components/Layout";
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
      <Layout>
        <div>
          <h3>Open Campaigns</h3>
          <Button floated="right" content="Create Campaign" icon="add circle" primary />
          <div>{this.renderCampaigns()}</div>
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;