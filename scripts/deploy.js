const hre = require("hardhat");

async function main() {
    const YourContractName = await hre.ethers.getContractFactory("YourContractName"); // Ensure the name matches the contract
    const contract = await YourContractName.deploy(/* constructor arguments */);
    await contract.deployed();

    console.log("YourContractName deployed to:", contract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});