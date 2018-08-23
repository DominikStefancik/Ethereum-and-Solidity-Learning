import React, { Component } from "react";
import { Card, Grid } from "semantic-ui-react";

import Layout from "../../components/Layout";
import ContributionForm from "../../components/ContributionForm";
import campaignProvider from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";

// the keys are "indexed" according to the order specified in the "getSummary" method
// in the Campaign contract 
const MINIMUM_CONTRIBUTION_KEY = "0";
const CAMPAIGN_BALANCE_KEY = "1";
const REQUESTS_COUNT_KEY = "2";
const CONTRIBUTORS_COUNT_KEY = "3";
const MANAGER_KEY = "4";

class ShowCampaign extends Component {
  // this method is Next.js specific and is called before a component is created
  // object "props" is specific for Next.js in this function and is different than the 
  // object "props" which is used by React compnents
  static async getInitialProps(props) {
    // this is the "campaignAddress" token from URL which we defined in the routes.js file  
    const campaignAddress = props.query.campaignAddress;
    const campaign = campaignProvider(campaignAddress);
    const summary = await campaign.methods.getSummary().call();

    // this object is returned as "props" object when the component is rendered
    // this object "props" is used by React compnents 
    return {
      campaignAddress: campaignAddress,
      minimumContribution: summary[MINIMUM_CONTRIBUTION_KEY],
      campaignBalance: summary[CAMPAIGN_BALANCE_KEY],
      requestsCount: summary[REQUESTS_COUNT_KEY],
      contributorsCount: summary[CONTRIBUTORS_COUNT_KEY],
      manager: summary[MANAGER_KEY]
    };
  }

  renderCards() {
    const items = [
      {
        header: this.props.manager,
        description: "Manager has created this campaign and can create a request to withdraw money",
        meta: "Address of manager",
        style: {
          overflowWrap: "break-word"
        }
      },
      {
        header: this.props.minimumContribution,
        description: "A minimum amount of money in order to contribute to the campaign to become " + 
          "a contributor and a request approver",
        meta: "Minimum Contribution (in wei)",
      },
      {
        header: this.props.requestsCount,
        description: "Requests try to withdraw money from the campaign contract. " + 
          "Requests must be approved by at least 51% of all contributors in order to be processed",
        meta: "Number of requests",
      },
      {
        header: this.props.contributorsCount,
        description: "A number of people who have already donated (contributed) to this campaign",
        meta: "Number of contributors",
      },
      {
        header: web3.utils.fromWei(this.props.campaignBalance, "ether"),
        description: "The balance is how much money has this campaign left to spend",
        meta: "Campaign Balance (in ether)",
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Details</h3>

        <Grid>
          <Grid.Column width={10}>
            {this.renderCards()}
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributionForm campaignAddress={this.props.campaignAddress}/>
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default ShowCampaign;