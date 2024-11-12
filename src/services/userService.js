const API_URL = 'http://localhost:8083/api/users/profile';

export const fetchUserProfile = async (username) => {
  const response = await fetch(`${API_URL}/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return response.json(); // Parse JSON response
};
