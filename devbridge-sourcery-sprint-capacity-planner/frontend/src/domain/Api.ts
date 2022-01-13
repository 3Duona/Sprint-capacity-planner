import axios from 'axios';

export const host = 'https://localhost:5001/';
const timeout = 4000; //How long waiting for response is too long

export default axios.create({
  baseURL: host,
  timeout: timeout,
});
