// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
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

    function depositWithPermit(uint256 _amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
        IERC20Permit(address(token)).permit(msg.sender, address(this), _amount, deadline, v, r, s);
        deposit(_amount);
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