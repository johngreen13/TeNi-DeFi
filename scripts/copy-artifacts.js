const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Source and destination paths
        const sourceDir = path.join(__dirname, '../artifacts/contracts');
        const destDir = path.join(__dirname, '../src/contracts/artifacts');

        // Create destination directory if it doesn't exist
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Copy AuctionFactory.json
        const sourceFile = path.join(sourceDir, 'AuctionFactory.sol/AuctionFactory.json');
        const destFile = path.join(destDir, 'AuctionFactory.json');

        if (fs.existsSync(sourceFile)) {
            fs.copyFileSync(sourceFile, destFile);
            console.log('Successfully copied AuctionFactory.json');
        } else {
            console.error('Source file not found:', sourceFile);
        }

        // Copy other contract artifacts if needed
        const contracts = [
            'UserContract.sol/UserContract.json',
            'TokenContract.sol/TokenContract.json',
            'EscrowContract.sol/EscrowContract.json',
            'DisputeResolutionContract.sol/DisputeResolutionContract.json',
            'ShippingContract.sol/ShippingContract.json',
            'PhysicalItemBase.sol/PhysicalItemBase.json',
            'EnglishAuction.sol/EnglishAuction.json',
            'DutchAuction.sol/DutchAuction.json',
            'FixedSwapAuction.sol/FixedSwapAuction.json',
            'SealedBidAuction.sol/SealedBidAuction.json',
            'BlindAuction.sol/BlindAuction.json'
        ];

        for (const contract of contracts) {
            const source = path.join(sourceDir, contract);
            const dest = path.join(destDir, contract.split('/').pop());

            if (fs.existsSync(source)) {
                fs.copyFileSync(source, dest);
                console.log(`Successfully copied ${contract.split('/').pop()}`);
            } else {
                console.warn(`Source file not found: ${source}`);
            }
        }

        console.log('Artifact copying completed successfully!');
    } catch (error) {
        console.error('Error copying artifacts:', error);
        process.exit(1);
    }
}

main(); 