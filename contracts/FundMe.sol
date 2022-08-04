//SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
 import "./priceConverter.sol";

error NotOwner();

contract FundMe {

    using priceConverter for uint256;

    uint256 public constant MIN_AMT = 50*10**18;
    address private immutable i_owner;

    //storage states are prefixed with s_
    mapping(address => uint256) private s_amtDonated;
    address[] private s_funders;
    AggregatorV3Interface private s_priceFeedAddr;

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    constructor(address _priceFeed) {
        i_owner = msg.sender;
        s_priceFeedAddr=AggregatorV3Interface(_priceFeed);
    }

    function fund() public payable {
        require(msg.value.toUsd(s_priceFeedAddr) >= MIN_AMT, "Please fund more");
        s_amtDonated[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert NotOwner();
        _;
    }

    function withdraw() public payable onlyOwner {

        for (uint256 funderIndex = 0;funderIndex < s_funders.length;funderIndex++) {
            address funder = s_funders[funderIndex];
            s_amtDonated[funder] = 0;
        }
        s_funders = new address[](0);
        (bool sent, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(sent, "Witdraw failed");
    }

    function getOwner() public view returns(address){
        return i_owner;
    }

    function getPriceFeedAddr() public view returns(AggregatorV3Interface){
        return s_priceFeedAddr;
    }

    function getFunder(uint idx) public view returns(address){
        return s_funders[idx];
    }

    function getAmountDonated(address funder) public view returns(uint){
        return s_amtDonated[funder];
    }
}
