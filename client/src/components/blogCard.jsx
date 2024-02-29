import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/userContext";
import { db } from "../config/firebase-config";
import {
  collection,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

export const BlogCard = ({ post }) => {
  // console.log(post)
  const postId = post.postId;
  // console.log(blogId)

  const navigate = useNavigate();

  const truncateDescription = (text, maxChars) => {
    if (text.length > maxChars) {
      return text.substring(0, maxChars).trim() + " ...";
    }
    return text;
  };
  const truncatedDescription = truncateDescription(post.description, 200);

  const redirectToProfile = () => {
    // console.log("Redirecting to profile", post.createdBy)
    navigate(`/profile/${post.createdBy}`);
  };

  const redirectToBlog = () => {
    navigate(`/blogs/blog/${postId}`);
  };

  const userProfileInfo = useContext(UserContext);
  const userUid = userProfileInfo?.uid;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const postSecInfoRef = doc(db, "post_sec_info", postId);

    const unsubscribePostSecInfo = onSnapshot(postSecInfoRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        // Log the data object to see its structure

        // Check if data and data.users_who_liked are defined
        if (data && data.users_who_liked) {
          // Log the users_who_liked array to see its content
          // console.log("Users who liked:", data.users_who_liked);

          // Check if the current user is in the "users_who_liked" array
          const isCurrentUserLiked = data.users_who_liked.includes(userUid);
          // console.log("Is current user liked:", isCurrentUserLiked);

          // Update state accordingly
          setLiked(isCurrentUserLiked);
        } else {
          // Handle the case where data.users_who_liked is undefined or null
          console.error("Data or users_who_liked is undefined or null");
        }
      } else {
        // Log a message if the document doesn't exist
        console.error("Document does not exist");
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribePostSecInfo();
  }, [postId, userUid]);

  return (
    <>
      <div className="md:m-5 my-2 px-2 ">
        <div
          href="#"
          className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow mx-auto md:flex-row md:mx-auto md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <img
            className="md:p-3 object-cover w-full rounded-t-lg h-48 md:h-96 md:w-2/4 md:rounded-none md:rounded-s-lg"
            src={post.blogImageUrl}
            alt=""
          />

          <div className="">
            <div className="flex flex-col justify-between p-2 leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {post.title}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400 overflow-hidden">
                {truncatedDescription}
                {/* {post.description} */}
              </p>

              <div className="mt-10 flex flex-row justify-start">
                <span
                  onClick={redirectToProfile}
                  className="font-serif text-white"
                >
                  {post.username}
                </span>
                <span className="ml-40 mr-2 font-medium text-white">
                  {post.likes}
                </span>
                {liked ? (
                  <FontAwesomeIcon
                    className="mt-1"
                    icon={faHeart}
                    style={{ color: "red", fontSize: "1.25em" }}
                  />
                ) : (
                  <FontAwesomeIcon className="mt-1" icon={faHeart} />
                )}
                <span className="ml-5 mr-2 font-medium text-white">
                  {post.comments}
                </span>
                <FontAwesomeIcon className="mt-1" icon={faComment} />
              </div>

              <div className="mt-10 flex md:flex-row justify-items-start ">
                <span className="mr-20 font-thin text-white">
                  {post.createdWhen}
                </span>
                <span
                  onClick={redirectToBlog}
                  className="text-white ml-10 hover:scale-110 transition-transform"
                >
                  Read More
                </span>

                <FontAwesomeIcon
                  className="ml-2 mt-1 hover:scale-125 transition-transform "
                  icon={faArrowRight}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
