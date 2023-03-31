// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { BigNumber } = require("ethers");
const hre = require("hardhat");

const {BN} = require('bn.js')
const TokenDecimals = new BN(String(1e18))

async function main() {
  const [owner1] = await hre.ethers.getSigners();
  // 部署JasunToken合约
  const Token = await hre.ethers.getContractFactory("JasunToken", options = {from: owner1, log: true});
  
  const initialAmount = String(new BN('100000000').mul(TokenDecimals)) //首次发行量
  const token = await Token.deploy(initialAmount);// 默认构造方法

  await token.deployed();
  console.log("JasunToken deployed to:", token.address);

  // 部署Vault合约
  const Vault = await hre.ethers.getContractFactory("Vault", options = {from: owner1, log: true});
  const vault = await Vault.deploy(owner1.address, token.address);

  await vault.deployed();
  console.log("Vault deployed to:", vault.address);

  const balance = await token.balanceOf(owner1.address);
  console.log(balance)

  const approve = await token.approve(vault.address, 5000000);
  const result = await approve.wait();
  console.log(result);

  const allowanceFlag = await token.allowance(owner1.address, vault.address)
  console.log(allowanceFlag)

  await vault.deposit(5000000);
  await vault.withdraw(2000000);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
