// src/pages/ChartPage.js
import React from 'react';
import RealTimeCryptoChart from '../components/RealTimeCryptoChart';

const ChartPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Real-Time Cryptocurrency Chart</h1>
      <RealTimeCryptoChart />
    </div>
  );
};

export default ChartPage;
