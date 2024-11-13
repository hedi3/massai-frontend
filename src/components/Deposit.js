import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51QKnZbDUpVnJcmUIqqbiKOYmMjnFlEJ5mCEpLyGraF05AoSm3gp5egDADNI5Df4i3bQAWp6fgGP9p1xSkhA6ayly00kxJtlfV2');

// Keep your existing styled components...
// Neumorphism effect keyframes
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

// Modal Overlay with soft blur and gradient
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
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// Neumorphic modal content with gradient background
const ModalContent = styled.div`
  background: linear-gradient(135deg, #f0f0f3 30%, #d9d9e3 100%);
  border-radius: 20px;
  width: 450px;
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

// Close Button with neumorphism effect
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

// Detailed information section
const InfoSection = styled.div`
  background: #f0f0f3;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2),
              -4px -4px 8px rgba(255, 255, 255, 0.9);
  color: #333;
`;

const InfoTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
`;

const InfoText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;

// Neumorphic form styling
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Label styling
const Label = styled.label`
  font-size: 1rem;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Enhanced input styling with dollar sign icon
const AmountWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f0f0f3;
  border-radius: 10px;
  padding: 0.5rem;
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.2),
              inset -4px -4px 8px rgba(255, 255, 255, 0.9);
  transition: box-shadow 0.3s ease;
  
  &:focus-within {
    box-shadow: inset 6px 6px 12px rgba(0, 0, 0, 0.2),
                inset -6px -6px 12px rgba(255, 255, 255, 0.9);
  }
`;

const DollarIcon = styled.div`
  font-size: 1.25rem;
  color: #333;
  margin-left: 0.5rem;
`;

const Input = styled.input`
  border: none;
  outline: none;
  padding: 0.75rem;
  font-size: 1rem;
  background: transparent;
  color: #333;
  border-radius: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  flex: 1;
  
  &::placeholder {
    color: #aaa;
  }

  &:focus {
    background-color: #e0e0e5;
    transform: scale(1.02);
  }

  /* Hide arrows in number input */
  -moz-appearance: textfield;
  &::-webkit-inner-spin-button, 
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

// Enhanced select wrapper with full width
const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f0f0f3;
  border-radius: 10px;
  padding: 0.5rem;
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.2),
              inset -4px -4px 8px rgba(255, 255, 255, 0.9);
  transition: box-shadow 0.3s ease;
  width: 100%;
  position: relative;
`;

const Select = styled.select`
  border: none;
  outline: none;
  padding: 0.75rem;
  font-size: 1rem;
  background: transparent;
  color: #333;
  cursor: pointer;
  border-radius: 10px;
  background-color: #f0f0f3;
  width: 100%;
  transition: background-color 0.3s ease;
  
  &:focus {
    background-color: #e0e0e5;
  }
`;

const Option = styled.option`
  padding: 0.75rem;
  font-size: 1rem;
`;

// Tooltip for payment methods
const Tooltip = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: #333;
  color: #fff;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  visibility: hidden;
  z-index: 100;
`;

const SelectOption = styled.option`
  position: relative;

  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

// Enhanced Submit Button with ripple effect
const SubmitButton = styled.button`
  background: #333;
  color: #f0f0f3;
  border: none;
  border-radius: 12px;
  padding: 0.75rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: #444;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    background: #888;
    cursor: not-allowed;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transition: transform 0.3s ease;
    transform: translate(-50%, -50%) scale(0);
  }

  &:active::after {
    transform: translate(-50%, -50%) scale(1);
  }
`;

// Loading spinner
const ProgressIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 3px solid #f0f0f3;
  border-radius: 50%;
  border-top: 3px solid #333;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Success/Error Message
const Message = styled.div`
  text-align: center;
  color: ${(props) => (props.type === 'success' ? 'green' : 'red')};
  font-size: 1rem;
  font-weight: bold;
  margin-top: 1rem;
`;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
// `;

const PaymentElementContainer = styled.div`
  background: #f0f0f3;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.2),
              inset -4px -4px 8px rgba(255, 255, 255, 0.9);
`;

// Inner component for the payment form
const PaymentFormContent = ({ amount, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: 'http://localhost:3000/payment-success',
        },
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: 'Payment successful!' });
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Form onSubmit={handleSubmit}>
        <PaymentElementContainer>
          <PaymentElement />
        </PaymentElementContainer>
        <SubmitButton type="submit" disabled={isLoading || !stripe}>
          {isLoading ? <ProgressIndicator /> : 'Pay Now'}
        </SubmitButton>
        {message && <Message type={message.type}>{message.text}</Message>}
      </Form>
  );
};

const Deposit = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('amount'); // 'amount' or 'payment'

  const handleAmountSubmit = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      const response = await fetch('http://localhost:8083/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep('payment');
      } else {
        throw new Error('No client secret received');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <Title>Deposit Money</Title>

          {step === 'amount' ? (
              <Form onSubmit={handleAmountSubmit}>
                <InfoSection>
                  <InfoTitle>Enter Deposit Amount</InfoTitle>
                  <InfoText>
                    Please enter the amount you wish to deposit. You will be redirected to our secure payment processor.
                  </InfoText>
                </InfoSection>

                <Label>
                  Amount (USD):
                  <AmountWrapper>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="0.01"
                        step="0.01"
                    />
                    <DollarIcon>
                      <FontAwesomeIcon icon={faDollarSign} />
                    </DollarIcon>
                  </AmountWrapper>
                </Label>

                <SubmitButton type="submit">
                  Continue to Payment
                </SubmitButton>

                {error && <Message type="error">{error}</Message>}
              </Form>
          ) : (
              clientSecret && (
                  <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            colorPrimary: '#333',
                            colorBackground: '#f0f0f3',
                            colorText: '#333',
                          },
                        },
                      }}
                  >
                    <PaymentFormContent amount={amount} onClose={onClose} />
                  </Elements>
              )
          )}
        </ModalContent>
      </ModalOverlay>
  );
};

export default Deposit;