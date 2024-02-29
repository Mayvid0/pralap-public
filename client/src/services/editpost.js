import { doc, setDoc, updateDoc, increment , arrayUnion, arrayRemove} from 'firebase/firestore';
import { db } from '../config/firebase-config'; 

export const updateToFirestore = async (blogId, firestoreBlogObject) => {
  try {
    const blogRef = doc(db, 'post', blogId); 

    await setDoc(blogRef, firestoreBlogObject, { merge: true });

    console.log('Blog updated in Firestore successfully!');
  } catch (error) {
    console.error('Error updating blog in Firestore:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

export const incrementLikesToFirestore = async (blogId,userId,likeValue) => {
  try {
    const blogRef = doc(db, 'post', blogId);
    if(likeValue==0)  likeValue=-1;
    // Increment the "likes" field by 1
    await updateDoc(blogRef, {
      likes: increment(likeValue)
    });

    const secBlogRef = doc(db, 'post_sec_info', blogId);

    if(likeValue==1){
      await setDoc(secBlogRef, {
        users_who_liked: arrayUnion(userId)
      }, { merge: true });
    }else{
      await updateDoc(secBlogRef, {
        users_who_liked: arrayRemove(userId)
      });
    }

    console.log('Likes incremented in Firestore successfully!');
  } catch (error) {
    console.error('Error incrementing likes in Firestore:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

export const archivePostToFiretore =async (blogId,userId,value)=>{
  try {

    const secBlogRef = doc(db, 'post_sec_info', blogId);
    const secUserRef = doc(db,'user_sec_info',userId);

    if(value==1){
      await setDoc(secBlogRef, {
        users_who_archived: arrayUnion(userId)
      }, { merge: true });

      await setDoc(secUserRef,{
        archived: arrayUnion(blogId)
      },{merge:true})
      
    }else{
      await updateDoc(secBlogRef, {
        users_who_archived: arrayRemove(userId)
      });

      await updateDoc(secUserRef, {
        archived: arrayRemove(blogId)
      });

    }

    console.log('archived in Firestore successfully!');
  } catch (error) {
    console.error('Error archiving in Firestore:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}