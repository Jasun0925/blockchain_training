// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const {upgrades } = require("hardhat")
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');

const {BN} = require('bn.js')
const TokenDecimals = new BN(String(1e18))

async function main() {
  const [owner1] = await hre.ethers.getSigners();
  // 部署Old Token合约
  const token1 = await hre.ethers.getContractFactory("Token1", options = {from: owner1, log: true});

  const initialSupply = String(new BN('100000000').mul(TokenDecimals)) //首次发行量
  const instance = await upgrades.deployProxy(token1, ["Jasun", "sun", initialSupply]);
  await instance.deployed();

  console.log("instance.address:", instance.address);
  console.log("currentImplAddress.address:", await getImplementationAddress(ethers.provider, instance.address));


  const token2 = await hre.ethers.getContractFactory("Token2", options = {from: owner1, log: true});
  const upgraded = await upgrades.upgradeProxy(instance.address, token2);

  console.log(`upgraded address: ` + token2.address);
  console.log(`currentImplAddress address : ` + await getImplementationAddress(ethers.provider, upgraded.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
