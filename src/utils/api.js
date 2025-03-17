import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createUser = async (walletAddress) => {
  const response = await axios.post(`${API_URL}/users`, { walletAddress });
  return response.data;
};

export const addTransaction = async (transaction) => {
  const response = await axios.post(`${API_URL}/transactions`, transaction);
  return response.data;
};

export const getTransactions = async (walletAddress) => {
  const response = await axios.get(`${API_URL}/transactions/${walletAddress}`);
  return response.data;
};