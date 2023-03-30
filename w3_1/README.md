## W3-1作业
### 1. 发行一个 ERC20Token(用自己的名字)， 发行 100000 token：
* 引入Openzepplin，继承ERC20/ERC20Permit并且设置名称为`Jasun Coin`, 符号为`sun`<br>
代码如下： 
```
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract JasunToken is ERC20, ERC20Permit {
    constructor(uint256 initialSupply) ERC20("Jasun Coin", "sun") ERC20Permit("Jasun Coin") {
        _mint(msg.sender, initialSupply);
    }
}

```
### 2. 编写一个金库 Vault 合约:<br>
① 编写 deposite 方法，实现 ERC20 存入 Vault，并记录每个用户存款金额(approve/transferFrom)<br>
② 编写 withdraw 方法，提取用户自己的存款<br>
代码如下： 
```
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Vault{
    using SafeMath for uint256;

    mapping(address => uint256) public balances;
    address public admin;
    IERC20 public token;

    event DepositMade(address indexed from, address indexed to, uint256 amount);
    event WithdrawalMade(address indexed from, address indexed to, uint256 amount);

    constructor(address _admin,address _tokenAddr) {
        admin = _admin;
        token = IERC20(_tokenAddr);
    }

    function deposit(uint256 _amount) public {
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient balance");
        // 采用安全转账，判断返回值
        bool success = token.transferFrom(msg.sender, address(this), _amount);
        require(success, "Failed to transfer ERC20");

        balances[msg.sender] = balances[msg.sender].add(_amount);
        
        emit DepositMade(msg.sender, address(this), _amount);
    }

    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        // 采用安全转账，判断返回值
        bool success = token.transfer(msg.sender, _amount);
        require(success, "Failed to transfer ERC20");

        balances[msg.sender] = balances[msg.sender].sub(_amount);

        emit WithdrawalMade(address(this), msg.sender, _amount);
    }
}
```

### 3. 进阶练习:
* 要求：使用 ERC2612 标准Token ， 使用签名的方式 deposit
```
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// 引入IERC20Permit接口
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Vault{
    // ...与2上述合约雷同

    // 此处增加ERC2612离线授权合约方式
    function depositWithPermit(uint256 _amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
        IERC20Permit(address(token)).permit(msg.sender, address(this), _amount, deadline, v, r, s);
        deposit(_amount);
    }

    // ...与2上述合约雷同
}
```

### 4. 合约验证:
* 脚本命令
```
npx hardhat run scripts/deploy.js --network avalanche
```
---
* Teacher链上地址
```
https://testnet.snowtrace.io/address/0x0B0796198992913484D444f9Be059D8Ab397001f
```
* Score链上地址
```
https://testnet.snowtrace.io/address/0x07cebae28B4BCC8629e81c799201d46445b8F570
```
* 截图
<p align="center">
  <img src="./images/deploy.png">
</p>

### 4. explorer执行相关方法
* 截图
<p align="center">
  <img src="./images/explorer.png">
</p>

* 教师添加学生分数明细
```
https://testnet.snowtrace.io/tx/0x00b483a23a6ff5050429b21760fefb463a5143363364837bf8b00975c2e6ad31
```
* 教师修改学生分数明细
```
https://testnet.snowtrace.io/tx/0xd8309b4043d1d7130b940ab87b549f464d2c47b34460e5d64a2e8c68ee7e7af3
```