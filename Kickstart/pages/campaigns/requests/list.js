import React, { Component } from "react";
import { Button, Icon, Label, Menu, Table } from 'semantic-ui-react';

import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import campaignProvider from "../../../ethereum/campaign";

class RequestList extends Component {
  static async getInitialProps(props) {
    // this statement is equivalent to "const campaignAddress = props.query.campaignAddress;"
    const { campaignAddress } = props.query;
    const campaign = campaignProvider(campaignAddress);

    const requestsCount = await campaign.methods.getRequestCount().call();

    // Solidity does NOT support retrieving a whole array which items are of a complex type
    // Request in our Campaign contract is of the type Struct which is a complex type
    // we cannot retrieve our array of requests in one call, so we need to iterate over the requests
    // and retrieve each of them one by one
    const requests = await Promise.all(
      // Promise.all() will acummulate all asynchronous calls which retrieve request at the given index
      Array(requestsCount).fill().map((element, index) => {
        return campaign.methods.requestList(index).call();
      })
    );

    console.log(requests);

    // this statement is equivalent to "return { campaignAddress: campaignAddress }"
    return { campaignAddress, requests, requestsCount };
  }

  render() {
    const { Header, Row, HeaderCell, Body} = Table;

    return (
      <Layout>
        <h3>Request List</h3>
        <Link route={`/campaigns/${this.props.campaignAddress}/requests/new`}>
          <a>
            <Button primary>Add Request</Button>
          </a>
        </Link>

        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalise</HeaderCell>
            </Row>
          </Header>
        </Table>

      </Layout>
    );
  }
}

export default RequestList;