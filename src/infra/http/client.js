import axios from 'axios';

const client = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
