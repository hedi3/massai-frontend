const API_URL = 'http://localhost:8083/api/users/signup';

export const signup = async (userData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const contentType = response.headers.get('Content-Type');

    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign up');
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to sign up');
      }
    }

    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      return result;
    } else {
      const textResult = await response.text();
      return textResult;
    }
  } catch (error) {
    throw error;
  }
};