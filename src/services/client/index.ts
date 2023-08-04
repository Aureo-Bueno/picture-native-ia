import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.clarifai.com',
  headers: {
    Bearer: 'Key',
  }
});
