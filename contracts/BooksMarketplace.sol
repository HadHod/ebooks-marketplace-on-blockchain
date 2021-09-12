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

  function addBook(string memory id, uint256 price) external onlyOwner {
    require(booksIdToPrice[id] == 0, 'id already exists');
    booksIds.push(id);
    booksIdToPrice[id] = price;
  }

  // create library https://gist.github.com/raineorshine/e080d25453a4c075cfcf89f72f8357cd
  function indexOf(string[] memory values, string memory value) pure private returns(uint256) {
    for (uint256 i=0; i<values.length; i++) {
      if (keccak256(bytes(values[i])) == keccak256(bytes(value))) {
        return i;
      }
    }
    return values.length + 1; // TODO how to return index not found
  }

  function removeBook(string memory id) external onlyOwner {
    uint256 index = indexOf(booksIds, id);
    delete booksIds[index];
    booksIdToPrice[id] = 0;
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

  // function contains(address[] memory array, address adr) private pure returns (bool) {
  //   for (uint i=0; i<array.length; i++) {
  //     if (array[i] == adr) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  // function buyBook(uint256 bookId) external {
  //   addressWithBooks[msg.sender].push(bookId);
  // }

  // function isBookSoldForAddress(uint256 id, address adr) external view {
  //   if (containsUint256(addressWithBooks[adr], id)) {
  //     console.log('yes');
  //   } else {
  //     console.log('no');
  //   }
  // }
}
