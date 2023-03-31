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
    bool public transactionStatus = true;

    function setTransactionStatus(bool status) external {
        transactionStatus = status;
    }

    function tokensReceived(address _recipient, uint256 _amount) external override returns (bool) {
        return transactionStatus;
    }
}
```

### 4. 合约验证:
* 部署脚本
```
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


```

* 脚本命令
```
npx hardhat run scripts/deploy.js --network avalanche
```