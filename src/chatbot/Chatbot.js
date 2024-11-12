// src/components/Chatbot.js
import React from 'react';
import { Widget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import './Chatbot.css';
import { FaBitcoin } from 'react-icons/fa';

const ChatbotWrapper = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 1000,
};

const ChatbotIcon = {
  position: 'absolute',
  bottom: '60px',
  right: '10px',
  display: 'flex',
  alignItems: 'center',
};

const Chatbot = () => {
  return (
    <div style={ChatbotWrapper}>
      <div style={ChatbotIcon}>
        <FaBitcoin size={40} color="#ff6347" />
      </div>
      <Widget
        title="Trading Bot"
        subtitle="How can I assist you today?"
      />
    </div>
  );
};

export default Chatbot;
