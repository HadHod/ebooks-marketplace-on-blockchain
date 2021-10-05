// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "./Ownable.sol";

// TODO send money to owner
// TODO edit price
// TODO assign every book to owner
// TODO add unit tests coverage check
// TODO remove book from every user after removing book
// TODO book as a NFT, unique id, can be sold by owner

contract BooksMarketplace is Ownable {
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

  function indexOf(string[] memory _values, string memory _value) pure private returns (uint256, bool) {
    for (uint256 i=0; i<_values.length; i++) {
      if (keccak256(bytes(_values[i])) == keccak256(bytes(_value))) {
        return (i, true);
      }
    }
    return (0, false);
  }

  function removeBook(string memory _bookId) external onlyOwner {
    (uint256 index, bool isAvailable) = indexOf(booksIds, _bookId);
    require(isAvailable, 'Book does not exists');
    delete booksIds[index];
    delete booksIdToPrice[_bookId];
    delete booksIdToNumberOfSold[_bookId];
  }

  function getBooks() external view returns (string[] memory, uint256[] memory, bool[] memory, uint256[] memory) {
    uint256[] memory prices = new uint256[](booksIds.length);
    bool[] memory available = new bool[](booksIds.length);
    uint256[] memory sold = new uint256[](booksIds.length);

    for (uint256 i = 0; i < booksIds.length; i++) {
      prices[i] = booksIdToPrice[booksIds[i]];
      available[i] = isBookAvailableForSender(booksIds[i]);
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
    require(!isBookAvailableForSender(_bookId), 'book already purchased');
    addressToBooksIds[msg.sender].push(_bookId);
    booksIdToNumberOfSold[_bookId] += 1;
    emit BooksUpdated();
  }

  function isBookAvailableForSender(string memory _bookId) public view returns (bool) {
    string[] memory _booksIds = addressToBooksIds[msg.sender];
    for (uint i=0; i<_booksIds.length; i++) {
      if (keccak256(bytes(_booksIds[i])) == keccak256(bytes(_bookId))) {
        return true;
      }
    }
    return false;
  }
}
