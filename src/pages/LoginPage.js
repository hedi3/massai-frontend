import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Chatbot from '../chatbot/Chatbot';
import Background from '../components/Background';
import { login as loginService } from '../services/loginService';
import { useAuth } from '../context/AuthContext';

// Styled components with dark mode support

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ darkMode }) =>
    darkMode
      ? 'linear-gradient(135deg, #1e1e1e, #2c3e50)'
      : 'linear-gradient(135deg, #ffffff, #e0e0e0)'};
  color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
  width: 100%;
  height: 100vh;
  padding: 20px;
  position: relative;
  transition: background 0.3s ease;
`;

const Card = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ darkMode }) =>
    darkMode
      ? '#2c3e50' // Use a single dark color to match the home page
      : '#f7f7f7'};
  padding: 40px;
  border-radius: 16px;
  box-shadow: ${({ darkMode }) =>
    darkMode
      ? '0 15px 35px rgba(0, 0, 0, 0.5)' // Deeper shadow for dark mode
      : '0 10px 30px rgba(0, 0, 0, 0.1)'};
  max-width: 400px;
  width: 100%;
  margin-top: 75px;
  transition: background 0.3s ease, box-shadow 0.3s ease;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin: 12px 0;
  border: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ddd')}; // Slightly darker border in dark mode
  border-radius: 10px;
  background: ${({ darkMode }) => (darkMode ? '#333' : '#ffffff')}; // Keep input background consistent with dark mode
  color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
  transition: border-color 0.3s ease-in-out;

  &:focus {
    border-color: ${({ darkMode }) => (darkMode ? '#1abc9c' : '#3498db')}; // Consistent focus color
    outline: none;
    box-shadow: ${({ darkMode }) => (darkMode ? '0 0 5px rgba(26, 188, 156, 0.5)' : '0 0 5px rgba(52, 152, 219, 0.5)')};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')}; // Primary blue color
  color: white;
  font-size: 18px;
  margin-top: 12px;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#0056b3' : '#003d7a')}; // Darker shade on hover
    transform: scale(1.02);
    box-shadow: ${({ darkMode }) => (darkMode ? '0 4px 10px rgba(0, 123, 255, 0.3)' : '0 4px 10px rgba(0, 86, 179, 0.3)')}; // Subtle shadow
  }

  &:focus {
    outline: none;
    background: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')}; // Retain background color on focus
    box-shadow: ${({ darkMode }) => (darkMode ? '0 0 5px rgba(0, 123, 255, 0.5)' : '0 0 5px rgba(0, 86, 179, 0.5)')}; // Focus ring
  }
`;

const SocialButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: ${({ bgColor }) => bgColor || '#333'};
  margin-top: 10px;

  &:hover {
    background: ${({ hoverColor }) => hoverColor || '#111'};
  }
`;

const Separator = styled.div`
  margin: 30px 0;
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
  color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};

  &:before,
  &:after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ddd')};
  }

  &:before {
    margin-right: 15px;
  }

  &:after {
    margin-left: 15px;
  }
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: ${({ darkMode }) => (darkMode ? '#fff' : '#333')};
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
`;

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
};

const LoginPage = ({ darkMode }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginService(formData);

      if (result && result.message === 'Login successful.') {
        login(formData);
        navigate('/');
      } else {
        throw new Error('Invalid user data');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Header darkMode={darkMode}>
        <Background />
        <Card
          darkMode={darkMode}
          initial="hidden"
          animate="visible"
          variants={formVariants}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Title
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            <FontAwesomeIcon icon={faUserCircle} size="2x" color={darkMode ? '#ecf0f1' : '#2c3e50'} />
          </Title>
          <form onSubmit={handleSubmit}>
            <Input 
              type="text" 
              name="username" 
              placeholder="Username" 
              darkMode={darkMode} 
              value={formData.username} 
              onChange={handleChange} 
            />
            <Input 
              type="password" 
              name="password" 
              placeholder="Password" 
              darkMode={darkMode} 
              value={formData.password} 
              onChange={handleChange} 
            />
            {error && <ErrorText>{error}</ErrorText>}
            <Button type="submit" darkMode={darkMode}>Login</Button>
            <Separator darkMode={darkMode}>or</Separator>
            <SocialButton 
              as="a" 
              href="/auth/facebook" 
              bgColor={darkMode ? '#3b5998' : '#3498db'} 
              hoverColor={darkMode ? '#2d4373' : '#2980b9'}
            >
              <FontAwesomeIcon icon={faFacebook} /> Login with Facebook
            </SocialButton>
            <SocialButton 
              as="a" 
              href="/auth/google" 
              bgColor={darkMode ? '#db4437' : '#e74c3c'} 
              hoverColor={darkMode ? '#c23321' : '#c0392b'}
            >
              <FontAwesomeIcon icon={faGoogle} /> Login with Google
            </SocialButton>
          </form>
        </Card>
        <Chatbot darkMode={darkMode} />
      </Header>
    </>
  );
};

export default LoginPage;
