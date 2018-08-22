import React, { Component } from "react";

import Layout from "../../components/Layout";
import campaignProvider from "../../ethereum/campaign";

class ShowCampaign extends Component {
  // this method is Next.js specific and is called before a component is created
  static async getInitialProps(props) {
    // this is the "campaignAddress" token from URL which we defined in the routes.js file  
    const campaignAddress = props.query.campaignAddress;
    const campaign = campaignProvider(campaignAddress);
    const summary = await campaign.methods.getSummary().call();

    // this object is returned as "props" object when the component is rendered 
    return {};
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Details</h3>
      </Layout>
    );
  }
}

export default ShowCampaign;