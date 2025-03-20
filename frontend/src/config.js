import axios from 'axios';

axios.defaults.withCredentials = true; 
const config = {
      baseURL: 'http://localhost:5000'
      // baseURL:'https://dev.communitybolt.com/api'
  };

export default config;

