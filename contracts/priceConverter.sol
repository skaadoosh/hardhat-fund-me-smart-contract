// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library priceConverter{

    
    function toUsd(uint256 amt, AggregatorV3Interface addr) public view returns (uint256) {
        ( ,int price,,,) = addr.latestRoundData();
        //price=166946201244-> 1eth=1669.46201244usd
        //1usd=1/1669
        return uint(price*10000000000)*amt/(1000000000000000000);

    }
}