import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from '../components/Header';
import Chatbot from '../chatbot/Chatbot';
import Background from '../components/Background';
import Ticker from '../components/Ticker'; // Import the Ticker component
import { getDarkMode, setDarkMode } from '../utils/darkMode';
import { FaChartLine, FaBell, FaChartPie } from 'react-icons/fa'; // Import icons

// Styled components with dark mode support
const HomePageWrapper = styled.div`
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
  overflow-x: hidden;
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
  margin: 20px auto; /* Adjust margin as needed */
  position: relative;
  z-index: 1;
`;

const MainTitle = styled(motion.h4)`
  font-size: 3rem;
  margin-top: 150px; /* Use margin-top instead of top */
  margin-bottom: 20px;
  font-weight: 700;
  color: ${({ darkMode }) => (darkMode ? '#ffffff' : '#333')};
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 40px;
  color: ${({ darkMode }) => (darkMode ? '#d0d0d0' : '#555')};
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const CallToAction = styled(motion.button)`
  background-color: #ff6347;
  border: none;
  color: #fff;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #e5533e;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const FeaturesSection = styled.div`
  max-width: 90%;
  margin: 40px auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  position: relative;
  z-index: 1;
`;

const FeatureCard = styled(motion.div)`
  background: ${({ darkMode }) => (darkMode ? '#34495e' : '#ffffff')};
  color: ${({ darkMode }) => (darkMode ? '#ecf0f1' : '#333')};
  border-radius: 8px;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 4px 8px rgba(0, 0, 0, 0.4)' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
  padding: 20px;
  width: 280px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  &:hover {
    transform: translateY(-10px);
    box-shadow: ${({ darkMode }) => (darkMode ? '0 8px 16px rgba(0, 0, 0, 0.5)' : '0 8px 16px rgba(0, 0, 0, 0.2)')};
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  color: ${({ darkMode }) => (darkMode ? '#ffffff' : '#333')}; // White for dark mode, dark for light mode
`;

const FeatureTitle = styled.h5`
  font-size: 1.25rem;
  margin-bottom: 10px;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: ${({ darkMode }) => (darkMode ? '#bdc3c7' : '#666')};
`;

const HomePage = () => {
  const [darkMode, setDarkModeState] = useState(getDarkMode());
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkModeState(newDarkMode);
    setDarkMode(newDarkMode);
  };

  return (
    <HomePageWrapper darkMode={darkMode}>
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      <Ticker darkMode={darkMode} />
      <HeroSection>
        <MainTitle
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          darkMode={darkMode}
        >
          Welcome to MAASAI Dashboard
        </MainTitle>
        <Subtitle darkMode={darkMode}>
          Your one-stop solution for tracking market data and cryptocurrency trends .
        </Subtitle>
        <CallToAction
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, type: 'spring' }}
          onClick={() => navigate('/offers')}
        >
          Get Started
        </CallToAction>
      </HeroSection>
      <FeaturesSection>
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          darkMode={darkMode}
        >
          <FeatureIcon darkMode={darkMode}>
            <FaChartLine />
          </FeatureIcon>
          <FeatureTitle>Real-Time Data</FeatureTitle>
          <FeatureDescription>Access live updates on market trends and cryptocurrency prices.</FeatureDescription>
        </FeatureCard>
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          darkMode={darkMode}
        >
          <FeatureIcon darkMode={darkMode}>
            <FaBell />
          </FeatureIcon>
          <FeatureTitle>Custom Alerts</FeatureTitle>
          <FeatureDescription>Set up personalized notifications to stay ahead of the market.</FeatureDescription>
        </FeatureCard>
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          darkMode={darkMode}
        >
          <FeatureIcon darkMode={darkMode}>
            <FaChartPie />
          </FeatureIcon>
          <FeatureTitle>Advanced Analytics</FeatureTitle>
          <FeatureDescription>Analyze trends with our comprehensive set of tools.</FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
      <Chatbot darkMode={darkMode} />
      <Background />
    </HomePageWrapper>
  );
};

export default HomePage;