// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
/* eslint-disable-next-line */
const hre = require('hardhat');

/* eslint-disable-next-line */
async function main() {
  const BooksMarketplace = await hre.ethers.getContractFactory('BooksMarketplace');
  const booksMarketplace = await BooksMarketplace.deploy();

  await booksMarketplace.deployed();

  /* eslint-disable-next-line */
  console.log('BooksMarketplace deployed to:', booksMarketplace.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    /* eslint-disable-next-line */
    console.error(error);
    process.exit(1);
  });
