const { getNamedAccounts, deployments, network } = require("hardhat")
const { devNetworks, decimal, initAnswer } = require('../helper-hardhat-config')

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (devNetworks.includes(network.name)) {
        log('Local network detected. Deploying mocks...');
        await deploy('MockV3Aggregator', {
            log: true,
            from: deployer,
            args: [decimal, initAnswer],
        })
        log('Mocks deployed!');
        log('______________________________');
    }
}

module.exports.tags = ['all', 'mocks']