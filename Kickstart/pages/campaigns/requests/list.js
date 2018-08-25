import React, { Component } from "react";
import { Button, Icon, Label, Menu, Table } from 'semantic-ui-react';

import Layout from "../../../components/Layout";
import RequestRow from "../../../components/RequestRow";
import { Link } from "../../../routes";
import campaignProvider from "../../../ethereum/campaign";

class RequestList extends Component {
  static async getInitialProps(props) {
    // this statement is equivalent to "const campaignAddress = props.query.campaignAddress;"
    const { campaignAddress } = props.query;
    const campaign = campaignProvider(campaignAddress);

    const requestsCount = await campaign.methods.getRequestCount().call();
    const contributorsCount = await campaign.methods.contributorsCount().call();

    // Solidity does NOT support retrieving a whole array which items are of a complex type
    // Request in our Campaign contract is of the type Struct which is a complex type
    // we cannot retrieve our array of requests in one call, so we need to iterate over the requests
    // and retrieve each of them one by one
    const requests = await Promise.all(
      // Promise.all() will acummulate all asynchronous calls which retrieve request at the given index
      Array(parseInt(requestsCount)).fill().map((element, index) => {
        return campaign.methods.requestList(index).call();
      })
    );

    // a statement "return { campaign }" is equivalent to "return { campaign: campaign }"
    return { campaign, campaignAddress, requests, requestsCount, contributorsCount };
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return ( 
        <RequestRow
          key={index}
          id={index}
          request={request}
          campaign={this.props.campaign}
          campaignAddress={this.props.campaignAddress}
          contributorsCount={this.props.contributorsCount}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <Link route={`/campaigns/${this.props.campaignAddress}`}>
          <a>
            Back to the campaign
          </a>
        </Link>
        <h3>Request List</h3>
        <Link route={`/campaigns/${this.props.campaignAddress}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>Add Request</Button>
          </a>
        </Link>

        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount (in ether)</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalise</HeaderCell>
            </Row>
          </Header>

          <Body>
            {this.renderRows()}
          </Body>
        </Table>
        <div>Found {this.props.requestsCount} requests</div>
      </Layout>
    );
  }
}

export default RequestList;