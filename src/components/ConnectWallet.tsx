import React, { useState } from 'react';
import Web3 from 'web3';

const ConnectWallet = () => {
  const [userAccount, setUserAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setUserAccount(account);
        const balance = await web3.eth.getBalance(account);
        setBalance(web3.utils.fromWei(balance, 'ether') + ' ETH');
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      console.error('MetaMask not detected');
    }
  };

  return (
    <div>
      {userAccount ? (
        <div id="user-info">
          <p><strong>Account:</strong> <span id="account">{userAccount}</span></p>
          <p><strong>Balance:</strong> <span id="balance">{balance}</span></p>
        </div>
      ) : (
        <button id="login-button" onClick={connectMetaMask}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;