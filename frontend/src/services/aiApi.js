import api from './api';

export const detectDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await api.post('/ai/detect-disease', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Disease detection error:', error);
    throw error;
  }
};
