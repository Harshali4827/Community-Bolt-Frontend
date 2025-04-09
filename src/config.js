import axios from 'axios';

axios.defaults.withCredentials = true; 
const config = {
      //  baseURL: 'http://localhost:5000/api'
      baseURL: process.env.REACT_APP_API_BASE_URL,
  };

export default config;

