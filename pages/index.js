/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import React, { Component } from 'react';
import { Button, Card } from 'semantic-ui-react';
import factory from '../ethereum/campaign/factory';

export default class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => ({
      header: address,
      description: <Link href={`/campaigns/${address}`}>View Campaign</Link>,
      fluid: true,
    }));

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <div>
        <h3>Open campaigns</h3>

        <Link href={'/campaigns/new'}>
          <a>
            <Button
              floated="right"
              content="Create Campaign"
              icon="add circle"
              primary
            />
          </a>
        </Link>

        {this.renderCampaigns()}
      </div>
    );
  }
}
