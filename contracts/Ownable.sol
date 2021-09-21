//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Ownable {
  address private owner;

  constructor() {
    owner = payable(msg.sender);
  }

  function getOwner() public view returns(address) {
    return owner;
  }

  modifier onlyOwner() {
    require(isOwner());
    _;
  }

  function isOwner() public view returns(bool) {
    return msg.sender == owner;
  }
}
