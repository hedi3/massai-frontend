import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaImage, FaMale, FaFemale } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Background from '../components/Background';
import Chatbot from '../chatbot/Chatbot';

// Styled Components
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $darkMode }) => ($darkMode ? '#1c1c1e' : '#f0f0f0')};
  color: ${({ $darkMode }) => ($darkMode ? '#e0e0e0' : '#333')};
  width: 100%;
  padding: 20px;
  box-shadow: ${({ $darkMode }) => ($darkMode ? '0 4px 10px rgba(0, 0, 0, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.1)')};
  position: relative;
  z-index: 1;
`;

const Card = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ $darkMode }) => ($darkMode ? '#282828' : '#ffffff')};
  padding: 40px;
  border-radius: 16px;
  box-shadow: ${({ $darkMode }) => ($darkMode ? '0 15px 35px rgba(0, 0, 0, 0.5)' : '0 10px 30px rgba(0, 0, 0, 0.1)')};
  backdrop-filter: ${({ $darkMode }) => ($darkMode ? 'blur(10px)' : 'blur(5px)')};
  transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
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
  border: 1px solid ${({ $darkMode }) => ($darkMode ? '#444' : '#ddd')};
  border-radius: 10px;
  background: ${({ $darkMode }) => ($darkMode ? '#333' : '#ffffff')};
  color: ${({ $darkMode }) => ($darkMode ? '#e0e0e0' : '#333')};
  transition: border-color 0.3s ease-in-out;

  &:focus {
    border-color: ${({ $darkMode }) => ($darkMode ? '#007bff' : '#0056b3')};
    outline: none;
    box-shadow: ${({ $darkMode }) => ($darkMode ? '0 0 5px rgba(0, 123, 255, 0.5)' : '0 0 5px rgba(0, 86, 179, 0.5)')};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: ${({ $darkMode }) => ($darkMode ? '#007bff' : '#0056b3')};
  color: white;
  font-size: 18px;
  margin-top: 12px;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  opacity: ${({ $disabled }) => ($disabled ? '0.7' : '1')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background: ${({ $darkMode, $disabled }) => (!$disabled ? ($darkMode ? '#0056b3' : '#003d7a') : '')};
    transform: ${({ $disabled }) => (!$disabled ? 'scale(1.02)' : 'none')};
    box-shadow: ${({ $darkMode, $disabled }) => (!$disabled ? ($darkMode ? '0 4px 10px rgba(0, 123, 255, 0.3)' : '0 4px 10px rgba(0, 86, 179, 0.3)') : 'none')};
  }
`;

const GenderSelector = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  width: 100%;
`;

const GenderButton = styled.button`
  background: ${({ $selected, $darkMode }) => ($selected ? ($darkMode ? '#0056b3' : '#003d7a') : 'transparent')};
  border: 1px solid ${({ $darkMode }) => ($darkMode ? '#444' : '#ddd')};
  color: ${({ $darkMode }) => ($darkMode ? '#e0e0e0' : '#333')};
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease;

  &:hover {
    background: ${({ $darkMode }) => ($darkMode ? '#007bff' : '#0056b3')};
    border-color: ${({ $darkMode }) => ($darkMode ? '#007bff' : '#0056b3')};
    color: white;
  }
`;

const Title = styled(motion.h1)`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: ${({ $darkMode }) => ($darkMode ? '#e0e0e0' : '#333')};
`;

const ImagePreviewWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const ImagePreview = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid ${({ $darkMode }) => ($darkMode ? '#007bff' : '#0056b3')};
`;

const ErrorMessage = styled.span`
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: -8px;
  margin-bottom: 8px;
  display: block;
`;

const FormWrapper = styled.div`
  width: 100%;
`;

