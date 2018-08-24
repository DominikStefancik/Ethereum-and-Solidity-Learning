import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";

import Layout from "../../../components/Layout";
import campaignProvider from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";


class NewRequest extends Component {
  state = {
    description: "",
    value: "",
    recipient: "",
    errorMessage: "",
    creatingRequest: false
  };

  static async getInitialProps(props) {
    const { campaignAddress } = props.query;

    return { campaignAddress };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ 
      creatingRequest: true,
      errorMessage: ""
    });

    const campaign = campaignProvider(this.props.campaignAddress);
    try {
      const accounts = await web3.eth.getAccounts();
      const { description, value, recipient } = this.state;
      await campaign.methods.createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0]
        });

      Router.pushRoute(`/campaigns/${this.props.campaignAddress}/requests`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ 
      creatingRequest: false
    });
  }

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
          <a>
            Back to Request List
          </a>
        </Link>
        <h3>New Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input value={this.state.description} 
                  onChange={event => this.setState({ description: event.target.value })}/>
          </Form.Field>
          <Form.Field>
            <label>Amount in ether</label>
            <Input label="ether" labelPosition="right" value={this.state.value} 
                  onChange={event => this.setState({ value: event.target.value })}/>
          </Form.Field>
          <Form.Field>
            <label>Recipient address</label>
            <Input value={this.state.recipient} 
                  onChange={event => this.setState({ recipient: event.target.value })}/>
          </Form.Field>
          <Button primary loading={this.state.creatingRequest} disabled={this.state.creatingRequest}>
            Create Request!
          </Button>
          <Message error header="Error while creating a request" content={this.state.errorMessage} />
        </Form>
      </Layout>
    );
  }
}

export default NewRequest;