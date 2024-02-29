// ProfileImageContext.js
import React from 'react';
import { createContext, useContext, useState } from 'react';

const ProfileImageContext = createContext();

export const ProfileImageProvider = ({ children }) => {
  const [profileImageUrl, setProfileImageUrl] = useState('');

  return (
    <ProfileImageContext.Provider value={{ profileImageUrl, setProfileImageUrl }}>
      {children}
    </ProfileImageContext.Provider>
  );
};

export const useProfileImage = () => {
  return useContext(ProfileImageContext);
};
