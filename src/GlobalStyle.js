import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => (props.darkMode ? '#121212' : '#f0f0f0')};
    color: ${(props) => (props.darkMode ? '#e0e0e0' : '#121212')};
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

export default GlobalStyle;
