/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { Component } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import ContributeForm from '../../../components/contribute-form';
import Campaign from '../../../ethereum/campaign/campaign';
import web3 from '../../../ethereum/campaign/web3';

export default class CampaignDetails extends Component {
  static async getInitialProps(props) {
    const address = props.query.address;
    const campaign = Campaign(address);
    const summary = await campaign.methods.getSummary().call();

    return {
      address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount,
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description:
          'You must contribute at least this much wei to become an approver',
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description:
          'A request tries to withdraw money from the contract. Requests must be approved by approvers',
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'Number of people who already donated to this campaign',
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign balance (ether)',
        description:
          'The balance is how much money this campaign has left to spend',
      },
    ];

    return <Card.Group items={items}></Card.Group>;
  }

  render() {
    return (
      <>
        <h3>Campaign Details</h3>

        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link href={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary> View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}
