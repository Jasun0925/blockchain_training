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