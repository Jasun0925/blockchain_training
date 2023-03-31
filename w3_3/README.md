## W3-2作业
### 1. 部署一个可升级的 ERC20Token
* 定义接口
代码如下： 
```
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ITokenRecipient {
    function tokensReceived(address _recipient, uint256 _amount) external returns(bool);
}

```
* 编写Token1老合约
```
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Token1 is ERC20Upgradeable {    
    function initialize(string memory name, string memory symbol, uint256 initialSupply) public initializer {
        __ERC20_init(name, symbol);
        _mint(msg.sender, initialSupply);
    }
}
```

### 2. 第二版本，加入方法:function transferWithCallback(address recipient, uint256 amount) external returns (bool)<br>
* 编写Token2合约，并加入方法transferWithCallback： 
```
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./ITokenRecipient.sol";

contract Token2 is ERC20Upgradeable {   
    using Address for address;

    function initialize(string memory name, string memory symbol, uint256 initialSupply) public initializer {
        __ERC20_init(name, symbol);
        _mint(msg.sender, initialSupply);
    }

    function transferWithCallback(address _recipient,uint256 _amount) public returns(bool){
        _transfer(msg.sender,_recipient,_amount);

        if(_recipient.isContract()){
            bool rv = ITokenRecipient(_recipient).tokensReceived(_recipient, _amount);
            require(rv, "tokens Not Received");
        }
        return true;
    }
}
```

### 3. 编写TokenRecipient实现 :
```
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./ITokenRecipient.sol";

contract TokenRecipient is ITokenRecipient {
    event tokenReceivedMade(address indexed recipient, uint256 amount);

    function tokensReceived(address _recipient, uint256 _amount) external override returns (bool) {
        emit tokenReceivedMade(_recipient, _amount);
        return true;
    }
}
```

### 4. 合约验证:
* 部署脚本
```
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { upgrades } = require("hardhat");
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');

const {BN} = require('bn.js')
const TokenDecimals = new BN(String(1e18))

async function main() {
  const [owner1] = await hre.ethers.getSigners();
  // 部署Old Token合约
  const Token1 = await hre.ethers.getContractFactory("Token1", options = {from: owner1, log: true});

  const initialSupply = String(new BN('100000000').mul(TokenDecimals)) //首次发行量
  const token1 = await upgrades.deployProxy(Token1, ["Jasun", "sun", initialSupply]);
  await token1.deployed();

  console.log("token1.address:", token1.address);
  console.log("currentImplAddress.address:", await getImplementationAddress(ethers.provider, token1.address));


  const Token2 = await hre.ethers.getContractFactory("Token2", options = {from: owner1, log: true});
  const token2 = await upgrades.upgradeProxy(instance.address, Token2);

  console.log(`token2 address: ` + token2.address);
  console.log(`currentImplAddress address : ` + await getImplementationAddress(ethers.provider, token2.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

```

* 脚本命令
```
npx hardhat run scripts/deploy.js --network avalanche
```