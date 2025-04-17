const fs = require('fs');
const path = require('path');

// Read the addresses file
const addresses = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/contracts/addresses.json'), 'utf8')
);

// Read the current .env file
const envPath = path.join(__dirname, '../.env');
let envContent = fs.readFileSync(envPath, 'utf8');

// Update User contract address
envContent = envContent.replace(
  /REACT_APP_USER_CONTRACT_ADDRESS=.*/,
  `REACT_APP_USER_CONTRACT_ADDRESS=${addresses.user}`
);

// Update all auction contract addresses
Object.entries(addresses.auctions).forEach(([type, address]) => {
  const envVar = `REACT_APP_${type.toUpperCase()}_AUCTION_CONTRACT_ADDRESS`;
  envContent = envContent.replace(
    new RegExp(`${envVar}=.*`),
    `${envVar}=${address}`
  );
});

// Write the updated content back to .env
fs.writeFileSync(envPath, envContent);

console.log('Environment variables updated successfully'); 