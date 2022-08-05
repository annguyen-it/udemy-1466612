const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

describe('Lottery Contract', () => {
  let accounts;
  let lottery;

  beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    lottery = await new web3.eth.Contract(abi)
      .deploy({ data: evm.bytecode.object })
      .send({ from: accounts[0], gas: '1000000' });
  });

  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(players.length, 1);
  });

  it('allows multiple accounts to enter', async () => {
    const value = web3.utils.toWei('0.02', 'ether');
    await lottery.methods.enter().send({
      from: accounts[0],
      value
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(players.length, 3);
  });

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('only manager can call pickWinner', async () => {
    const value = web3.utils.toWei('0.02', 'ether');
    await lottery.methods.enter().send({
      from: accounts[0],
      value
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value
    });

    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0],
        value: 0
      });
      assert(true);
    } catch (err) {
      assert(false);
    }
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
        value: 0
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('sends money to winner and resets the players array', async () => {
    const account = accounts[0];
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    });

    const initialBalance = await web3.eth.getBalance(account);
    await lottery.methods.pickWinner().send({ from: account });
    const finalBalance = await web3.eth.getBalance(account);
    const difference = finalBalance - initialBalance;
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert(difference > web3.utils.toWei('1.99', 'ether'));
    assert(players.length === 0);
  });
});
