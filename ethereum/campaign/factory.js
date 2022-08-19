import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0xF2D7905d4854bD65E0A923dD908C9bA3DA432ab5'
);

export default instance;
