import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { FaBox, FaCogs, FaBuilding, FaEye } from 'react-icons/fa';
import { getDarkMode, setDarkMode } from '../utils/darkMode';
import { useAuth } from '../context/AuthContext';
import Ticker from '../components/Ticker';
import Chatbot from '../chatbot/Chatbot';
import Background from '../components/Background';

// Mock offers data with navigation links
const offers = [
  {
    id: 1,
    name: 'Basic Package',
    description: 'Get started with our basic package.',
    price: '$99',
    icon: <FaBox />,
    link: '/chart', // Navigation link for Basic Package
  },
  {
    id: 2,
    name: 'Pro Package',
    description: 'Upgrade to the pro package for more features.',
    price: '$199',
    icon: <FaCogs />,
    link: '/nasdaq', // Navigation link for Pro Package
  },
  {
    id: 3,
    name: 'Enterprise Package',
    description: 'All-inclusive package for enterprises.',
    price: '$499',
    icon: <FaBuilding />,
    link: '/process', // Navigation link for Enterprise Package
  },
  // Add more offers as needed
];

const OffersPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background: ${({ darkMode }) =>
    darkMode
      ? 'linear-gradient(135deg, #1e1e1e, #2c3e50)'
      : 'linear-gradient(135deg, #ffffff, #f5f5f5)'};
  color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
  text-align: center;
  padding: 0;
  margin: 0;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ darkMode }) =>
      darkMode
        ? 'url(/path/to/dark-mode-background.svg) center center / cover no-repeat'
        : 'url(/path/to/light-mode-background.svg) center center / cover no-repeat'};
    opacity: 0.1;
    z-index: 0;
  }
`;

const HeroSection = styled.div`
  max-width: 80%;
  margin: 20px auto;
  position: relative;
  z-index: 1;
`;

const OffersTitle = styled(motion.h4)`
  font-size: 3rem;
  margin-top: 150px;
  margin-bottom: 20px;
  font-weight: 700;
  color: ${({ darkMode }) => (darkMode ? '#ffffff' : '#333')};
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const OffersGrid = styled.div`
  max-width: 90%;
  margin: 40px auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  position: relative;
  z-index: 1;
`;

const OfferCard = styled(motion.div)`
  background: ${({ darkMode }) =>
    darkMode ? '#34495e' : '#ffffff'};
  color: ${({ darkMode }) => (darkMode ? '#ecf0f1' : '#333')};
  border-radius: 10px;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 4px 8px rgba(0, 0, 0, 0.4)' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
  padding: 20px;
  width: 300px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${({ darkMode }) => (darkMode ? '0 8px 16px rgba(0, 0, 0, 0.5)' : '0 8px 16px rgba(0, 0, 0, 0.2)')};
  }
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: ${({ darkMode }) => (darkMode ? '#ffffff' : '#333')};
  margin-bottom: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const OfferTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  font-weight: 600;
  color: ${({ darkMode }) => (darkMode ? '#ecf0f1' : '#333')};
`;

const OfferDescription = styled.p`
  font-size: 1rem;
  color: ${({ darkMode }) => (darkMode ? '#bdc3c7' : '#666')};
`;

const OfferPrice = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ darkMode }) => (darkMode ? '#ecf0f1' : '#333')};
  margin: 10px 0;
`;

const WatchButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${({ darkMode }) => (darkMode ? '#1e1e1e' : '#f0f0f0')};
  border: none;
  border-radius: 50%;
  padding: 10px;
  font-size: 1.2rem;
  color: ${({ darkMode }) => (darkMode ? '#ffffff' : '#333')};
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#2c3e50' : '#e0e0e0')};
    color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;
  width: 100%;
`;

const Button = styled.a`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: ${({ darkMode }) => (darkMode ? '#e74c3c' : '#3498db')};
  color: #fff;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.3s ease;
  text-align: center;

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#c0392b' : '#2980b9')};
  }
`;

const OffersPage = () => {
  const [darkMode, setDarkModeState] = useState(getDarkMode());
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setDarkMode(darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkModeState(newDarkMode);
    setDarkMode(newDarkMode);
  };

  return (
    <OffersPageWrapper darkMode={darkMode}>
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      <Ticker darkMode={darkMode} />
      <HeroSection>
        <OffersTitle
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          darkMode={darkMode}
        >
          Special Offers
        </OffersTitle>
      </HeroSection>
      <OffersGrid>
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            darkMode={darkMode}
          >
            <WatchButton darkMode={darkMode}>
              <FaEye />
            </WatchButton>
            <IconWrapper darkMode={darkMode}>{offer.icon}</IconWrapper>
            <OfferTitle darkMode={darkMode}>{offer.name}</OfferTitle>
            <OfferDescription darkMode={darkMode}>{offer.description}</OfferDescription>
            <OfferPrice darkMode={darkMode}>{offer.price}</OfferPrice>
            <ButtonWrapper>
              <Button href={isAuthenticated ? offer.link : "/signup"} darkMode={darkMode}>
                {isAuthenticated ? 'Buy Now' : 'Sign Up'}
              </Button>
            </ButtonWrapper>
          </OfferCard>
        ))}
      </OffersGrid>
      <Chatbot darkMode={darkMode} />
      <Background />
    </OffersPageWrapper>
  );
};

export default OffersPage;
