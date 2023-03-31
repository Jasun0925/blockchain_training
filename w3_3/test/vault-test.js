const {loadFixture}  = require("@nomicfoundation/hardhat-network-helpers");
const {anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {expect} = require("chai");
const hre = require("hardhat");

const {BN} = require('bn.js')
const TokenDecimals = new BN(String(1e18))

describe("JasunToken and Vault Test",function(){
    async function deployTokenAndVault(){
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
        
      return {token, vault, owner1};
    }

    describe("Valut Tests",function(){
        it("query Valut Total success",async function(){
            const {token, vault, owner1} = await loadFixture(deployTokenAndVault);
            expect(await token.balanceOf(vault.address)).to.equal(0);
        })
        it("deposit() success",async function(){
            const {token, vault, owner1} = await loadFixture(deployTokenAndVault);

            // 授权并且deposit
            const depositAmount = String(new BN('100').mul(TokenDecimals))
            await (await token.approve(vault.address, depositAmount)).wait();
            await (await vault.deposit(depositAmount)).wait();

            expect(await token.balanceOf(vault.address)).to.equal(depositAmount);
        })
        it("withdraw() success",async function(){
          const {token, vault, owner1} = await loadFixture(deployTokenAndVault);

           // 授权并且deposit
           const depositAmount = String(new BN('100').mul(TokenDecimals))
           await (await token.approve(vault.address, depositAmount)).wait();
           await (await vault.deposit(depositAmount)).wait();

           // 提取50
           const withdrawAmount = String(new BN('50').mul(TokenDecimals))
           await (await vault.withdraw(withdrawAmount)).wait();
           expect(await token.balanceOf(vault.address)).to.equal(withdrawAmount);

           // 再次提取50
           await (await vault.withdraw(withdrawAmount)).wait();
           expect(await token.balanceOf(vault.address)).to.equal(0);
        })
    })
})