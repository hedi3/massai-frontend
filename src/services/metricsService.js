const API_URL = 'http://localhost:8083/api/metrics';

// Fetch user metrics
export const fetchUserMetrics = async (username) => {
  const response = await fetch(`${API_URL}/user/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user metrics');
  }

  return response.json(); // Parse JSON response
};

// Update failed login attempts
export const updateFailedLoginAttempts = async (username, attempts) => {
  const response = await fetch(`${API_URL}/updateFailedLoginAttempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, attempts }),
  });

  if (!response.ok) {
    throw new Error('Failed to update failed login attempts');
  }

  return response.json(); // Parse JSON response
};

// Enable two-factor authentication
export const enableTwoFactorAuthentication = async (username) => {
  const response = await fetch(`${API_URL}/enableTwoFactorAuthentication`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw new Error('Failed to enable two-factor authentication');
  }

  return response.json(); // Parse JSON response
};

// Disable two-factor authentication
export const disableTwoFactorAuthentication = async (username) => {
  const response = await fetch(`${API_URL}/disableTwoFactorAuthentication`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw new Error('Failed to disable two-factor authentication');
  }

  return response.json(); // Parse JSON response
};
