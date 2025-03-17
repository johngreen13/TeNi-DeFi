import React, { useState } from 'react';
import Web3 from 'web3';

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const balance = await web3.eth.getBalance(accounts[0]);
        setBalance(web3.utils.fromWei(balance, 'ether') + ' ETH');
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      alert('MetaMask not detected');
    }
  };

  return (
    <div>
      {account ? (
        <div>
          <p>Account: {account}</p>
          <p>Balance: {balance}</p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;