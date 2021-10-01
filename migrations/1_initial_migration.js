const Migrations = artifacts.require("Migrations");
const BooksMarketplace = artifacts.require("BooksMarketplace");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(BooksMarketplace);
};
