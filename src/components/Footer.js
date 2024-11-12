// src/components/Footer.js
import React from 'react';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const FooterWrapper = styled.footer`
  background: ${({ darkMode }) => (darkMode ? '#1e1e1e' : '#ffffff')};
  color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
  padding: 20px;
  text-align: center;
  border-top: 1px solid ${({ darkMode }) => (darkMode ? '#34495e' : '#ddd')};
  position: relative;
  bottom: 0;
  width: 100%;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SocialIcons = styled.div`
  margin: 20px 0;

  a {
    color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
    margin: 0 15px;
    font-size: 1.5rem;
    transition: color 0.3s ease;

    &:hover {
      color: #ff6347;
    }
  }
`;

const FooterNav = styled.div`
  margin-bottom: 20px;

  a {
    color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
    margin: 0 15px;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #ff6347;
    }
  }
`;

const Footer = ({ darkMode }) => {
  return (
    <FooterWrapper darkMode={darkMode}>
      <FooterContent>
        <FooterNav darkMode={darkMode}>
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </FooterNav>
        <SocialIcons darkMode={darkMode}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </SocialIcons>
        <p>&copy; 2024 StockXchange. All rights reserved.</p>
        <p>
          <a href="#privacy" style={{ color: darkMode ? '#e0e0e0' : '#333' }}>Privacy Policy</a> |{' '}
          <a href="#terms" style={{ color: darkMode ? '#e0e0e0' : '#333' }}>Terms of Service</a>
        </p>
      </FooterContent>
    </FooterWrapper>
  );
};

export default Footer;
