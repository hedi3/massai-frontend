import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignInAlt, faUserPlus, faSun, faMoon,
  faHome, faChartLine, faInfoCircle, faUser,
  faSignOutAlt, faSearch, faTimes, faBell,
  faKey, faChartPie, faCog, faTachometerAlt, faWallet
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { faKeybase } from '@fortawesome/free-brands-svg-icons';
import { getDarkMode, setDarkMode } from '../utils/darkMode';
import Deposit from './Deposit';
import Wallet from './Wallet';

// Styled components
const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${props => props.darkMode ? '#2c3e50' : '#ffffff'};
  color: ${props => props.darkMode ? '#ecf0f1' : '#2c3e50'};
  transition: background-color 0.4s ease, color 0.4s ease;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const Logo = styled.img`
  height: 50px;
  width: auto;
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  text-decoration: none;
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
  transition: color 0.3s ease, transform 0.3s ease;
  
  &:hover {
    color: #ff6347;
    transform: translateY(-3px);
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: 350px;
  width: 100%;
`;

const SearchInput = styled.input`
  padding: 0.5rem 2.5rem 0.5rem 3rem;
  border: 1px solid ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
  border-radius: 25px;
  font-size: 1rem;
  background-color: ${(props) => (props.darkMode ? '#34495e' : '#f1f2f6')};
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
  transition: background-color 0.3s ease, border-color 0.3s ease;
  width: 100%;
  
  &:focus {
    border-color: #ff6347;
    outline: none;
    background-color: ${(props) => (props.darkMode ? '#2c3e50' : '#ffffff')};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
  transition: color 0.3s ease;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ff6347;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease, transform 0.3s ease;
  
  &:hover {
    color: #ff6347;
    transform: scale(1.1);
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #ff6347;
  color: #ffffff;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  background: ${(props) => (props.darkMode ? '#34495e' : '#ffffff')};
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
  border-radius: 8px;
  box-shadow: ${(props) => (props.darkMode ? '0 6px 12px rgba(0, 0, 0, 0.4)' : '0 6px 12px rgba(0, 0, 0, 0.2)')};
  width: 220px;
  padding: 1rem;
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 1001;
  transition: opacity 0.4s ease, transform 0.4s ease;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transform: ${({ show }) => (show ? 'translateY(0)' : 'translateY(10px)')};
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
  border-radius: 4px;
  transition: background 0.3s ease, color 0.3s ease;
  
  &:hover {
    background: ${(props) => (props.darkMode ? '#2c3e50' : '#f0f0f0')};
    color: #ff6347;
  }
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  height: 40px;
  width: 40px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const DarkModeButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
  transition: color 0.3s ease, transform 0.3s ease;
  
  &:hover {
    color: #ff6347;
    transform: scale(1.1);
  }
`;

const WalletButton = styled.button`
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #1e7e34;
    transform: translateY(-3px);
  }
`;

const DepositButton = styled(WalletButton)`
  background-color: #007bff;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const Header = ({ onToggleDarkMode, darkMode }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    setShowDropdown(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDepositClick = () => {
    setIsDepositModalOpen(true);
  };

  const closeDepositModal = () => {
    setIsDepositModalOpen(false);
  };

  const handleWalletClick = () => {
    setIsWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  return (
    <>
      <HeaderWrapper darkMode={darkMode}>
        <Link to="/">
          <Logo src={logo} alt="Logo" />
        </Link>
        <NavLinks>
          <NavLink to="/markets" darkMode={darkMode}>
            <FontAwesomeIcon icon={faChartLine} />
            Market
          </NavLink>
          <NavLink to="/offers" darkMode={darkMode}>
            <FontAwesomeIcon icon={faBell} />
            Offer
          </NavLink>
          <NavLink to="/analytics" darkMode={darkMode}>
            <FontAwesomeIcon icon={faChartPie} />
            Analytics
          </NavLink>
          <NavLink to="/about" darkMode={darkMode}>
            <FontAwesomeIcon icon={faInfoCircle} />
            About
          </NavLink>
        </NavLinks>
        <SearchWrapper>
          <SearchIcon darkMode={darkMode}>
            <FontAwesomeIcon icon={faSearch} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            darkMode={darkMode}
          />
          {searchQuery && (
            <ClearButton onClick={handleClearSearch} darkMode={darkMode}>
              <FontAwesomeIcon icon={faTimes} />
            </ClearButton>
          )}
        </SearchWrapper>
        <IconWrapper>
          {isAuthenticated && (
            <>
              <WalletButton onClick={handleWalletClick}>
                <FontAwesomeIcon icon={faWallet} />
                Wallet
              </WalletButton>
              <DepositButton onClick={handleDepositClick}>
                <FontAwesomeIcon icon={faWallet} />
                Deposit Money
              </DepositButton>
            </>
          )}
          <DarkModeButton onClick={onToggleDarkMode} darkMode={darkMode}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </DarkModeButton>
          {isAuthenticated ? (
            <>
              <IconButton onClick={handleProfileClick} darkMode={darkMode}>
                {user?.profilePicture ? (
                  <ProfileImage src={user.profilePicture} alt="Profile" />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
                {user && <NotificationBadge>1</NotificationBadge>}
              </IconButton>
              <DropdownMenu darkMode={darkMode} show={showDropdown}>
                <DropdownItem to="/profile" darkMode={darkMode}>Profile</DropdownItem>
                <DropdownItem to="/settings" darkMode={darkMode}>Settings</DropdownItem>
                <DropdownItem to="/dashboard" darkMode={darkMode}>Dashboard</DropdownItem>
                <DropdownItem onClick={handleLogout} darkMode={darkMode}>Logout</DropdownItem>
              </DropdownMenu>
            </>
          ) : (
            <>
              <NavLink to="/login" darkMode={darkMode}>
                <FontAwesomeIcon icon={faKeybase} />
                Login
              </NavLink>
              <NavLink to="/signup" darkMode={darkMode}>
                <FontAwesomeIcon icon={faUserPlus} />
                Register
              </NavLink>
            </>
          )}
        </IconWrapper>
      </HeaderWrapper>
      {isDepositModalOpen && <Deposit onClose={closeDepositModal} />}
      {isWalletModalOpen && <Wallet onClose={closeWalletModal} />}
    </>
  );
};

export default Header;