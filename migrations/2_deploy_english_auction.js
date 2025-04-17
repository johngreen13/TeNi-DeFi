const EnglishAuction = artifacts.require("EnglishAuction");

module.exports = function(deployer) {
  deployer.deploy(EnglishAuction);
}; 