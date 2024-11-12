import React from 'react';
import styled from 'styled-components';

const OverviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OverviewCard = styled.div`
  background: ${({ darkMode }) => (darkMode ? '#34495e' : '#ffffff')};
  color: ${({ darkMode }) => (darkMode ? '#ecf0f1' : '#333')};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 4px 8px rgba(0, 0, 0, 0.4)' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ darkMode }) => (darkMode ? '0 8px 16px rgba(0, 0, 0, 0.5)' : '0 8px 16px rgba(0, 0, 0, 0.2)')};
  }
`;

const MarketOverview = ({ darkMode }) => {
  return (
    <OverviewWrapper>
      <OverviewCard darkMode={darkMode}>
        <h3>Major Indices</h3>
        <p>Details about major indices.</p>
      </OverviewCard>
      <OverviewCard darkMode={darkMode}>
        <h3>Currency Pairs</h3>
        <p>Details about major currency pairs.</p>
      </OverviewCard>
      <OverviewCard darkMode={darkMode}>
        <h3>Commodities</h3>
        <p>Details about key commodities.</p>
      </OverviewCard>
    </OverviewWrapper>
  );
};

export default MarketOverview;
