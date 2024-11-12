import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import RealTimeData from '../components/RealTimeData'; // Assuming this component displays real-time data
import { FaTachometerAlt } from 'react-icons/fa';

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: ${({ darkMode }) => (darkMode ? '#1c1c1e' : '#f0f0f0')};
  color: ${({ darkMode }) => (darkMode ? '#f0f0f0' : '#333')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  background: ${({ darkMode }) => (darkMode ? '#282828' : '#f0f0f0')};
  position: fixed;
  top: 0;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 2px 10px rgba(0, 0, 0, 0.5)' : '0 2px 10px rgba(0, 0, 0, 0.1)')};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ darkMode }) => (darkMode ? '#f0f0f0' : '#333')};
`;

const Dashboard= ({ darkMode }) => {
  const { user } = useAuth();

  return (
    <PageContainer darkMode={darkMode}>
      <Header darkMode={darkMode}>
        <Title><FaTachometerAlt /> Dashboard</Title>
      </Header>
      <div style={{ marginTop: '100px' }}>
        <h2>Welcome, {user ? user.username : 'Guest'}!</h2>
        <RealTimeData darkMode={darkMode} />
      </div>
    </PageContainer>
  );
};

export default Dashboard;
