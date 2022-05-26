// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract KnightsOfFreedomToken is ERC20Votes {
    uint256 public s_maxSupply = 1000000000000000000000000; //100000 KOF

    constructor()
        ERC20("KnightsOfFreedom", "KOF")
        ERC20Permit("KnightsOfFreedom")
    {
        _mint(msg.sender, s_maxSupply);
    }
}
