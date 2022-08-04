require('dotenv').config({ path: __dirname + '/.env' })
require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
const path = require('path')

const GOERLI_API_KEY = process.env.GOERLI_API_KEY
const RINKEBY_API_KEY = process.env.RINKEBY_API_KEY
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: '0.8.9' }, { version: '0.6.9' }]
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${GOERLI_API_KEY}`,
      accounts: [METAMASK_PRIVATE_KEY]
    },
    rinkeby: {
      url: `https://eth-rinkeby.g.alchemy.com/v2/${RINKEBY_API_KEY}`,
      accounts: [METAMASK_PRIVATE_KEY],
      blockConfirmation: 6,
      chainId: 4,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: true,
    outputFile: 'gas-report.txt',
    noColors: true,
    currency: 'INR',
    //coinmarketcap: COINMARKETCAP_API_KEY,
    //token: 'MATIC'
  }
};
