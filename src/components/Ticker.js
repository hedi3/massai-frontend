import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoin, faEthereum} from '@fortawesome/free-brands-svg-icons';
import { faArrowUp, faArrowDown, faLitecoinSign, faDog  } from '@fortawesome/free-solid-svg-icons';
import { fetchCryptoPrices } from '../binanceApi'; // Import API function

const TickerWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  background: ${({ darkMode }) => (darkMode ? 'linear-gradient(90deg, #2c3e50, #34495e)' : 'linear-gradient(90deg, #ffffff, #f0f0f0)')};
  color: ${({ darkMode }) => (darkMode ? '#ecf0f1' : '#2c3e50')};
  box-shadow: ${({ darkMode }) => (darkMode ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
  padding: 10px 0;
  position: fixed;
  top: 80px; /* Adjust based on header's height */
  left: 0;
  z-index: 10; /* Ensure it's above other content */
  height: 60px; /* Increased height for better visual balance */
  display: flex;
  align-items: center;
  background: ${({ darkMode }) => (darkMode ? '#2c3e50' : '#ffffff')};
`;

const TickerContent = styled.div`
  display: flex;
  white-space: nowrap;
  width: 200%; /* Ensure the content width is sufficient */
  animation: scroll 30s linear infinite;
  will-change: transform; /* Hint to the browser to optimize rendering */
  
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`;

const TickerItem = styled.div`
  padding: 0 2rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  color: ${({ darkMode }) => (darkMode ? '#ecf0f1' : '#2c3e50')};
  border-right: 1px solid ${({ darkMode }) => (darkMode ? '#34495e' : '#e0e0e0')};
  height: 100%;
  box-sizing: border-box;
  
  &:last-child {
    border-right: none;
  }

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#34495e' : '#f5f5f5')};
    transform: scale(1.02);
    transition: transform 0.2s ease-in-out; /* Smooth transition */
  }
`;

const TickerItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TickerItemText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PriceChangeIndicator = styled.span`
  color: ${({ changeType }) => (changeType === 'up' ? '#2ecc71' : '#e74c3c')};
  font-size: 1rem;
  margin-left: 5px;
`;

const Ticker = ({ darkMode }) => {
  const [tickerItems, setTickerItems] = useState([]);

  const fetchAndUpdatePrices = async () => {
    try {
      const prices = await fetchCryptoPrices();
      const formattedPrices = prices.map(coin => ({
        name: coin.symbol.replace('USDT', ''), // Simplify the name
        price: parseFloat(coin.price).toFixed(2),
        change: Math.random() * 10 - 5 // Replace with real change data if available
      }));

      // Fill with default items if no prices are fetched
      if (formattedPrices.length === 0) {
        formattedPrices.push(
          { name: 'BTC', price: '0.00', change: 0 },
          { name: 'ETH', price: '0.00', change: 0 },
          { name: 'LTC', price: '0.00', change: 0 },
          { name: 'XRP', price: '0.00', change: 0 },
          { name: 'ADA', price: '0.00', change: 0 },
          { name: 'DOT', price: '0.00', change: 0 },
          { name: 'SOL', price: '0.00', change: 0 },
          { name: 'BNB', price: '0.00', change: 0 },
          { name: 'MATIC', price: '0.00', change: 0 },
          { name: 'DOGE', price: '0.00', change: 0 }
        );
      }

      setTickerItems(formattedPrices);
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
      // Use default items in case of an error
      setTickerItems([
        { name: 'BTC', price: '0.00', change: 0 },
        { name: 'ETH', price: '0.00', change: 0 },
        { name: 'LTC', price: '0.00', change: 0 },
        { name: 'XRP', price: '0.00', change: 0 },
        { name: 'ADA', price: '0.00', change: 0 },
        { name: 'DOT', price: '0.00', change: 0 },
        { name: 'SOL', price: '0.00', change: 0 },
        { name: 'BNB', price: '0.00', change: 0 },
        { name: 'MATIC', price: '0.00', change: 0 },
        { name: 'DOGE', price: '0.00', change: 0 }
      ]);
    }
  };

  useEffect(() => {
    fetchAndUpdatePrices();
    const interval = setInterval(fetchAndUpdatePrices, 30000);

    return () => clearInterval(interval);
  }, []);

  const renderIcon = (crypto) => {
    switch (crypto) {
      case 'BTC':
        return <FontAwesomeIcon icon={faBitcoin} />;
      case 'ETH':
        return <FontAwesomeIcon icon={faEthereum} />;
      case 'LTC':
        return <FontAwesomeIcon icon={faLitecoinSign} />;
      case 'DOGE':
        return <FontAwesomeIcon icon={faDog} />;
      // No icons for additional cryptocurrencies
      default:
        return null;
    }
  };

  // Ensure duplicatedItems array is not empty and has sufficient content for continuous scrolling
  const duplicatedItems = tickerItems.length > 0 ? [...tickerItems, ...tickerItems] : [{ name: 'Loading...', price: '0.00', change: 0 }];

  return (
    <TickerWrapper darkMode={darkMode} role="banner" aria-label="Cryptocurrency Ticker">
      <TickerContent>
        {duplicatedItems.map((item, index) => (
          <TickerItem key={index} darkMode={darkMode}>
            <TickerItemContent>
              {renderIcon(item.name)}
              <TickerItemText>
                {item.name}: ${item.price}
                <PriceChangeIndicator changeType={item.change > 0 ? 'up' : 'down'}>
                  <FontAwesomeIcon icon={item.change > 0 ? faArrowUp : faArrowDown} />
                  {item.change}%
                </PriceChangeIndicator>
              </TickerItemText>
            </TickerItemContent>
          </TickerItem>
        ))}
      </TickerContent>
    </TickerWrapper>
  );
};

export default Ticker;
