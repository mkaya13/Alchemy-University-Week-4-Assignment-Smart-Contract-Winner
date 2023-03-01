// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

error NotOwner();

contract EmitWinner {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function emitWinnerEvent(address _contract) public {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        (bool success, ) = _contract.call(abi.encodeWithSignature("attempt()"));
        require(success);
    }
}