// Animation variants
const formVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
};

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
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

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedGender, setSelectedGender] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    if (!formData.birthday) {
      newErrors.birthday = 'Birthday is required';
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.birthday = 'You must be at least 13 years old to register';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload an image file (JPEG, PNG, or GIF)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setFormData(prev => ({
      ...prev,
      gender
    }));
    if (errors.gender) {
      setErrors(prev => ({
        ...prev,
        gender: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8083/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.text(); // Read the response body as text
        console.log("Error message:", errorData); // Log the error message
        throw new Error(errorData || 'Signup failed');
      }



      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);

      let errorMessage = 'Failed to create account. Please try again.';

      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        errorMessage = 'Username already exists. Please choose a different username.';
      } else if (error.message) {
        // If there's a specific error message, use it
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <>
        <Header $darkMode={darkMode}>
          <Background />
          <Card
              $darkMode={darkMode}
              initial="hidden"
              animate="visible"
              variants={formVariants}
          >
            <Title
                variants={titleVariants}
                $darkMode={darkMode}
            >
              Sign Up
            </Title>
            <FormWrapper>
              <form onSubmit={handleSubmit} noValidate>
                {imagePreview && (
                    <ImagePreviewWrapper>
                      <ImagePreview
                          src={imagePreview}
                          alt="Profile Preview"
                          $darkMode={darkMode}
                      />
                    </ImagePreviewWrapper>
                )}

                <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    $darkMode={darkMode}
                    value={formData.username}
                    onChange={handleChange}
                    aria-label="Username"
                    aria-invalid={!!errors.username}
                    style={errors.username ? { borderColor: '#ff4444' } : {}}
                />
                {errors.username && <ErrorMessage role="alert">{errors.username}</ErrorMessage>}

                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    $darkMode={darkMode}
                    value={formData.email}
                    onChange={handleChange}
                    aria-label="Email"
                    aria-invalid={!!errors.email}
                    style={errors.email ? { borderColor: '#ff4444' } : {}}
                />
                {errors.email && <ErrorMessage role="alert">{errors.email}</ErrorMessage>}

                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    $darkMode={darkMode}
                    value={formData.password}
                    onChange={handleChange}
                    aria-label="Password"
                    aria-invalid={!!errors.password}
                    style={errors.password ? { borderColor: '#ff4444' } : {}}
                />
                {errors.password && <ErrorMessage role="alert">{errors.password}</ErrorMessage>}

                <Input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    $darkMode={darkMode}
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    aria-label="Phone Number"
                    aria-invalid={!!errors.phoneNumber}
                    style={errors.phoneNumber ? { borderColor: '#ff4444' } : {}}
                />
                {errors.phoneNumber && <ErrorMessage role="alert">{errors.phoneNumber}</ErrorMessage>}

                <GenderSelector role="group" aria-label="Gender Selection">
                  <GenderButton
                      type="button"
                      $darkMode={darkMode}
                      $selected={selectedGender === 'male'}
                      onClick={() => handleGenderSelect('male')}
                      aria-label="Male"
                      aria-pressed={selectedGender === 'male'}
                  >
                    <FaMale />
                  </GenderButton>
                  <GenderButton
                      type="button"
                      $darkMode={darkMode}
                      $selected={selectedGender === 'female'}
                      onClick={() => handleGenderSelect('female')}
                      aria-label="Female"
                      aria-pressed={selectedGender === 'female'}
                  >
                    <FaFemale />
                  </GenderButton>
                </GenderSelector>
                {errors.gender && <ErrorMessage role="alert">{errors.gender}</ErrorMessage>}

                <Input
                    type="date"
                    name="birthday"
                    placeholder="Birthday"
                    $darkMode={darkMode}
                    value={formData.birthday}
                    onChange={handleChange}
                    aria-label="Birthday"
                    aria-invalid={!!errors.birthday}
                    style={errors.birthday ? { borderColor: '#ff4444' } : {}}
                />
                {errors.birthday && <ErrorMessage role="alert">{errors.birthday}</ErrorMessage>}

                <Button
                    as="label"
                    $darkMode={darkMode}
                    $disabled={isSubmitting}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.currentTarget.click();
                      }
                    }}
                >
                  <FaImage />
                  <span>Upload Image</span>
                  <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/gif"
                      style={{ display: 'none' }}
                      aria-label="Upload Profile Image"
                  />
                </Button>

                <Button
                    type="submit"
                    $darkMode={darkMode}
                    $disabled={isSubmitting}
                    aria-label={isSubmitting ? 'Creating Account...' : 'Sign Up'}
                >
                  {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            </FormWrapper>
          </Card>
          <Chatbot darkMode={darkMode} onClick={() => console.log('Chatbot clicked!')} />
        </Header>
      </>
  );
};

export default SignUpPage;