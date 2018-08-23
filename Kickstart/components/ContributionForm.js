import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";

import campaignProvider from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class ContributionForm extends Component {
  state = {
    value: "",
    errorMessage: "",
    contributing: false
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ 
      contributing: true,
      errorMessage: ""
    });

    const campaign = campaignProvider(this.props.campaignAddress);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether")
      });

      Router.replaceRoute(`/campaigns/${this.props.campaignAddress}`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ 
      contributing: false,
      value: ""
    });
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to contribute</label>
          <Input label="ether" labelPosition="right" value={this.state.value} 
                 onChange={event => this.setState({ value: event.target.value })}/>
        </Form.Field>
        <Button primary loading={this.state.contributing} disabled={this.state.contributing}>Contribute!</Button>
        <Message error header="Error while contributong to the campaign" content={this.state.errorMessage} />
      </Form>
    );
  }
}

export default ContributionForm;