// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract JasunToken is ERC20, ERC20Permit {
    constructor(uint256 initialSupply) ERC20("Jasun Coin", "sun") ERC20Permit("Jasun Coin") {
        _mint(msg.sender, initialSupply);
    }
}