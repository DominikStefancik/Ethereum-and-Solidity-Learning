import React, { Component } from "react";
import { Button } from "semantic-ui-react";

import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import campaignProvider from "../../../ethereum/campaign";

class RequestList extends Component {
  static async getInitialProps(props) {
    // this statement is equivalent to "const campaignAddress = props.query.campaignAddress;"
    const { campaignAddress } = props.query;
    const campaign = campaignProvider(campaignAddress);

    // this statement is equivalent to "return { campaignAddress: campaignAddress }"
    return { campaignAddress };
  }

  render() {
    return (
      <Layout>
        <h3>Request List</h3>
        <Link route={`/campaigns/${this.props.campaignAddress}/requests/new`}>
          <a>
            <Button primary>Add Request</Button>
          </a>
        </Link>

      </Layout>
    );
  }
}

export default RequestList;