import React, { Component } from "react";
import { Button, Table } from 'semantic-ui-react';

import web3 from "../ethereum/web3";

class RequestRow extends Component {
  onApprove = async () => {
    const { campaign, id } = this.props;
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(id).send({
      from: accounts[0]
    });
  }

  render() {
    const { Row, Cell } = Table;
    const { id, request, contributorsCount } = this.props;

    return (
      <Row>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{request.approvalCount}/{contributorsCount}</Cell>
        <Cell>
          <Button color="green" basic onClick={this.onApprove}>Approve</Button>
        </Cell>
        <Cell>Finalise</Cell>
      </Row>
    );
  }
}

export default RequestRow;