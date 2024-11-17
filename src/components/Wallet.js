import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faSync, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

// Keeping your existing styled components...
const neumorphism = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #f0f0f3 30%, #d9d9e3 100%);
  border-radius: 20px;
  width: 500px;
  max-width: 90%;
  padding: 2rem;
  box-shadow: 7px 7px 15px rgba(0, 0, 0, 0.2), 
              -7px -7px 15px rgba(255, 255, 255, 0.9);
  animation: ${neumorphism} 0.5s ease-out;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  background: #fee2e2;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #666;
`;


// Close Button
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f0f0f3;
  border: none;
  border-radius: 50%;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.2),
  inset -3px -3px 6px rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 1.5rem;
  color: #333;
  transition: background 0.3s ease, transform 0.3s ease;

  &:hover {
    background: #e0e0e5;
    transform: scale(1.1);
  }
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.6rem;
  text-align: center;
  font-weight: 600;
`;

// Wallet Info Section
const WalletInfo = styled.div`
  background: #f0f0f3;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2),
              -4px -4px 8px rgba(255, 255, 255, 0.9);
  color: #333;
`;

const WalletTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
`;

const WalletText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;

// Transactions List
const TransactionsList = styled.div`
  background: #f0f0f3;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2),
              -4px -4px 8px rgba(255, 255, 255, 0.9);
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
  color: ${(props) => (props.type === 'income' ? 'green' : 'red')};
`;

const TransactionText = styled.span`
  font-size: 1rem;
`;

const TransactionAmount = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

// Refresh Button
const RefreshButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-3px);
  }
`;

const Wallet = ({ onClose }) => {
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch wallet data
      const walletResponse = await fetch(`http://localhost:8083/api/wallets/user/${user.username}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!walletResponse.ok) {
        throw new Error('Failed to fetch wallet data');
      }

      const walletData = await walletResponse.json();
      setWalletData(walletData);

      // Fetch recent transactions
      const transactionsResponse = await fetch(
          `http://localhost:8083/api/transactions/user/${user.username}/last`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
      );

      if (!transactionsResponse.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchWalletData();
    }
  }, [user?.username]);

  const handleRefresh = () => {
    fetchWalletData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
        <ModalOverlay>
          <ModalContent>
            <LoadingSpinner>Loading wallet data...</LoadingSpinner>
          </ModalContent>
        </ModalOverlay>
    );
  }

  return (
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <Title>Wallet Overview</Title>

          {error && (
              <ErrorMessage>
                <FontAwesomeIcon icon={faExclamationCircle} />
                {error}
              </ErrorMessage>
          )}

          <WalletInfo>
            <WalletTitle>Balance</WalletTitle>
            <WalletText>
              <FontAwesomeIcon icon={faDollarSign} />
              {walletData ? walletData.totalBalance : '$0.00'}
            </WalletText>
            <WalletText>
              Last Updated: {walletData?.lastUpdated ? new Date(walletData.lastUpdated).toLocaleString() : 'N/A'}
            </WalletText>
          </WalletInfo>

          <TransactionsList>
            <WalletTitle>Recent Transactions</WalletTitle>
            {transactions.length === 0 ? (
                <WalletText>No recent transactions</WalletText>
            ) : (
                transactions.map((transaction) => (
                    <TransactionItem
                        key={transaction.id}
                        type={transaction.type === 'DEPOSIT' ? 'income' : 'expense'}
                    >
                      <TransactionText>
                        {new Date(transaction.timestamp).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TransactionText>
                      <TransactionAmount>
                        {formatCurrency(transaction.amount)}
                      </TransactionAmount>
                    </TransactionItem>
                ))
            )}
          </TransactionsList>

          <RefreshButton onClick={handleRefresh}>
            <FontAwesomeIcon icon={faSync} />
            Refresh
          </RefreshButton>
        </ModalContent>
      </ModalOverlay>
  );
};

export default Wallet;