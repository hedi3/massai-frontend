import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile } from '../services/userService';
import { fetchUserActivities } from '../services/activityService';
import Background from '../components/Background';
import Chatbot from '../chatbot/Chatbot';
import Spinner from '../components/Spinner';
import { FaCog, FaEnvelope, FaPhone, FaGenderless, FaBirthdayCake, FaHistory, FaCheckCircle, FaTimesCircle, FaUserShield, FaEye, FaEyeSlash } from 'react-icons/fa';
import { getDarkMode, setDarkMode } from '../utils/darkMode';

// Styles
const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  background: ${({ darkMode }) => (darkMode ? '#1c1c1e' : '#f0f0f0')};
  overflow: hidden;
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
  z-index: 2;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 2px 10px rgba(0, 0, 0, 0.5)' : '0 2px 10px rgba(0, 0, 0, 0.1)')};
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  color: ${({ darkMode }) => (darkMode ? '#f0f0f0' : '#333')};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  flex: 1;
  text-align: center;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100% - 80px);
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  top: 80px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ darkMode }) => (darkMode ? 'linear-gradient(145deg, #333, #444)' : 'linear-gradient(145deg, #fff, #f9f9f9)')};
  padding: 20px;
  border-radius: 12px;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 10px 20px rgba(0, 0, 0, 0.6)' : '0 6px 15px rgba(0, 0, 0, 0.2)')};
  backdrop-filter: blur(10px);
  transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  max-width: 400px;
  width: 100%;
  text-align: center;
  color: ${({ darkMode }) => (darkMode ? '#f0f0f0' : '#333')};
  position: relative;
`;

const IconButton = styled.button`
  position: absolute;
  background: ${({ darkMode }) => (darkMode ? '#333' : '#fff')};
  border: none;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 2px 6px rgba(0, 0, 0, 0.4)' : '0 2px 6px rgba(0, 0, 0, 0.1)')};
  transition: background 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#444' : '#f0f0f0')};
    box-shadow: ${({ darkMode }) => (darkMode ? '0 4px 10px rgba(0, 0, 0, 0.6)' : '0 4px 10px rgba(0, 0, 0, 0.2)')};
  }

  & > svg {
    color: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
  }
`;

const HistoryButton = styled(IconButton)`
  top: 10px;
  left: 10px;
`;

const SettingsButton = styled(IconButton)`
  top: 10px;
  right: 10px;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
  border: 4px solid ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
  box-shadow: ${({ darkMode }) => (darkMode ? '0 4px 10px rgba(0, 0, 0, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.1)')};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const UserNameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 10px;
`;

const UserName = styled.h2`
  font-size: 2rem;
  font-weight: 900;
  color: ${({ darkMode }) => (darkMode ? '#f0f0f0' : '#333')};
  text-shadow: 1px 1px 3px ${({ darkMode }) => (darkMode ? '#000' : '#ddd')};
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
  align-items: center;
  transition: color 0.3s ease, text-shadow 0.3s ease;

  &:hover {
    color: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
    text-shadow: 1px 1px 5px ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
  }
`;

const VerificationIcon = styled.div`
  margin-left: 10px;
  color: ${({ isVerified }) => (isVerified ? '#28a745' : '#dc3545')};
`;



const UserInfoContainer = styled.div`
  width: 100%;
  margin-top: 15px;
