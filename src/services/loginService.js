// src/services/loginService.js
const API_URL = 'http://localhost:8083/api/users/login';

export const login = async (credentials) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const responseText = await response.text(); // Get raw text response

  console.log('Raw response text:', responseText); // Log raw response text

  if (!response.ok) {
    throw new Error(responseText); // Use responseText for the error message
  }

  // Handle plain text response
  return { message: responseText }; // Return a structured object
};
