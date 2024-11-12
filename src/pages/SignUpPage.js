import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaImage, FaMale, FaFemale } from 'react-icons/fa';
import Chatbot from '../chatbot/Chatbot';
import Background from '../components/Background';
import { signup } from '../services/signupService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Animation variants
const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const titleVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

// Missing styled components
const Title = styled(motion.h1)`
  font-size: 2.5rem;
  color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
  margin-bottom: 2rem;
  text-align: center;
`;

const ImagePreview = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  object-fit: cover;
  margin-bottom: 20px;
  border: 3px solid ${({ darkMode }) => (darkMode ? '#444' : '#ddd')};
`;

const GenderSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 12px 0;
  width: 100%;
`;

const GenderButton = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  border: 1px solid ${({ darkMode, error }) => (error ? '#ff4444' : darkMode ? '#444' : '#ddd')};
  background: ${({ darkMode, selected }) =>
    selected
        ? darkMode
            ? '#007bff'
            : '#0056b3'
        : darkMode
            ? '#333'
            : '#ffffff'};
  color: ${({ darkMode, selected }) =>
    selected ? '#ffffff' : darkMode ? '#e0e0e0' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
    color: #ffffff;
  }

  svg {
    font-size: 1.5rem;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  margin: 12px 0;
  border: 1px solid ${({ darkMode, error }) => (error ? '#ff4444' : darkMode ? '#444' : '#ddd')};
  border-radius: 10px;
  background: ${({ darkMode }) => (darkMode ? '#333' : '#ffffff')};
  color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#444' : '#f0f0f0')};
  }

  svg {
    font-size: 1.2rem;
  }
`;

const HiddenInputFile = styled.input`
  display: none;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 20px;
  border: none;
  border-radius: 10px;
  background: ${({ darkMode }) => (darkMode ? '#007bff' : '#0056b3')};
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ darkMode }) => (darkMode ? '#0056b3' : '#004494')};
  }
`;

// Existing styled components remain the same
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
  z-index: 1;
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
  max-width: 500px;
  margin: 80px auto;
  position: relative;
  overflow: hidden;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin: 12px 0;
  border: 1px solid ${({ darkMode, error }) => (error ? '#ff4444' : darkMode ? '#444' : '#ddd')};
  border-radius: 10px;
  background: ${({ darkMode }) => (darkMode ? '#333' : '#ffffff')};
  color: ${({ darkMode }) => (darkMode ? '#e0e0e0' : '#333')};
  transition: border-color 0.3s ease-in-out;

  &:focus {
    border-color: ${({ darkMode, error }) => (error ? '#ff4444' : darkMode ? '#007bff' : '#0056b3')};
    outline: none;
    box-shadow: ${({ darkMode, error }) => (error ? '0 0 5px rgba(255, 68, 68, 0.5)' : darkMode ? '0 0 5px rgba(0, 123, 255, 0.5)' : '0 0 5px rgba(0, 86, 179, 0.5)')};
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 12px;
  margin-top: -8px;
  margin-bottom: 8px;
  width: 100%;
  text-align: left;
`;

// Rest of the styled components remain the same...

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

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedGender, setSelectedGender] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.birthday) {
      newErrors.birthday = 'Birthday is required';
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      if (birthDate >= today) {
        newErrors.birthday = 'Birthday must be a past date';
      }
    }

    if (!formData.image) {
      newErrors.image = 'Profile image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, image: 'File size should be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result);
        // Clear error when image is uploaded
        if (errors.image) {
          setErrors({ ...errors, image: '' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setFormData({ ...formData, gender });
    // Clear error when gender is selected
    if (errors.gender) {
      setErrors({ ...errors, gender: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      // Show loading state
      toast.info('Creating account...');

      const result = await signup(formData);
      toast.success('User created successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Form submission error:', error);

      const errorDetails = error.response?.data?.details || {};

      if (errorDetails.general) {
        toast.error(errorDetails.general);
      } else {
        // Handle field-specific errors
        Object.entries(errorDetails).forEach(([field, message]) => {
          setErrors(prev => ({
            ...prev,
            [field]: message
          }));
          toast.error(`${field}: ${message}`);
        });
      }
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
                  error={errors.username}
              />
              {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}

              <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  darkMode={darkMode}
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

              <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  darkMode={darkMode}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
              />
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

              <Input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  darkMode={darkMode}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={errors.phoneNumber}
              />
              {errors.phoneNumber && <ErrorMessage>{errors.phoneNumber}</ErrorMessage>}

              <GenderSelector>
                <GenderButton
                    type="button"
                    darkMode={darkMode}
                    selected={selectedGender === 'MALE'}
                    onClick={() => handleGenderSelect('MALE')}
                    error={errors.gender}
                >
                  <FaMale />
                </GenderButton>
                <GenderButton
                    type="button"
                    darkMode={darkMode}
                    selected={selectedGender === 'FEMALE'}
                    onClick={() => handleGenderSelect('FEMALE')}
                    error={errors.gender}
                >
                  <FaFemale />
                </GenderButton>
              </GenderSelector>
              {errors.gender && <ErrorMessage>{errors.gender}</ErrorMessage>}

              <Input
                  type="date"
                  name="birthday"
                  placeholder="Birthday"
                  darkMode={darkMode}
                  value={formData.birthday}
                  onChange={handleChange}
                  error={errors.birthday}
                  max={new Date().toISOString().split('T')[0]}
              />
              {errors.birthday && <ErrorMessage>{errors.birthday}</ErrorMessage>}

              <IconButton darkMode={darkMode} as="label" error={errors.image}>
                <FaImage />
                <HiddenInputFile
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                />
                Upload Image
              </IconButton>
              {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}

              <Button type="submit" darkMode={darkMode}>Sign Up</Button>
            </form>
          </Card>
          <Chatbot darkMode={darkMode} onClick={() => console.log('Chatbot clicked!')} />
          <ToastContainer position="top-right" />
        </Header>
      </>
  );
};

export default SignUpPage;