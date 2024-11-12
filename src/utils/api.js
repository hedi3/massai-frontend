// src/utils/api.js
import axios from 'axios';

const API_KEY = 'WVYO9T4C54MSYHIS'; // Replace with your actual API key
const BASE_URL = 'https://www.alphavantage.co/query';

// Fetch real-time stock data
export const fetchRealTimeData = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol,
        interval: '1min', // Change interval as needed
        apikey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    throw error;
  }
};
