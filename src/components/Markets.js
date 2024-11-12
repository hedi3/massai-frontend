import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaChartLine, FaClock, FaCalendarAlt, FaNewspaper, FaBell } from 'react-icons/fa';
import Background from '../components/Background';
import Chatbot from '../chatbot/Chatbot';
import Ticker from '../components/Ticker'; // Import the Ticker component

const MarketsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: ${({ darkMode }) =>
    darkMode
      ? 'linear-gradient(135deg, #1e1e1e, #2c3e50)'
      : 'linear-gradient(135deg, #ffffff, #f5f5f5)'};
  color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
  padding: 2rem;
  position: relative;
  overflow: hidden; /* Prevent horizontal overflow */

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

const TickerContainer = styled.div`
  width: 100%;
  padding: 1rem 0;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  color: ${({ darkMode }) => (darkMode ? '#ffffff' : '#333')};
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
  margin-top: 150px; /* Adjust to match HomePage */
  margin-bottom: 20px; /* Adjust to match HomePage */
  text-align: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 1;
  overflow: hidden; /* Prevent horizontal overflow */
`;

const Section = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem; /* Increased gap between cards */
  position: relative;
  z-index: 1;
`;

const MarketSection = styled(motion.div)`
  background: ${({ darkMode }) => (darkMode ? '#34495e' : '#ffffff')};
  color: ${({ darkMode }) => (darkMode ? '#ecf0f1' : '#333')};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 4px 8px rgba(0, 0, 0, 0.4)' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: ${({ isFirstPage }) => (isFirstPage ? '350px' : '400px')}; /* Adjusted width */
  height: ${({ isFirstPage }) => (isFirstPage ? '300px' : '350px')}; /* Adjusted height */
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0.5)}; /* Adjust opacity for visibility */
  
  &:hover {
    transform: scale(1.05) translateY(-5px); /* Added translateY effect */
    box-shadow: ${({ darkMode }) => (darkMode ? '0 8px 16px rgba(0, 0, 0, 0.5)' : '0 8px 16px rgba(0, 0, 0, 0.2)')};
    background-color: ${({ darkMode }) => (darkMode ? '#2c3e50' : '#f9f9f9')};
  }

  @media (max-width: 768px) {
    width: 100%; /* Stack cards on smaller screens */
  }
`;

const CardIcon = styled.div`
  font-size: ${({ isFirstPage }) => (isFirstPage ? '2.5rem' : '3rem')}; /* Adjust icon size */
  color: ${({ darkMode }) => (darkMode ? '#ffffff' : '#333')};
`;

const CardTitle = styled.h3`
  font-size: ${({ isFirstPage }) => (isFirstPage ? '1.5rem' : '1.75rem')}; /* Adjust title size */
  margin: 0;
  text-align: center;
`;

const CardDescription = styled.p`
  font-size: ${({ isFirstPage }) => (isFirstPage ? '1rem' : '1.125rem')}; /* Adjust description size */
  color: ${({ darkMode }) => (darkMode ? '#bdc3c7' : '#666')};
  text-align: center;
`;

const CardButton = styled.button`
  background-color: #ff6347;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem; /* Adjusted padding */
  font-size: 1rem; /* Adjusted font size */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  
  &:hover {
    background-color: #e5533e;
    transform: scale(1.05);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  z-index: 1;
`;

const PaginationButton = styled.button`
  background-color: ${({ darkMode }) => (darkMode ? '#34495e' : '#ffffff')};
  color: ${({ darkMode }) => (darkMode ? '#ecf0f1' : '#333')};
  border: 1px solid ${({ darkMode }) => (darkMode ? '#ecf0f1' : '#333')};
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  
  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#2c3e50' : '#f0f0f0')};
    color: ${({ darkMode }) => (darkMode ? '#ffffff' : '#000')};
  }
`;

const Markets = ({ darkMode }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3; // Number of cards per page

  // Card data
  const cards = [
    { title: 'Market Overview', description: 'View the latest market trends and analysis.', icon: <FaChartLine /> },
    { title: 'Real-Time Data', description: 'Get up-to-the-minute data on market movements.', icon: <FaClock /> },
    { title: 'Economic Calendar', description: 'Keep track of important economic events.', icon: <FaCalendarAlt /> },
    { title: 'Market News', description: 'Read the latest news affecting the market.', icon: <FaNewspaper /> },
    { title: 'Alerts', description: 'Set up alerts to stay informed on market changes.', icon: <FaBell /> },
  ];

  const totalPages = Math.ceil(cards.length / itemsPerPage);

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  return (
    <MarketsWrapper darkMode={darkMode}>
      <TickerContainer>
        {/* Update Ticker component usage */}
        <Ticker darkMode={darkMode} />
      </TickerContainer>
      <SectionTitle darkMode={darkMode}>
        Market Insights
      </SectionTitle>
      <SectionsContainer>
        <Section>
          {cards.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((card, index) => (
            <MarketSection
              key={index}
              darkMode={darkMode}
              isFirstPage={currentPage === 0}
              isVisible={true} // Ensure visibility for all cards
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <CardIcon isFirstPage={currentPage === 0} darkMode={darkMode}>
                {card.icon}
              </CardIcon>
              <CardTitle isFirstPage={currentPage === 0}>{card.title}</CardTitle>
              <CardDescription darkMode={darkMode} isFirstPage={currentPage === 0}>
                {card.description}
              </CardDescription>
              <CardButton>Learn More</CardButton>
            </MarketSection>
          ))}
        </Section>
      </SectionsContainer>
      <PaginationContainer>
        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationButton
            key={index}
            darkMode={darkMode}
            onClick={() => handlePagination(index)}
          >
            {index + 1}
          </PaginationButton>
        ))}
      </PaginationContainer>
      <Chatbot darkMode={darkMode} />
      <Background />
    </MarketsWrapper>
  );
};

export default Markets;
