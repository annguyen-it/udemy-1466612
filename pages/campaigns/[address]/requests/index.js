/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import Campaign from '../../../../ethereum/campaign/campaign';
import RequestRow from '../../../../components/request-row';

export default class RequestIndex extends Component {
  static async getInitialProps({ query }) {
    const { address } = query;
    const campaign = Campaign(address);
    const requestsCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestsCount))
        .fill()
        .map((_, i) => campaign.methods.requests(i).call())
    );

    return { address, requests, requestsCount, approversCount };
  }

  renderRow() {
    return this.props.requests.map((e, i) => (
      <RequestRow
        key={i}
        id={i}
        request={e}
        address={this.props.address}
        approversCount={this.props.approversCount}
      />
    ));
  }

  render() {
    return (
      <>
        <h3>Request list</h3>
        <Link href={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              Add request
            </Button>
          </a>
        </Link>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Recipient</Table.HeaderCell>
              <Table.HeaderCell>Approval Count</Table.HeaderCell>
              <Table.HeaderCell>Approve</Table.HeaderCell>
              <Table.HeaderCell>Finalize</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{this.renderRow()}</Table.Body>
        </Table>

        <div>Found {this.props.requestsCount} requests.</div>
      </>
    );
  }
}
