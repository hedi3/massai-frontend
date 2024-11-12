// src/components/UserMetrics.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchUserMetrics } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { FaChartBar } from 'react-icons/fa';

const MetricsContainer = styled.div`
  background: ${({ darkMode }) => (darkMode ? '#444' : '#f9f9f9')};
  padding: 20px;
  border-radius: 8px;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 2px 6px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.1)')};
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#333')};
`;

const MetricsItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ddd')};
`;

const MetricsIcon = styled.div`
  margin-right: 10px;
  color: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
`;

const UserMetrics = ({ darkMode }) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await fetchUserMetrics(user.username);
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMetrics();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MetricsContainer darkMode={darkMode}>
      <MetricsItem darkMode={darkMode}>
        <MetricsIcon darkMode={darkMode}><FaChartBar size={20} /></MetricsIcon>
        Posts: {metrics.posts || 'N/A'}
      </MetricsItem>
      <MetricsItem darkMode={darkMode}>
        <MetricsIcon darkMode={darkMode}><FaChartBar size={20} /></MetricsIcon>
        Comments: {metrics.comments || 'N/A'}
      </MetricsItem>
      <MetricsItem darkMode={darkMode}>
        <MetricsIcon darkMode={darkMode}><FaChartBar size={20} /></MetricsIcon>
        Likes: {metrics.likes || 'N/A'}
      </MetricsItem>
    </MetricsContainer>
  );
};

export default UserMetrics;
