// signupService.js
const API_URL = 'http://localhost:8083/api/users/signup';

export const signup = async (formData) => {
  try {
    // Log the request data
    console.log('Sending signup request with data:', {
      ...formData,
      password: '***hidden***' // Hide sensitive data in logs
    });

    // Transform the date and prepare request data
    const transformedData = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      birthday: formData.birthday ? new Date(formData.birthday).toISOString().split('T')[0] : null,
      image: formData.image
    };

    // Add CORS headers and credentials
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(transformedData),
      credentials: 'include'
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries([...response.headers]));

    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      if (response.status === 400) {
        throw {
          response: {
            status: 400,
            data: {
              details: data.details || { general: data.message || 'Validation failed' }
            }
          }
        };
      }

      throw {
        response: {
          status: response.status,
          data: {
            details: { general: data.message || 'Server error occurred' }
          }
        }
      };
    }

    return data;
  } catch (error) {
    console.error('Signup error:', error);

    // Check if it's a network error
    if (!error.response) {
      console.error('Network error details:', {
        error: error.message,
        type: error.type,
        name: error.name
      });
      throw {
        response: {
          data: {
            details: {
              general: 'Unable to connect to the server. Please check your internet connection and try again.'
            }
          }
        }
      };
    }

    // Re-throw the error with response data
    throw error;
  }
};