const helper = require('./helper')
const path = require('path')

const { Gateway, Wallets } = require('fabric-network');
const walletPath = path.join(__dirname, 'wallet');

const org1UserId = 'ufsc';
const channelName = 'channel1';
const chaincodeName = 'basic';

class LedgerAction {

  static async exec(method, params = null) {
    try {
      const ccp = helper.buildCCPOrg1();
      const wallet = await helper.buildWallet(Wallets, walletPath);
      const gateway = new Gateway();

      await gateway.connect(ccp, {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true }
      });

      const network = await gateway.getNetwork(channelName);
      const contract = network.getContract(chaincodeName);

      let result

      if (method === 'GetAllAssets') {
        result = await LedgerAction.getAllBlocks(contract)
      }
      if (method === 'CreateAsset') {
        result = await LedgerAction.createBlock(contract, params)
      }
      // disconnect form the network
      gateway.disconnect();

      return result
    }
    catch (e) {
      throw new Error(e)
    }
  }

  static async getAllBlocks(contract) {
    const result = await contract.evaluateTransaction('GetAllAssets');
    return JSON.parse(result)
  }

  static async createBlock(contract, params) {
    const { fileContent, owner, timestamp, id, fileName } = params
    const result = await contract.submitTransaction('CreateAsset', fileContent, fileName, owner, timestamp, id);
    return helper.prettyJSONString(result.toString())
  }
}

module.exports = LedgerAction;
