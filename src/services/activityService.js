const API_URL = 'http://localhost:8083/api/activities';

// Fetch user activities
export const fetchUserActivities = async (username) => {
  const response = await fetch(`${API_URL}/user/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user activities');
  }

  return response.json(); // Parse JSON response
};

// Optionally, add methods to add or remove activities if needed
// For example:
export const addUserActivity = async (username, activity) => {
  const response = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, activity }),
  });

  if (!response.ok) {
    throw new Error('Failed to add user activity');
  }

  return response.json(); // Parse JSON response
};
