import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)} // Navigate to the previous page
      className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-4"
    >
      Back
    </button>
  );
};

export default BackButton;