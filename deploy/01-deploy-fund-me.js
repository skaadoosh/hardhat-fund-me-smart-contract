const { network, run } = require("hardhat")
const { networkConfig, devNetworks } = require('../helper-hardhat-config')

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let priceFeedAddr;
    if (devNetworks.includes(network.name)) {
        const ethUsdAggregator = await get('MockV3Aggregator');
        priceFeedAddr = ethUsdAggregator.address;
        log(priceFeedAddr)
    } else {
        priceFeedAddr = networkConfig[chainId]['ethUsdPriceFeed']
    }

    const priceConverter = await deploy('priceConverter', { from: deployer });

    const fundMe = await deploy('FundMe', {
        from: deployer,
        log: true,
        args: [priceFeedAddr],
        libraries: {
            priceConverter: priceConverter.address
        },
        waitConfirmation: network.config.blockConfirmation || 1,
    })
    log('deployed__________________________________');

    if (!devNetworks.includes(network.name)) {
        await run('verify:verify', {
            address: fundMe.address,
            constructorArguments: [priceFeedAddr],
            libraries: {
                priceConverter: priceConverter.address
            }
        })
    }
}

module.exports.tags = ['all', 'fundme']