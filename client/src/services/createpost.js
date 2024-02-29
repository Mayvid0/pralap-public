import { db } from "../config/firebase-config";
import { setDoc, collection, doc, arrayUnion } from "firebase/firestore";


export const saveToFirestore = async (firestoreBlogObject) => {
    try {
      // Assuming you have a function to interact with Firestore
      // You can use a library like Firebase SDK or any other Firestore client

      // Example: Save information in Firestore
      const blogDocRef = doc(
        collection(db, "post"),
        firestoreBlogObject.postId
      );
      await setDoc(blogDocRef, {
        ...firestoreBlogObject,
      });

      const secBlogDocRef = doc(
        collection(db,'post_sec_info'),
        firestoreBlogObject.postId
      );
      await setDoc(secBlogDocRef,{
        "users_who_liked": [

        ],
        "users_who_archived": [
          
        ],
        "postId": firestoreBlogObject.postId
      })

      const secUserDocRef = doc(collection(db,'user_sec_info'),firestoreBlogObject.createdBy);
      await setDoc(secUserDocRef,{
        public_posts: arrayUnion(firestoreBlogObject.postId) 
      },{merge:true})

      console.log("Information saved to Firestore successfully!");
    } catch (error) {
      console.error("Error saving to Firestore:", error.message);
    }
  };