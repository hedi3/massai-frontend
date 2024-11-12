// src/styles.js
import styled, { keyframes, css } from 'styled-components';
import { FaDollarSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Modal, Button } from 'antd';

// Animations
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const bounceIn = keyframes`
  from { transform: scale(0); }
  to { transform: scale(1); }
`;

// Styled components
export const ButtonBase = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  border-radius: 50%;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: background 0.3s, box-shadow 0.3s;
  ${({ hoverColor }) => hoverColor && css`
    &:hover {
      background-color: ${hoverColor};
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
  `}
`;

export const PriceDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
`;

export const DollarIcon = styled(FaDollarSign)`
  font-size: 24px;
  color: #4caf50;
`;

export const PriceText = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

export const CoinIcon = styled.div`
  font-size: 24px;
  color: #333;
`;

export const CoinName = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  text-align: center;
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: ${({ dropdownOpen }) => (dropdownOpen ? '64vh' : '77vh')};
  margin-top: ${({ dropdownOpen }) => (dropdownOpen ? '35px' : '60px')};
  background: #ffffff;
  border-radius: 15px;
  transition: height 0.3s ease, margin-top 0.3s ease;

  @media (max-width: 768px) {
    height: ${({ dropdownOpen }) => (dropdownOpen ? '35vh' : '45vh')};
  }
`;

export const DropdownToggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const DropdownArrow = styled(ButtonBase)`
  margin: auto;
`;

export const DropdownContainer = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  border-radius: 10px;
  margin-top: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.5s ease-in-out;
  position: relative;
`;

export const DropdownContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`;

export const ActionsMenu = styled.div`
  display: flex;
  gap: 10px;
`;

export const CenteredContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: center;
`;

export const HighEndModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
    background: linear-gradient(145deg, #ffffff, #f1f1f1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    padding: 30px;
    animation: ${fadeIn} 0.5s ease-in-out;
  }

  .ant-modal-header {
    background: #ffffff;
    border-bottom: none;
    text-align: center;
    font-size: 1.5rem;
    color: #333;
    padding: 16px 0;
    border-radius: 20px 20px 0 0;
  }

  .ant-modal-footer {
    display: none;
  }

  .ant-modal-body {
    padding: 20px 40px;
  }
`;

export const ArrowIcon = styled.div`
  font-size: 24px;
  ${({ isUp }) => isUp
    ? css`
        color: green;
        transform: rotate(0deg);
      `
    : css`
        color: red;
        transform: rotate(180deg);
      `
  }
  animation: ${bounceIn} 0.5s ease-in;
  transition: color 0.3s ease;
`;

export const NotificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #333;
  color: #fff;
  border-radius: 8px;
  padding: 10px;
  min-width: 250px;
`;

export const NotificationIcon = styled.div`
  margin-bottom: 10px;
`;

export const NotificationHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const NotificationBody = styled.div`
  font-size: 14px;
`;