`;

const UserInfoItem = styled.div`
  display: flex;
  align-items: center;
  background: ${({ darkMode }) => (darkMode ? '#444' : '#f9f9f9')};
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 8px;
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#333')};
  box-shadow: ${({ darkMode }) => (darkMode ? '0 2px 6px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.1)')};
  transition: background 0.3s ease, transform 0.3s ease;

  & > svg {
    margin-right: 10px;
    color: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
    transition: color 0.3s ease;
  }

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#555' : '#e0e0e0')};
    transform: scale(1.02);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: background 0.3s ease, transform 0.3s ease;

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#0056b3' : '#003d7a')};
    transform: scale(1.05);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: ${({ show }) => (show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

const ModalContent = styled.div`
  background: ${({ darkMode }) => (darkMode ? '#333' : '#fff')};
  color: ${({ darkMode }) => (darkMode ? '#f0f0f0' : '#333')};
  border-radius: 12px;
  padding: 20px;
  max-width: 600px;
  width: 100%;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 10px 20px rgba(0, 0, 0, 0.6)' : '0 10px 20px rgba(0, 0, 0, 0.2)')};
  position: relative;
  transition: background 0.3s ease, box-shadow 0.3s ease;

  & > h2 {
    margin: 0;
    padding: 0;
    text-align: center;
  }
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
`;

const ActivityItem = styled.li`
  display: flex;
  align-items: center;
  background: ${({ darkMode }) => (darkMode ? '#444' : '#f9f9f9')};
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 8px;
  color: ${({ darkMode }) => (darkMode ? '#ddd' : '#333')};
  box-shadow: ${({ darkMode }) => (darkMode ? '0 2px 6px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.1)')};
  transition: background 0.3s ease, transform 0.3s ease;

  & > svg {
    margin-right: 10px;
    color: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
    transition: color 0.3s ease;
  }

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#555' : '#e0e0e0')};
    transform: scale(1.02);
  }
`;

const ErrorMessage = styled.p`
  color: ${({ darkMode }) => (darkMode ? '#f44336' : '#f44336')};
  font-size: 1.2rem;
  text-align: center;
  margin-top: 20px;
`;

// ProfilePage Component
const ProfilePage = ({ darkMode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showActivities, setShowActivities] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const profileData = await fetchUserProfile(user.username);
          setProfile(profileData);
        } else {
          setError("User not authenticated.");
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleHistoryClick = async () => {
    try {
      const activitiesData = await fetchUserActivities(user.username);
      setActivities(activitiesData);
      setShowActivities(true);
    } catch (err) {
      setError(err.message || "Failed to fetch activities.");
    }
  };

  const handleSettingsClick = () => {
    // Handle settings click
  };

  const handleCloseModal = () => {
    setShowActivities(false);
  };

  if (loading) {
    return (
      <ContentContainer darkMode={darkMode}>
        <Spinner />
      </ContentContainer>
    );
  }

  if (error) {
    return (
      <ContentContainer darkMode={darkMode}>
        <ErrorMessage>Error: {error}</ErrorMessage>
      </ContentContainer>
    );
  }

  return (
    <PageContainer darkMode={darkMode}>
      <Header darkMode={darkMode}>
        <HeaderContent>
          <Title>Profile</Title>
        </HeaderContent>
      </Header>
      <ContentContainer darkMode={darkMode}>
        <Card darkMode={darkMode}>
          {profile && (
            <>
              <ProfileImage src={profile.image || 'default-profile.png'} alt="Profile" darkMode={darkMode} />
              <UserNameContainer>
                <UserName darkMode={darkMode}>{profile.username}</UserName>

                {profile.verified ? (
                  <VerificationIcon isVerified={true}><FaCheckCircle size={20} /></VerificationIcon>
                ) : (
                  <VerificationIcon isVerified={false}><FaTimesCircle size={20} /></VerificationIcon>
                )}

              </UserNameContainer>
              <UserInfoContainer>
                <UserInfoItem darkMode={darkMode}>
                  <FaUserShield size={20} /> Role: {profile.role || 'N/A'}
                </UserInfoItem>
                <UserInfoItem darkMode={darkMode}>
                  <FaEnvelope size={20} /> Email: {profile.email || 'N/A'}
                </UserInfoItem>
                <UserInfoItem darkMode={darkMode}>
                  <FaPhone size={20} /> Phone: {profile.phoneNumber || 'N/A'}
                </UserInfoItem>
                <UserInfoItem darkMode={darkMode}>
                  <FaGenderless size={20} /> Gender: {profile.gender || 'N/A'}
                </UserInfoItem>
                <UserInfoItem darkMode={darkMode}>
                  <FaBirthdayCake size={20} /> Birthday: {profile.birthday || 'N/A'}
                </UserInfoItem>
              </UserInfoContainer>
              <Button darkMode={darkMode}>Edit Profile</Button>
              <SettingsButton darkMode={darkMode} onClick={handleSettingsClick}>
                <FaCog size={24} />
              </SettingsButton>
              <HistoryButton darkMode={darkMode} onClick={handleHistoryClick}>
                <FaHistory size={24} />
              </HistoryButton>
            </>
          )}
        </Card>
        <Chatbot />
        <Background darkMode={darkMode} />
      </ContentContainer>

      <ModalOverlay show={showActivities} onClick={handleCloseModal}>
        <ModalContent darkMode={darkMode} onClick={(e) => e.stopPropagation()}>
          <center><h2>History</h2></center>
          <ActivityList darkMode={darkMode}>
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <ActivityItem key={index} darkMode={darkMode}>
                  <FaHistory size={20} /> {activity.activityType} {activity.timestamp}
                   
                </ActivityItem>
              ))
            ) : (
              <ActivityItem darkMode={darkMode}>No activities found.</ActivityItem>
            )}
          </ActivityList>
          <Button darkMode={darkMode} onClick={handleCloseModal}>Close</Button>
        </ModalContent>
      </ModalOverlay>
    </PageContainer>
  );
};

export default ProfilePage;
