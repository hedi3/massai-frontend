import React from 'react';
import styled from 'styled-components';

const AlertsWrapper = styled.div`
  margin-bottom: 2rem;
`;

const AlertsTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
`;

const AlertCard = styled.div`
  background: ${(props) => (props.darkMode ? '#34495e' : '#f9f9f9')};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: ${(props) => (props.darkMode ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
`;

const Alerts = ({ darkMode }) => {
  return (
    <AlertsWrapper>
      <AlertsTitle darkMode={darkMode}>Alerts</AlertsTitle>
      <AlertCard darkMode={darkMode}>
        <h3>Alert 1</h3>
        <p>Details about market alert 1.</p>
      </AlertCard>
      <AlertCard darkMode={darkMode}>
        <h3>Alert 2</h3>
        <p>Details about market alert 2.</p>
      </AlertCard>
    </AlertsWrapper>
  );
};

export default Alerts;
