// src/components/UserActivity.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchUserActivities } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { FaClock } from 'react-icons/fa';

const ActivityContainer = styled.div`
  background: ${({ darkMode }) => (darkMode ? '#444' : '#f9f9f9')};
  padding: 20px;
  border-radius: 8px;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 2px 6px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.1)')};
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#333')};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ddd')};
`;

const ActivityIcon = styled.div`
  margin-right: 10px;
  color: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
`;

const ActivityList = ({ darkMode }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await fetchUserActivities(user.username);
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchActivities();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ActivityContainer darkMode={darkMode}>
      {activities.map((activity, index) => (
        <ActivityItem key={index} darkMode={darkMode}>
          <ActivityIcon darkMode={darkMode}><FaClock size={20} /></ActivityIcon>
          {activity.description}
        </ActivityItem>
      ))}
    </ActivityContainer>
  );
};

export default ActivityList;
