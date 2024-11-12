import React from 'react';
import styled from 'styled-components';

const RealTimeWrapper = styled.div`
  margin-bottom: 2rem;
`;

const RealTimeTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
`;

const DataCard = styled.div`
  background: ${(props) => (props.darkMode ? '#34495e' : '#f9f9f9')};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: ${(props) => (props.darkMode ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
`;

const RealTimeData = ({ darkMode }) => {
  return (
    <RealTimeWrapper>
      <RealTimeTitle darkMode={darkMode}>Real-Time Data</RealTimeTitle>
      <DataCard darkMode={darkMode}>
        <h3>Live Prices</h3>
        <p>Details about live prices.</p>
      </DataCard>
      <DataCard darkMode={darkMode}>
        <h3>Market Trends</h3>
        <p>Details about market trends.</p>
      </DataCard>
    </RealTimeWrapper>
  );
};

export default RealTimeData;
