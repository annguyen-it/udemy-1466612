/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { withRouter } from 'next/router';
import { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../../../../ethereum/campaign/campaign';
import web3 from '../../../../ethereum/campaign/web3';

export default withRouter(
  class RequestNew extends Component {
    state = {
      value: '',
      description: '',
      recipient: '',
      loading: false,
      errorMessage: '',
    };

    static async getInitialProps({ query }) {
      const { address } = query;
      return { address };
    }

    onSubmit = async (event) => {
      event.preventDefault();

      const campaign = Campaign(this.props.address);
      const { description, value, recipient } = this.state;

      this.setState({ loading: true, errorMessage: '' });

      try {
        const accounts = await web3.eth.getAccounts();
        await campaign.methods
          .createRequest(
            description,
            web3.utils.toWei(value, 'ether'),
            recipient
          )
          .send({ from: accounts[0] });

        this.props.router.push(`/campaigns/${this.props.address}/requests`);
      } catch (err) {
        this.setState({ loading: false, errorMessage: err.message });
      }
    };

    render() {
      return (
        <>
          <Link href={`/campaigns/${this.state.address}/requests`}>
            <a>Back</a>
          </Link>
          <h3>Create a Request</h3>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <label>Description</label>
              <Input
                value={this.state.description}
                onChange={(e) => this.setState({ description: e.target.value })}
              />
            </Form.Field>

            <Form.Field>
              <label>Value in Ether</label>
              <Input
                value={this.state.value}
                onChange={(e) => this.setState({ value: e.target.value })}
              />
            </Form.Field>

            <Form.Field>
              <label>Recipient</label>
              <Input
                value={this.state.recipient}
                onChange={(e) => this.setState({ recipient: e.target.value })}
              />
            </Form.Field>

            <Message error header="Oops!" content={this.state.errorMessage} />

            <Button primary loading={this.state.loading}>
              Create
            </Button>
          </Form>
        </>
      );
    }
  }
);
