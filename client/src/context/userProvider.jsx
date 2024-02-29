// UserProvider.js
import React, { useState, useEffect } from 'react';
import { checkAuthState } from '../services/firebaseAuth';
import { UserContext } from './userContext';


export const UserContextProvider = ({ children }) => {
  const [userProfileInfo, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = checkAuthState((authUser) => {
      setUser(authUser);
    });

    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts
    };
  }, []);

  return (
    <UserContext.Provider value={userProfileInfo}>
      {children}
    </UserContext.Provider>
  );
};
