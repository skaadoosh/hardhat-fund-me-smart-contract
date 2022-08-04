// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const addresses = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"

async function main() {

  console.log('Deploying...')

  const prcCnvrt = await hre.ethers.getContractFactory("priceConverter");
  const PriceConverter = await prcCnvrt.deploy();
  await PriceConverter.deployed()

  const FundFactory = await hre.ethers.getContractFactory("FundMe", {
    libraries: {
      priceConverter: PriceConverter.address
    },
  });
  const fundme = await FundFactory.deploy(addresses);

  await fundme.deployed();

  console.log("Contract deployed to:", fundme.address);

  const val = await fundme.getval(100)
  console.log(`val is: ${val}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
