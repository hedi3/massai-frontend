import React from 'react';
import styled from 'styled-components';

const CalendarWrapper = styled.div`
  margin-bottom: 2rem;
`;

const CalendarTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: ${(props) => (props.darkMode ? '#ecf0f1' : '#2c3e50')};
`;

const EventCard = styled.div`
  background: ${(props) => (props.darkMode ? '#34495e' : '#f9f9f9')};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: ${(props) => (props.darkMode ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
`;

const EconomicCalendar = ({ darkMode }) => {
  return (
    <CalendarWrapper>
      <CalendarTitle darkMode={darkMode}>Economic Calendar</CalendarTitle>
      <EventCard darkMode={darkMode}>
        <h3>Upcoming Events</h3>
        <p>Details about upcoming economic events.</p>
      </EventCard>
    </CalendarWrapper>
  );
};

export default EconomicCalendar;
