import React, { Component } from "react";
import { Button, Card } from "semantic-ui-react";

import Layout from "../components/Layout";
import campaignFactory from "../ethereum/factory";

// "Link" is a React component which allows us to input an anchor tag inside other React components
import { Link } from "../routes";

class CampaignIndex extends Component {
  // this method is Next.js specific and is called before a component is created
  static async getInitialProps() {
    const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();

    // this object is returned as "props" object when the component is rendered 
    return { campaigns: campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View campaign</a>
          </Link>
        ),
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

          <Link route="/campaigns/new">
            <a>
              <Button floated="right" content="Create Campaign" icon="add circle" primary />
            </a>
          </Link>

          <div>{this.renderCampaigns()}</div>
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;