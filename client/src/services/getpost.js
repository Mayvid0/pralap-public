import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase-config'; 

export const getPost = async (postId) => {
  try {
    const postRef = doc(db, 'post', postId); 

    const snapshot = await getDoc(postRef);

    if (snapshot.exists()) {
      // The document exists, you can access its data
      const postData = snapshot.data();
      return postData;
    } else {
      // The document does not exist
      console.error('Post not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};
