//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./Ownable.sol";

// TODO
// multiple files
// testing
// create utils library

contract BooksMarketplace is Ownable {
  string[] private booksIds;
  mapping(string => uint256) private booksIdToPrice;
  mapping(address => string[]) private addressToBooksIds;

  function addBook(string memory _bookId, uint256 _price) external onlyOwner {
    require(booksIdToPrice[_bookId] == 0, 'id already exists');
    booksIds.push(_bookId);
    booksIdToPrice[_bookId] = _price;
  }

  // create library https://gist.github.com/raineorshine/e080d25453a4c075cfcf89f72f8357cd
  function indexOf(string[] memory _values, string memory _value) pure private returns(uint256) {
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

  function getBooks() external view returns(string[] memory, uint256[] memory) {
    uint256[] memory prices = new uint[](booksIds.length);
    for (uint256 i = 0; i < booksIds.length; i++) {
      prices[i] = booksIdToPrice[booksIds[i]];
    }
    return(booksIds, prices);
  }

  function getPrice(string memory id) external view returns(uint256) {
    return booksIdToPrice[id];
  }

  function balanceOf() external view returns(uint256) {
    return address(this).balance;
  }

  function concat(string memory _base, string memory _value) internal pure returns (string memory) {
    bytes memory _baseBytes = bytes(_base);
    bytes memory _valueBytes = bytes(_value);

    string memory _tmpValue = new string(_baseBytes.length + _valueBytes.length);
    bytes memory _newValue = bytes(_tmpValue);

    uint i;
    uint j;

    for(i=0; i<_baseBytes.length; i++) {
      _newValue[j++] = _baseBytes[i];
    }

    for(i=0; i<_valueBytes.length; i++) {
      _newValue[j++] = _valueBytes[i];
    }

    return string(_newValue);
  }

  function buyBook(string memory _bookId) external payable {
    uint256 price = booksIdToPrice[_bookId] * 10**18;
    console.log("Price is %s and the value is %s", price, msg.value);
    require(msg.value == price, 'wrong value');
    addressToBooksIds[msg.sender].push(_bookId);
  }

  function isBookSoldForAddress(string memory  _bookId, address _adr) external view returns(bool) {
    string[] memory _booksIds = addressToBooksIds[_adr];
    for (uint i=0; i<_booksIds.length; i++) {
      if (keccak256(bytes(_booksIds[i])) == keccak256(bytes(_bookId))) {
        return true;
      }
    }
    return false;
  }
}
