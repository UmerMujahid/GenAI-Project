import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; 

export const uploadResume = async (formData) => {
  return await axios.post(`${API_BASE_URL}/upload-resume`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const submitPreferences = async (preferencesData) => {
  return await axios.post(`${API_BASE_URL}/preferences/submit`, preferencesData);
};