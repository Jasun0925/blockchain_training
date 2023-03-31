// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Marker {
    mapping(uint256 => Order) public orders;

    IERC721 public nft;
    IERC20 public token;
    address payable private _owner;

    // 订单对象
    struct Order {
        address seller; // 卖家地址
        uint256 tokenId; // 挂单NFT
        uint256 price; // 价格
    }

    // 挂单售卖事件
    event ListMade(address indexed seller, uint256 indexed tokenId, uint256 price);
    // 取消挂单售卖事件
    event UnListMade(address indexed seller, uint256 indexed tokenId);
    // 交易事件
    event TradeMade(address indexed seller, address indexed buyer, uint256 indexed tokenId, uint256 price);

    constructor(IERC721 _nft, IERC20 _token) {
        nft = _nft;
        token = _token;
    }

    // 挂单售卖
    function list(uint256 _tokenId, uint256 _price) public checkOwnerNft(_tokenId){
        IERC721(nft).safeTransferFrom(msg.sender, address(this), _tokenId);
        orders[_tokenId] = Order(
            msg.sender, 
            _tokenId, 
            _price
        );

        emit ListMade(msg.sender, _tokenId, _price);
    }

    // 下架
    function unlist(uint256 _tokenId) public {
        require(orders[_tokenId].seller == msg.sender, "Not found NFT of list");

        IERC721(nft).safeTransferFrom(address(this),msg.sender, _tokenId);
        delete orders[_tokenId];

        emit UnListMade(msg.sender, _tokenId);
    }

    // 购买
    function buy(uint256 _tokenId) public {
        Order memory order = orders[_tokenId];
        require(order.seller != address(0), "nft isn't exist");

        // check balance of token
        require(IERC20(token).balanceOf(msg.sender) >= order.price,"insufficient tokens");
        // transfer
        IERC20(token).transferFrom(msg.sender, order.seller, order.price);
        IERC721(nft).safeTransferFrom(address(this), msg.sender, _tokenId);

        delete orders[_tokenId];

        emit TradeMade(order.seller, msg.sender, _tokenId, order.price);
    }

    // 检查NFT
    modifier checkOwnerNft(uint256 _tokenId) {
        require(IERC721(nft).ownerOf(_tokenId) == msg.sender, "NFT isn't exists");
        require(orders[_tokenId].seller == address(0), "NFT exists of Maker");
        _;
    }
}