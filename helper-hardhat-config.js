const networkConfig = {
    4: {
        name: 'rinkeby',
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
    }
}

const devNetworks = ['hardhat', 'localhost'];

const decimal = 8;
const initAnswer = 300000000000

module.exports = {
    networkConfig,
    devNetworks,
    decimal,
    initAnswer
}