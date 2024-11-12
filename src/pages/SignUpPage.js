import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import { FaUser, FaEnvelope, FaLock, FaPhone, FaImage, FaMale, FaFemale } from 'react-icons/fa'; // Import icons
import Chatbot from '../chatbot/Chatbot';
import Background from '../components/Background';
import { signup } from '../services/signupService';
import { toast, ToastContainer } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Import default styles

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ darkMode }) => (darkMode ? '#1c1c1e' : '#f0f0f0')}; 
  color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
  width: 100%;
  padding: 20px;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 4px 10px rgba(0, 0, 0, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.1)')};
  position: relative;
  z-index: 1; /* Ensure header is above other content */
`;

const Card = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ darkMode }) => (darkMode ? '#282828' : '#ffffff')};
  padding: 40px;
  border-radius: 16px;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 15px 35px rgba(0, 0, 0, 0.5)' : '0 10px 30px rgba(0, 0, 0, 0.1)')};
  backdrop-filter: ${({ darkMode }) => (darkMode ? 'blur(10px)' : 'blur(5px)')};
  transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  max-width: 100%;
  width: 100%;
  max-width: 500px; /* Set max-width for larger screens */
  margin: 80px auto; /* Margin at top and bottom to avoid overlap */
  position: relative;
  overflow: hidden; /* Hide overflow to avoid scrolling issues */
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin: 12px 0;
  border: 1px solid ${({ darkMode }) => (darkMode ? '#444' : '#ddd')};
  border-radius: 10px;
  background: ${({ darkMode }) => (darkMode ? '#333' : '#ffffff')};
  color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
  transition: border-color 0.3s ease-in-out;

  &:focus {
    border-color: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
    outline: none;
    box-shadow: ${({ darkMode }) => (darkMode ? '0 0 5px rgba(0, 123, 255, 0.5)' : '0 0 5px rgba(0, 86, 179, 0.5)')};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
  color: white;
  font-size: 18px;
  margin-top: 12px;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#0056b3' : '#003d7a')};
    transform: scale(1.02);
    box-shadow: ${({ darkMode }) => (darkMode ? '0 4px 10px rgba(0, 123, 255, 0.3)' : '0 4px 10px rgba(0, 86, 179, 0.3)')};
  }
`;

const IconButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
  color: white;
  font-size: 18px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#0056b3' : '#003d7a')};
    transform: scale(1.02);
    box-shadow: ${({ darkMode }) => (darkMode ? '0 4px 10px rgba(0, 123, 255, 0.3)' : '0 4px 10px rgba(0, 86, 179, 0.3)')};
  }
`;

const GenderSelector = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  width: 100%;
`;

const GenderButton = styled.button`
  background: ${({ selected, darkMode }) => (selected ? (darkMode ? '#0056b3' : '#003d7a') : 'transparent')};
  border: 1px solid ${({ darkMode }) => (darkMode ? '#444' : '#ddd')};
  color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease;

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
    border-color: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
  }
`;

const Title = styled(motion.h1)`
  font-size: 2rem; /* Adjust font size for better responsiveness */
  font-weight: bold;
  margin-bottom: 20px;
`;

const ImagePreview = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 2px solid ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
`;

const HiddenInputFile = styled.input`
  display: none;
`;

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
};

const SignUpPage = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: '',
    birthday: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedGender, setSelectedGender] = useState('');

  const navigate = useNavigate(); // Use the useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setFormData({ ...formData, gender });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signup(formData);
      toast.success('User created successfully!');
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      toast.error('Error creating user. Please try again.');
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
            Sign Up
          </Title>
          <form onSubmit={handleSubmit}>
            {imagePreview && (
              <center><ImagePreview src={imagePreview} alt="Profile Preview" darkMode={darkMode} /></center>
            )}
            <Input 
              type="text" 
              name="username" 
              placeholder="Username" 
              darkMode={darkMode} 
              value={formData.username} 
              onChange={handleChange} 
            />
            <Input 
              type="email" 
              name="email" 
              placeholder="Email" 
              darkMode={darkMode} 
              value={formData.email} 
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
            <Input 
              type="text" 
              name="phoneNumber" 
              placeholder="Phone Number" 
              darkMode={darkMode} 
              value={formData.phoneNumber} 
              onChange={handleChange} 
            />
            <GenderSelector>
              <GenderButton 
                darkMode={darkMode} 
                selected={selectedGender === 'male'}
                onClick={() => handleGenderSelect('male')}
              >
                <FaMale />
              </GenderButton>
              <GenderButton 
                darkMode={darkMode} 
                selected={selectedGender === 'female'}
                onClick={() => handleGenderSelect('female')}
              >
                <FaFemale />
              </GenderButton>
            </GenderSelector>
            <Input 
              type="date" 
              name="birthday" 
              placeholder="Birthday" 
              darkMode={darkMode} 
              value={formData.birthday} 
              onChange={handleChange} 
            />
            <IconButton darkMode={darkMode} as="label">
              <FaImage />
              <HiddenInputFile 
                type="file" 
                name="image" 
                onChange={handleFileChange}
                accept="image/*"
              />
              Upload Image
            </IconButton>
            <Button type="submit" darkMode={darkMode}>Sign Up</Button>
          </form>
        </Card>
        <Chatbot darkMode={darkMode} onClick={() => console.log('Chatbot clicked!')} />
      </Header>
    </>
  );
};

export default SignUpPage;
