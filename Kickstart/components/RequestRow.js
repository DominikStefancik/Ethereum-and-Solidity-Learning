import React, { Component } from "react";
import { Button, Table } from 'semantic-ui-react';

import web3 from "../ethereum/web3";
import { Router } from "../routes";

class RequestRow extends Component {
  onApprove = async () => {
    const { campaign, id } = this.props;
    const accounts = await web3.eth.getAccounts();

    await campaign.methods.approveRequest(id).send({
      from: accounts[0]
    });

    Router.replaceRoute(`/campaigns/${this.props.campaignAddress}/requests`);
  }

  onFinalise = async () => {
    const { campaign, id } = this.props;
    const accounts = await web3.eth.getAccounts();

    await campaign.methods.finalizeRequest(id).send({
      from: accounts[0]
    });

    Router.replaceRoute(`/campaigns/${this.props.campaignAddress}/requests`);
  }

  render() {
    const { Row, Cell } = Table;
    const { id, request, contributorsCount } = this.props;
    const readyToFinalise = request.approvalCount > contributorsCount / 2;
    let backgroundColor;

    if (request.isCompleted) {
      backgroundColor = "orange";
    } else if (readyToFinalise) {
      backgroundColor = "#4CBB17";
    } else {
      backgroundColor = "white";
    }

    return (
      <Row style={{ backgroundColor: backgroundColor }}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{request.approvalCount}/{contributorsCount}</Cell>
        <Cell>
          {request.isCompleted ? null : (
            <Button style={{ backgroundColor: "#4682B4" }} onClick={this.onApprove}>Approve</Button>
          )}
        </Cell>
        <Cell>
          {request.isCompleted ? null : (
            <Button style={{ backgroundColor: "#ACE894" }} onClick={this.onFinalise}>Finalise</Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;