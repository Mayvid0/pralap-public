import React, { useState, useContext , useEffect} from 'react';
import { db } from '../config/firebase-config';
import { getDoc, collection, doc,updateDoc,getDocs, query, where } from 'firebase/firestore';
import { UserContext } from '../context/userContext';
import { getAuth, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase-config';

export const ModalForm = () => {
  const [formData, setFormData] = useState({
    bio: '',
    username: '',
    title: '',
  });
  const [loading, setLoading] = useState(false);

   // Adjust this based on your authentication library

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Assuming you have a 'users' collection in Firestore and the document ID is the user's UID
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists) {
          const userData = userDocSnapshot.data();
          setFormData({
            bio: userData.bio,
            username: userData.username ,
            title: userData.title ,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth.currentUser]);




  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const userProfileInfo = useContext(UserContext);
  const uid = userProfileInfo?.uid;

  const [isModalOpen, setModalOpen] = useState(true);



  const closeModal = () => {
    setModalOpen(false);
  };

  const addUser = async () => {
    try {
      setLoading(true);

      // Validate form data (add your validation logic here)

      // Add user data to Firestore using addDoc
      const userDocRef = doc(db, 'users', uid);

    // Update the document
    const updatedData = {
      bio: formData.bio,
      username: formData.username,
      title: formData.title,
    };

    await updateDoc(userDocRef, updatedData);

    const auth = getAuth();
    await updateProfile(auth.currentUser, {
      displayName: formData.username,
    });


    //also update all the posts 

    
      const postsQuery = query(collection(db, 'post'), where('createdBy', '==', auth.currentUser.uid));
      const postsSnapshot = await getDocs(postsQuery);
    
      postsSnapshot.forEach(async (postDoc) => {
        try {
          const postRef = doc(db, 'post', postDoc.id);
    
          // Check if the post document exists before updating
          const postDocExists = (await getDoc(postRef)).exists();
    
          if (postDocExists) {
            // Update the post with the new username
            await updateDoc(postRef, { username: auth.currentUser.displayName });
            // console.log(`Updated username in post ${postDoc.id}`);
          } else {
            console.error(`Post document ${postDoc.id} not found`);
          }
        } catch (updateError) {
          console.error(`Error updating post ${postDoc.id}:`, updateError);
        }
      });
    



      console.log("Document successfully added!");

      // Clear the form fields
      setFormData({ bio: '', username: '', title: '' });

      // Close the modal
      closeModal();
    } catch (error) {
      console.error("Error adding document: ", error);
      // Handle error (e.g., display an error message to the user)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-md w-96">
            <div className="flex justify-end">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
                aria-label="Close"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <h5 className="text-2xl text-center font-bold mb-4">Edit profile</h5>
            {/* Form */}
            <form>
              <div className="mb-4">
                <label htmlFor="bio" className="block text-lg text-left font-medium text-gray-600">
                  Bio:
                </label>
                <textarea
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  id="bio"
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="username" className="block text-lg text-left font-medium text-gray-600">
                  Username:
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="title" className="block text-lg text-left font-medium text-gray-600">
                  Title:
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <button
                type="button"
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                onClick={addUser}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
