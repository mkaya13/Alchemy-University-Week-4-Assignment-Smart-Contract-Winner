// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Faucet {
    address payable public owner;
    mapping(address => uint) public donaters;

    constructor() payable {
        owner = payable(msg.sender);
    }

    function withdraw(uint _amount) public payable {
        // users can only withdraw .1 ETH at a time, feel free to change this!
        require(_amount <= 100000000000000000);
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    function withdrawAll() public onlyOwner {
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function destroyFaucet() public onlyOwner {
        selfdestruct(owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function donate() public payable {
        donaters[msg.sender] = msg.value;
    }

    function contractMoney() public view returns (uint) {
        return address(this).balance;
    }
}
