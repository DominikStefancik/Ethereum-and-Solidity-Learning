import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";

import Layout from "../../components/Layout"
import campaignFactory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

class NewCampaign extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    creatingCampaign: false
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ creatingCampaign: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaignFactory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        });
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    
    this.setState({ creatingCampaign: false });
  }

  render() {
    return (
      <Layout>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <h3>Create a Campaign!</h3>
          <Form.Field>
            <label>Minimun Contribution (in wei)</label>
            <Input 
              label="wei" 
              labelPosition="right" 
              value={this.state.minimumContribution}
              onChange={event => this.setState({ minimumContribution: event.target.value })} />
          </Form.Field>
          <Button type='submit' primary loading={this.state.creatingCampaign}>Create!</Button>
          <Message error header="Error while creating a campaign" content={this.state.errorMessage} />
        </Form>
      </Layout>  
    );
  }
}

export default NewCampaign;