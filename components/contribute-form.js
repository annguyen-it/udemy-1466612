import { withRouter } from 'next/router';
import { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign/campaign';
import web3 from '../ethereum/campaign/web3';

export default withRouter(
  class ContributeForm extends Component {
    state = {
      value: '',
      errorMessage: '',
      loading: false,
    };

    onSubmit = async (event) => {
      event.preventDefault();
      const address = this.props.address;
      const campaign = Campaign(address);

      this.setState({ loading: true, errorMessage: '' });

      try {
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.contribute().send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.value, 'ether'),
        });

        this.props.router.replace(`/campaigns/${address}`);
      } catch (err) {
        this.setState({ errorMessage: err.message });
      }

      this.setState({ loading: false });
    };

    render() {
      return (
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Amount to Contribute</label>
            <Input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
              label="ether"
              labelPosition="right"
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />

          <Button primary loading={this.state.loading}>
            Contribute!
          </Button>
        </Form>
      );
    }
  }
);
