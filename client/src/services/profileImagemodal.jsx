import React, { useState } from 'react';

export const EditProfileModal = ({ isOpen, onRequestClose, onUpload, onFileChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    onFileChange(e.target.files[0]);
  };

  const handleUploadClick = async () => {
    try {
      // Set isUploading to true to indicate that the upload is in progress
      setIsUploading(true);

      // Perform the upload
      await onUpload();

      // If the upload is successful, close the modal
      onRequestClose();
    } catch (error) {
      // Handle upload error if needed
      console.error('Error uploading file:', error);
    } finally {
      // Set isUploading back to false, whether the upload succeeds or fails
      setIsUploading(false);
    }
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="absolute w-full h-full bg-gray-800 opacity-75" onClick={onRequestClose}></div>
      <div className="bg-white rounded-lg overflow-hidden z-10">
        <span className="absolute top-0 right-0 cursor-pointer text-3xl px-4 py-2" onClick={onRequestClose}>&times;</span>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Edit Profile Picture</h2>
          <input type="file" onChange={handleFileChange} className="mb-4" />
          <button
            onClick={handleUploadClick}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};
