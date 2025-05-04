// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@redstone-finance/evm-connector/contracts/data-services/MainDemoConsumerBase.sol";

contract PriceFeed is MainDemoConsumerBase {
    // Get ETH price in USD
    function getEthPrice() public view returns (uint256) {
        return getOracleNumericValueFromTxMsg(bytes32("ETH"));
    }

    // Get BTC price in USD
    function getBtcPrice() public view returns (uint256) {
        return getOracleNumericValueFromTxMsg(bytes32("BTC"));
    }

    // Get RBTC price in USD
    function getRbtcPrice() public view returns (uint256) {
        return getOracleNumericValueFromTxMsg(bytes32("RBTC"));
    }

    // Get RIF price in USD
    function getRifPrice() public view returns (uint256) {
        return getOracleNumericValueFromTxMsg(bytes32("RIF"));
    }
} 