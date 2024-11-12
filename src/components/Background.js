// src/components/Background.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes for background icon animations
const moveAnimation = keyframes`
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(10vw) translateY(10vh);
  }
  100% {
    transform: translateX(0) translateY(0);
  }
`;

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  
  .icon {
    position: absolute;
    width: 50px;
    height: 50px;
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.2;
    animation: ${moveAnimation} 20s linear infinite;
  }

  .icon-btc {
    top: 10%;
    left: 10%;
    background: url('https://img.icons8.com/?size=100&id=kcWxTDiqMyya&format=png&color=000000') no-repeat center center;
  }

  .icon-eth {
    top: 25%;
    right: 10%;
    background: url('https://img.icons8.com/ios-filled/50/ethereum.png') no-repeat center center;
  }

  .icon-dollar {
    top: 40%;
    left: 20%;
    background: url('https://img.icons8.com/ios-filled/50/us-dollar-circled.png') no-repeat center center;
  }

  .icon-euro {
    top: 55%;
    right: 20%;
    background: url('https://img.icons8.com/ios-filled/50/euro.png') no-repeat center center;
  }

  .icon-analytics {
    bottom: 15%;
    left: 15%;
    background: url('https://img.icons8.com/ios-filled/50/analyse.png') no-repeat center center;
  }

  .icon-candlestick {
    bottom: 5%;
    right: 15%;
    background: url('https://img.icons8.com/?size=100&id=a6tBVd-DnTv1&format=png&color=000000') no-repeat center center;
  }
`;

const Background = () => {
  return (
    <BackgroundWrapper>
      <div className="icon icon-btc"></div>
      <div className="icon icon-eth"></div>
      <div className="icon icon-dollar"></div>
      <div className="icon icon-euro"></div>
      <div className="icon icon-analytics"></div>
      <div className="icon icon-candlestick"></div>
    </BackgroundWrapper>
  );
};

export default Background;
