// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./Ownable.sol";
// import "./ArrayUtils.sol";

// TODO unit tests
// TODO utils library

contract BooksMarketplace is Ownable {
  // using ArrayUtils for string[];

  event BooksUpdated();

  string[] private booksIds;
  mapping(string => uint256) private booksIdToPrice;
  mapping(address => string[]) private addressToBooksIds;
  mapping(string => uint256) private booksIdToNumberOfSold;

  function addBook(string memory _bookId, uint256 _price) external onlyOwner {
    require(booksIdToPrice[_bookId] == 0, 'id already exists');
    booksIds.push(_bookId);
    booksIdToPrice[_bookId] = _price;
  }

  function indexOf(string[] memory _values, string memory _value) pure private returns (uint256) {
    for (uint256 i=0; i<_values.length; i++) {
      if (keccak256(bytes(_values[i])) == keccak256(bytes(_value))) {
        return i;
      }
    }
    return _values.length + 1; // TODO how to return index not found
  }

  function removeBook(string memory _bookId) external onlyOwner {
    uint256 index = indexOf(booksIds, _bookId);
    delete booksIds[index];
    booksIdToPrice[_bookId] = 0;
  }

  function getBooks() external view returns (string[] memory, uint256[] memory, bool[] memory, uint256[] memory) {
    uint256[] memory prices = new uint256[](booksIds.length);
    bool[] memory available = new bool[](booksIds.length);
    uint256[] memory sold = new uint256[](booksIds.length);
    for (uint256 i = 0; i < booksIds.length; i++) {
      prices[i] = booksIdToPrice[booksIds[i]];
      available[i] = isBookAvailable(booksIds[i]);
      sold[i] = booksIdToNumberOfSold[booksIds[i]];
    }
    return (booksIds, prices, available, sold);
  }

  function getBalance() external view onlyOwner returns (uint256) {
    return address(this).balance;
  }

  function buyBook(string memory _bookId) external payable {
    uint256 price = booksIdToPrice[_bookId];
    require(msg.value == price, 'wrong value');
    require(!isBookAvailable(_bookId), 'book already purchased');
    addressToBooksIds[msg.sender].push(_bookId);
    booksIdToNumberOfSold[_bookId] += 1;
    emit BooksUpdated();
  }

  function isBookAvailable(string memory _bookId) public view returns (bool) {
    string[] memory _booksIds = addressToBooksIds[msg.sender];
    for (uint i=0; i<_booksIds.length; i++) {
      if (keccak256(bytes(_booksIds[i])) == keccak256(bytes(_bookId))) {
        return true;
      }
    }
    return false;
  }
}
