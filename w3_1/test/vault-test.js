const { expect } = require("chai");
const { ethers } = require("hardhat");
const {BN} = require('bn.js')
const TokenDecimals = new BN(String(1e18))

describe("Vault", function () {
    it("Deposit & Withdrawal", async function () {
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

        await token.approve(vault.address, 500);
        await vault.deposit(500);
        await vault.withdraw(200);
      })
});
