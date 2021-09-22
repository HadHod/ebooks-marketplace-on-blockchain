// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library ArrayUtils {
  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function indexOf(string[] memory _values, string memory _value) pure private returns(uint256) {
    for (uint256 i=0; i<_values.length; i++) {
      if (keccak256(bytes(_values[i])) == keccak256(bytes(_value))) {
        return i;
      }
    }
    return _values.length + 1; // TODO how to return index not found
  }
}
