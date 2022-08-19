import { withRouter } from 'next/router';
import { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/campaign/factory';
import web3 from '../../ethereum/campaign/web3';

export default withRouter(
  class CampaignNew extends Component {
    state = {
      minimumContribution: '',
      errorMessage: '',
      loading: false,
    };

    onSubmit = async (event) => {
      event.preventDefault();
      this.setState({ loading: true, errorMessage: '' });

      try {
        const accounts = await web3.eth.getAccounts();
        await factory.methods
          .createCampaign(this.state.minimumContribution)
          .send({
            from: accounts[0],
          });
        this.props.router.push('/');
      } catch (err) {
        this.setState({ loading: false, errorMessage: err.message });
      }
    };

    render() {
      return (
        <>
          <h3>Create a Campaign</h3>

          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <label>Minimum Contribution</label>
              <Input
                label="wei"
                labelPosition="right"
                value={this.state.minimumContribution}
                onChange={(event) =>
                  this.setState({ minimumContribution: event.target.value })
                }
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
