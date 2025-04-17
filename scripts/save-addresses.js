const fs = require('fs');
const path = require('path');

async function main() {
    // Read the deployment output
    const deploymentOutput = process.env.DEPLOYMENT_OUTPUT;
    if (!deploymentOutput) {
        console.error('No deployment output provided');
        process.exit(1);
    }

    // Parse the addresses from the deployment output
    const addresses = {};
    const lines = deploymentOutput.split('\n');
    
    lines.forEach(line => {
        if (line.includes('deployed to:')) {
            const [contractName, address] = line.split('deployed to:').map(s => s.trim());
            addresses[contractName] = address;
        }
    });

    // Create the addresses object
    const contractAddresses = {
        AuctionFactory: addresses['AuctionFactory'],
        UserContract: addresses['UserContract'],
        TokenContract: addresses['TokenContract'],
        EscrowContract: addresses['EscrowContract'],
        DisputeResolutionContract: addresses['DisputeResolutionContract'],
        ShippingContract: addresses['ShippingContract'],
        PhysicalItemBase: addresses['PhysicalItemBase'],
        auctionTypes: {
            English: addresses['EnglishAuction'],
            Dutch: addresses['DutchAuction'],
            FixedSwap: addresses['FixedSwapAuction'],
            SealedBid: addresses['SealedBidAuction'],
            Blind: addresses['BlindAuction']
        }
    };

    // Save to src/contracts/addresses.json
    const addressesPath = path.join(__dirname, '../src/contracts/addresses.json');
    fs.writeFileSync(addressesPath, JSON.stringify(contractAddresses, null, 2));
    console.log('Contract addresses saved to:', addressesPath);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 