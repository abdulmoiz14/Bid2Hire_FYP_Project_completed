// token.js

// Function to save the token to local storage
export const saveToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Function to get the token from local storage
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Function to remove the token from local storage
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  