import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import copy from "clipboard-copy";
import { useSpring, animated, config } from "react-spring";
import { UserContext } from "../../context/userContext";
import "../../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faBookBookmark,
  faShare,
  faListDots
} from "@fortawesome/free-solid-svg-icons";
import {deletePost} from "../../services/deletepost"
import { incrementLikesToFirestore } from "../../services/editpost";
import { archivePostToFiretore } from "../../services/editpost";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import image from "../../assets/img1.jpeg"

import { collection, doc, getDoc, deleteDoc, setDoc, onSnapshot, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { Footer } from "../../components/footer";

const BlogPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [mongoData, setMongoData] = useState(null);

  const userProfileInfo = useContext(UserContext);
  const userUid = userProfileInfo?.uid;

  // 3 dots thingy
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openDropDown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  //make private or public
  const handleMakePrivate = async () => {
    // Logic for "Make Private" action
    await makePrivate();
    setDropdownOpen(false);
  };

  const makePrivate = async () => {
    try {
      const blogRef = doc(db, 'post', postId);
      const newMakePrivateorPublic = !post.public;

      await setDoc(blogRef, { public: newMakePrivateorPublic }, { merge: true });

      const secUserRef = doc(db,'user_sec_info', userUid);
      const privateOrNot = newMakePrivateorPublic ? 0 : 1 // if false then post is private
      if(privateOrNot==1){
        await setDoc(secUserRef ,{
          private_posts: arrayUnion(postId),
          public_post_count: increment(-1)
        }, {merge:true})
        await setDoc(secUserRef,{public_posts: arrayRemove(postId)}, {merge:true})
      } else{
        await setDoc(secUserRef ,{
          private_posts: arrayRemove(postId),
          public_post_count: increment(1)
        }, {merge:true})
        await setDoc(secUserRef,{public_posts: arrayUnion(postId)}, {merge:true})
      }

      console.log('Blog updated in Firestore successfully!');
    } catch (error) {
      console.error('Error updating blog in Firestore:', error);
    }
  };

  const handleEdit = () => {
    // Logic for "Edit" action
    navigate(`/create/${postId}`)
  };

  const handleDelete = () => {
    // Logic to open the delete confirmation modal
    setDeleteModalOpen(true);
    setDropdownOpen(false);
  };

  const handleDeleteConfirmation = async () => {
    setDeleting(true);
    const responseFromMongo = await deletePost(postId);

    try {
      const data = await responseFromMongo.json();
    
      if (responseFromMongo.status === 200) {

        if (data.success) {
          // Handle successful response
          const postRef = doc(db, "post", postId);
          await deleteDoc(postRef);
          const secPostRef= doc(db, "post_sec_info", postId);
          await deleteDoc(secPostRef);
          const secUserRef = doc(db, "user_sec_info", userUid);
          await setDoc(secUserRef, {
            // public_posts: arrayRemove(postId),
            public_post_count: increment(-1)
          }, {merge:true})
          navigate("/explore");
        } else {

          console.error("Deletion failed. Server message:", data.message);
        }
      } else {

        console.error("Unexpected response status:", responseFromMongo.status);
      }
    } catch (error) {
      // Handle errors during parsing the JSON response
      console.error("Error parsing JSON response:", error);
    }
  };

  const handleDeleteCancel = () => {
    // Logic to close the delete confirmation modal
    setDeleteModalOpen(false);
  };

 

  //post has all other info , mongodata has the content and can also have the comments section

  useEffect(() => {
    const blogRef = doc(db, 'post', postId);
    const postSecInfoRef = doc(db, 'post_sec_info', postId);
  
    const unsubscribeBlog = onSnapshot(blogRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setPost(data);
      }
    });
  
    const unsubscribePostSecInfo = onSnapshot(postSecInfoRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        // Check if the current user is in the "users_who_liked" array
        const isCurrentUserLiked = data.users_who_liked.includes(userUid);

        // Update state accordingly
        setLiked(isCurrentUserLiked);

      }
    });

    const unsubscribePostSecInfoArchive = onSnapshot(postSecInfoRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        // Check if the current user is in the "users_who_liked" array
        const isCurrentUserArchived = data.users_who_archived.includes(userUid);
        // Update state accordingly

        setArchived(isCurrentUserArchived)
      }
    });

    
  
    return () => {
      unsubscribeBlog();
      unsubscribePostSecInfo();
      unsubscribePostSecInfoArchive();
    };
  }, [postId, userUid]);

  useEffect(() => {
    const fetchDataFromServer = async () => {
      const sanitizedPostId = encodeURIComponent(postId);
      try {
        const response = await fetch(
          `https://pralap-f9hz.onrender.com/blogs/blog/${sanitizedPostId}`
        );
        const data = await response.json();

        if (response.ok) {
          setMongoData(data?.content);
        } else {
          console.error("Error fetching data from server:", data.error);
        }
      } catch (error) {
        console.error("Error fetching data from server:", error);
      }
    };

    fetchDataFromServer();
  }, [postId]);

  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    // Set isScrolled to true when scrolling down
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shutterProps = useSpring({
    height: isScrolled ? "0vh" : "100vh",
    config: { tension: 90, friction: 12 }, // Adjust the final height as needed
  });

  const [liked, setLiked] = useState(false);
  const [archived, setArchived] = useState(false);

  const springPropsHeart = useSpring({
    transform: liked ? "scale(1.5)" : "scale(1)",
    color: liked ? "red" : "#A7A7A7",
    borderColor: liked ? "white" : "black",
  });

  const springPropsArchive = useSpring({
    transform: archived ? "scale(1.5)" : "scale(1)",
    color: archived ? "white" : "grey",
    borderColor: archived ? "white" : "black",
  });

  const handleLike = () => {
    console.log("Like button clicked");
    let likeValue = liked ? 0 : 1;
    incrementLikesToFirestore(postId,userUid,likeValue)
    setLiked(!liked);
  };

  const handleArchive = () => {
    console.log("Archive button clicked")
    let value = archived ? 0 : 1;
    archivePostToFiretore(postId,userUid,value)
    setArchived(!archived);
  };

  const redirectToProfile = () => {
    // console.log("Redirecting to profile", post.createdBy)
    navigate(`/profile/${post.createdBy}`);
  };

  const handleCopyToClipboard = () => {
    const currentURL = window.location.href;
    copy(currentURL)
      .then(() => {
        window.alert("URL copied to clipboard!");
        // Optionally, you can show a notification or update state to indicate successful copy
      })
      .catch((error) => {
        console.error("Failed to copy URL to clipboard:", error);
        window.alert("Failed to copy URL to clipboard.");
      });
  };

  return (
    <>
      {post && (
        <div className=" overflow-hidden min-h-screen">
          <animated.div
            className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
            style={{
              ...shutterProps,
              backgroundImage: `url(${image})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="relative z-10 text-center flex-col items-end justify-evenly max-w-[60%]">
              {/* Heading in the Center */}
              <h1 className="md:text-5xl text-xl font-extrabold text-custom-white text-center ">
                {post?.title}
              </h1>
              <div className="mt-20 text-custom-white flex items-center justify-center space-x-5 text-center font-thin">
                <p> by </p>
                <p
                  onClick={redirectToProfile}
                  className="text-custom-white font-light cursor-pointer transform transition-transform hover:scale-110"
                >
                  {post?.username}
                </p>
              </div>
              <div className="flex items-center space-x-10 md:space-x-20 justify-center text-center font-thin mt-16 md:mt-28">
                <animated.div
                  style={{ ...springPropsHeart }}
                  onClick={handleLike}
                  className="like-button "
                >
                  <FontAwesomeIcon className=" hover:scale-110" icon={faHeart} />
                </animated.div>
                <animated.div
                  style={{ ...springPropsArchive }}
                  onClick={handleArchive}
                  className="like-button"
                >
                  <FontAwesomeIcon className=" hover:scale-110"  icon={faBookBookmark} />
                </animated.div>
                <div onClick={handleCopyToClipboard}>
                  <FontAwesomeIcon className=" text-gray-400 hover:scale-125" icon={faShare} />
                </div>
              </div>
            </div>
            {/* { (userUid== post?.createdBy) &&<div className="absolute md:top-24 md:mr-8 top-20 z-40 right-0 m-4">
              <FontAwesomeIcon icon={faListDots} className=" text-custom-white" onClick={openDropDown} />
              
            </div>} */}
            <div>
              {userUid == post?.createdBy && (
                <div className="absolute md:top-24 md:mr-8 top-20 z-40 right-0 m-4">
                  <FontAwesomeIcon
                    icon={faListDots}
                    className="text-custom-white"
                    onClick={() => { openDropDown(); handleDeleteCancel(); }}

                  />
                </div>
              )}

              {/* Dropdown Content */}
              {isDropdownOpen && (
                <div className=" scale-50 md:scale-100 absolute md:top-36 md:mr-8 top-24 z-40 right-0  bg-transparent bg-opacity-5 border border-gray-200 p-2 rounded-3xl shadow backdrop:blur-2xl">
                  <div
                    onClick={handleMakePrivate}
                    className="cursor-pointer hover:bg-custom-gray-ligh rounded-3xl p-2"
                  >
                    {post.public ? 'Make Private' : 'Make Public'}
                  </div>
                  <div
                    onClick={handleEdit}
                    className="cursor-pointer  hover:bg-custom-gray-ligh rounded-3xl p-2"
                  >
                    Edit
                  </div>
                  <div
                    onClick={handleDelete}
                    className="cursor-pointer  hover:bg-custom-gray-ligh rounded-3xl p-2 text-red-500"
                  >
                    Delete
                  </div>
                </div>
              )}

              {isDeleteModalOpen && (
                <div className=" scale-50 md:scale-100 absolute md:top-36 md:mr-8 top-24 z-40 right-0  bg-transparent bg-opacity-5 border border-gray-200 p-2 rounded-3xl shadow backdrop:blur-2xl">
                  <div
                    onClick={handleDeleteConfirmation}
                    className="cursor-pointer hover:bg-custom-gray-ligh text-red-500 rounded-3xl p-2"
                  >
                   {deleting && <p>Deleting...</p>}
                   {!deleting && <p>Confirm</p>}
                  </div>
                  <div
                    onClick={handleDeleteCancel}
                    className="cursor-pointer  hover:bg-custom-gray-ligh rounded-3xl p-2"
                  >
                    {!deleting && <p>Cancel</p>}
                  </div>
                </div>
              )}
            </div>
          </animated.div>
          <SecondDivComponent
            content={mongoData}
            description={post?.description}
            isScrolled={isScrolled}
            post={post}
          />
        </div>
      )}
      {!post && (
        <div className=" text-4xl text-custom-black-dark font-bold flex items-center justify-center">
          Loading...
        </div>
      )}
    </>
  );
};




const SecondDivComponent = ({ post, content, description, isScrolled }) => {
  
  // download markdown content
const downloadMarkdown = () => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'output.md');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


  const secondDivProps = useSpring({
    opacity: isScrolled ? 1 : 0,
    config: config.gentle,
  });

  const components = {
    h1: ({ node, ...props }) => (
      <h1
        className="font-extrabold text-3xl text-custom-black-dark text-center"
        {...props}
      >
        {props.children}
      </h1>
    ),
    h2: ({ node, ...props }) => (
      <h2 className="font-semibold text-2xl" {...props}>
        {props.children}
      </h2>
    ),
    h3: ({ node, ...props }) => (
      <h3 className="font-medium text-xl" {...props}>
        {props.children}
      </h3>
    ),
    h4: ({ node, ...props }) => (
      <h4 className="font-normal text-lg" {...props}>
        {props.children}
      </h4>
    ),
    h5: ({ node, ...props }) => (
      <h5 className="font-light text-base" {...props}>
        {props.children}
      </h5>
    ),
    h6: ({ node, ...props }) => (
      <h6 className="font-thin text-sm" {...props}>
        {props.children}
      </h6>
    ),
    p: ({ node, ...props }) => (
      <p className="text-custom-gray-darkest lg:text-lg text-sm font-normal lg:font-light" {...props}>
        {props.children}
      </p>
    ),
    pre: ({ node, ...props }) => (
      <pre className=" font-thin text-xs text-custom-black-dark p-4 rounded-md">
        {props.children}
      </pre>
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal pl-4">{props.children}</ol>
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-4">{props.children}</ul>
    ),
    li: ({ node, ...props }) => <li className=" text-xs lg:text-sm font-light">{props.children}</li>,
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 ml-4 border-gray-500 p-2 text-sm font-thin italic ">
        {props.children}
      </blockquote>
    ),
    strong: ({ node, ...props }) => (
      <strong className=" font-bold">
        {props.children}
      </strong>
    ),
    code: ({ node, ...props }) => (
      <div className="bg-gray-100 rounded-md p-4">
        <code className="text-custom-black-dark lg:text-sm font-light text-xs">{props.children}</code>
      </div>
    ),
    
  };

  return (
    <>
    <animated.div
      className="mb-24 mt-32 md:mt-48 mx-auto inset-0 h-full w-full flex-col md:space-y-20 space-y-10  items-center justify-center"
      style={{
        ...secondDivProps,

      }}
    >
      <blockquote 
      className="max-w-[70%] md:max-w-[60%] ml-5 md:ml-40 italic text-sm md:text-xl font-thin text-gray-500 border-l-2 pl-4 py-2 mb-4">
        <p>{description}</p>
        <footer>— {post?.username}</footer>
      </blockquote>

      <div>
    </div>

      <div
      // contentEditable="true"
      className=" text-sm md:text-lg font-extralight md:font-light  max-w-[80%] md:max-w-[70%] ml-10 md:ml-60">
        <Markdown
          remarkPlugins={[remarkGfm]}
          className="foo"
          components={components}
        >
          {content}
        </Markdown>
      </div>
      <Footer/>
    </animated.div>
    
    </>
  );
};

export default BlogPost;
