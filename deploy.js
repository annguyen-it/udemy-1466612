const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('../compile');

const provider = new HDWalletProvider(
  'item retire uncover relief vapor medal know custom utility century blame acquire',
  'https://rinkeby.infura.io/v3/939864a17ecc4a1db0d7016b7cb2bdad'
);
const web3 = new Web3(provider);

const deploy = async () => {
  accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ['Hi there!'] })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deploy to', result.options.address);
  provider.engine.stop();
};

deploy();
