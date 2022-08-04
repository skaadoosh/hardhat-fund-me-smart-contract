const { expect } = require('chai');
const { getNamedAccounts, ethers, network } = require('hardhat')
const { devNetworks } = require('../../helper-hardhat-config')

devNetworks.includes(network.name)
    ? console.log('running dev mode')
    :
    describe('fundMe staging', () => {
        let deployer
        let FundMe;
        const sendVal = ethers.utils.parseEther('0.001')
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            FundMe = await ethers.getContract('FundMe', deployer)
        });
        it('should fund successfully', async () => {
            console.log('funding..')
            const txRes = await FundMe.fund({ value: sendVal })
            console.log('waiting for confirmation')
            await txRes.wait(1)
            console.log('funded!')
            let contractBal = await FundMe.provider.getBalance(FundMe.address)
            console.log(`balance fetched: ${contractBal}`)
            expect(contractBal).to.equal(sendVal)
        });
        it('should withdraw successfully', async () => {

            console.log('withdraw request')
            const txRes = await FundMe.withdraw()
            console.log('waiting for confirmation')
            await txRes.wait(1)
            console.log('withdrawn')
            let contractBal = await FundMe.provider.getBalance(FundMe.address)
            console.log(`balance fetched: ${contractBal}`)
            expect(contractBal).to.equal(0)
        })
    });


