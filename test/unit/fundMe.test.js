const { deployments, getNamedAccounts, ethers, network } = require('hardhat')
const { expect } = require('chai')
const { devNetworks } = require('../../helper-hardhat-config')

!devNetworks.includes(network.name)
    ? console.log('running on live net')
    :
    describe("FundMe", () => {
        let Fundme;
        let deployer;
        let MockV3Aggregator;
        const sendValue = ethers.utils.parseEther('1')
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(['all'])
            MockV3Aggregator = await ethers.getContract('MockV3Aggregator', deployer)
            Fundme = await ethers.getContract('FundMe', deployer)
        });
        describe("constructor", () => {
            it('sets aggregator address correctly', async () => {
                const addr = await Fundme.getPriceFeedAddr();
                expect(addr).to.equal(MockV3Aggregator.address)
            });
        })
        describe('fund', () => {
            it('reverts if sent amount not met minimum amount', async () => {
                await expect(Fundme.fund()).to.be.revertedWith('Please fund more')
            });
            it('updates amtDonated data structure', async () => {
                await Fundme.fund({ value: sendValue })
                const res = await Fundme.getAmountDonated(deployer);
                expect(res).to.equal(sendValue)
            });
        });
        describe('withdraw', () => {
            beforeEach(async () => {
                await Fundme.fund({ value: sendValue })
            })
            it('should withdraw from contract to owner', async () => {
                //before withdraw:
                const beforeContractBal = await Fundme.provider.getBalance(Fundme.address)
                const beforeDeployerBalance = await Fundme.provider.getBalance(deployer)
                //witdraw
                const txRes = await Fundme.withdraw({ from: deployer })
                const txReciept = await txRes.wait(1)
                //after withdraw:
                const gasCost = txReciept.gasUsed * txReciept.effectiveGasPrice
                const afterContractBal = await Fundme.provider.getBalance(Fundme.address)
                const afterDeployerBalance = await Fundme.provider.getBalance(deployer)
                //expect
                expect(afterContractBal).to.equal(0)
                expect(afterDeployerBalance).to.equal(beforeDeployerBalance.add(beforeContractBal).sub(gasCost))
            });
            it('should reset funders and amtDonated data structures', async () => {
                const accounts = await ethers.getSigners();
                let fundMeConnectedContract;
                let i = 1;
                for (i; i < 6; i++) {
                    fundMeConnectedContract = await Fundme.connect(accounts[i])
                    await fundMeConnectedContract.fund({ value: sendValue })
                }
                const lastCallAddr = await fundMeConnectedContract.getFunder(i - 1)
                const amtdonated = await Fundme.provider.getBalance(deployer)

                expect(lastCallAddr).to.equal(accounts[i - 1].address)

                //withdraw:
                const txRes = await Fundme.withdraw()
                //after withdraw:
                await expect(fundMeConnectedContract.getFunder(0)).to.be.reverted;

            });
            it('should only allow withdraw if contract owner', async () => {
                const accounts = await ethers.getSigners();
                let fundMeConnectedContract = await Fundme.connect(accounts[1]);
                await fundMeConnectedContract.fund({ value: sendValue })
                //const txRes = await fundMeConnectedContract.withdraw()

                await expect(fundMeConnectedContract.withdraw()).to.be.revertedWithCustomError(Fundme, 'NotOwner')
            });
        });
    })
