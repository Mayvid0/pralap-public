import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { updateUserInfo } from "../../services/firebaseAuth";
import { useProfileImage } from "../../context/profileImageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { EditProfileModal } from "../../services/profileImagemodal";

import {
  onSnapshot,
  collection,
  getDoc,
  getDocs,
  where,
  query,
  getFirestore,
  doc,
  updateDoc,
  orderBy,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ModalForm } from "../../services/modalForm";
import { db } from "../../config/firebase-config";
import { storage } from "../../config/firebase-config";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getStorage,
  deleteObject,
} from "firebase/storage";
import { BlogCard } from "../../components/blogCard";
import { Footer } from "../../components/footer";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { setProfileImageUrl } = useProfileImage();

  const userProfileInfo = useContext(UserContext);
  const uid = userProfileInfo?.uid;
  const { userId } = useParams();
  const username = userInfo?.username;
  const bio = userInfo?.bio;
  const title = userInfo?.title;
  const pfp = userInfo?.pfp;
  const backgroundImage = userInfo?.pfp;
  

  useEffect(() => {
    const fetchUserInfo = async () => {
      //   console.log(userId)
      let userToFetchId;

      // If userId is present in URL parameters, use it
      if (userId) {
        userToFetchId = userId;
      } else if (!userId && uid) {
        // If userId is not present, and there's an authenticated user, use their own UID
        userToFetchId = uid;
      } else {
        // No userId in URL parameters and no authenticated user
        console.log("User ID not provided and no authenticated user");
        return;
      }
      // console.log(userToFetchId)
      const sanitizedUserId = encodeURIComponent(userToFetchId);
      // console.log(sanitizedUserId)
      try {
        const response = await fetch(
          `https://pralap-f9hz.onrender.com/profile/${sanitizedUserId}`
        );
        const userData = await response.json();

        if (response.ok) {
          setUserInfo(userData);
          // navigate(`/profile/${sanitizedUserId}`)
          if (sanitizedUserId === uid) {
            setProfileImageUrl(userData.pfp);
          }
        } else {
          console.error("Error fetching user information:", userData.error);
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    if (uid || userId) {
      fetchUserInfo();
    }
  }, [userId, uid, setProfileImageUrl,title,username,bio]);

 

 

  const [isModalOpenPfp, setIsModalOpenPfp] = useState(false);
  const [file, setFile] = useState(null);

  const handleEditClick = () => {
    console.log("clicked");
    setIsModalOpenPfp(true);
  };

  const handleModalClose = () => {
    setIsModalOpenPfp(false);
    // Clear the file state when the modal is closed
    setFile(null);
  };

  const handleUpload = async () => {
    if (file) {
      const storageRef = ref(storage, `pfp/${uid}_${file.name}`);

      try {
        // Upload the file
        await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);

        // Now, you can save this URL in Firestore or perform other actions
        console.log("File available at", downloadURL);

        const firestore = getFirestore();

        const userDocRef = doc(firestore, "users", uid);

        try {
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const pfpUrl = docSnap.data()?.pfp;

            if (pfpUrl && pfpUrl.startsWith("https://firebasestorage")) {
              const storage = getStorage();
              const fileRef = ref(storage, pfpUrl);

              try {
                await deleteObject(fileRef);
                console.log("File deleted successfully");
              } catch (error) {
                console.error("Error deleting file:", error);
              }
            }
          } else {
            console.log("User not found");
            return null;
          }
        } catch (error) {
          console.error("Error fetching username:", error);
          return null;
        }
        const userRef = doc(firestore, "users", userProfileInfo?.uid); 

        // Update the user document with the download URL
        await updateDoc(userRef, {
          pfp: downloadURL,
        });
      } catch (error) {
        // Handle errors
        console.error("Error uploading file:", error);
      }
    }
  };

  const publicBlogPostsCollection = collection(db, "user_sec_info");

  const handleConnectClick = async (userId, uid) => {
    try {
      const userDocRef = doc(publicBlogPostsCollection, userId); 

      // Update followers for userId
      if (!isFollowing) {
        await updateDoc(userDocRef, {
          followers: arrayUnion(uid),
        });
      } else {
        await updateDoc(userDocRef, {
          followers: arrayRemove(uid),
        });
      }

      // Get the document with the specified uid
      const uidDocRef = doc(publicBlogPostsCollection, uid);

      // Update following for uid
      if (!isFollowing) {
        await updateDoc(uidDocRef, {
          following: arrayUnion(userId),
        });
      } else {
        await updateDoc(uidDocRef, {
          following: arrayRemove(userId),
        });
      }

      console.log("Connection successful!");
    } catch (error) {
      console.error("Error connecting users:", error);
    }
  };

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [publicPostsCount, setPublicPostsCount] = useState(0);

  useEffect(() => {
    const idToUse = userId || uid; 

  if (!idToUse) {
    return;
  }

    const userDocRef = doc(publicBlogPostsCollection, idToUse); 

    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      const data = docSnapshot.data() || {};

      // Followers
      const followers = data.followers || [];
      setIsFollowing(followers.includes(uid));
      setFollowersCount(followers.length);

      // Following
      const following = data.following || [];
      setFollowingCount(following.length);

      // Public Posts
      const publicPostsCount = data.public_post_count ;
      setPublicPostsCount(publicPostsCount);
    });

    return () => {
      unsubscribe();
    };
  }, [userId, uid]);

  const [showMore, setShowMore] = useState(false);
  const showMoreHandler = () => {
    setShowMore(!showMore);
  };

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (optionIndex) => {
    setFollowList([]);
    setSelectedOption(optionIndex);
    if (optionIndex == 0) {
      if (userInfo?.userId === uid) {
        fetchPublicBlogPosts(uid);
      } else fetchPublicBlogPosts(userId);
    } else if (optionIndex == 1) {
      fetchPrivateBlogPosts(uid);
    } else if (optionIndex == 2) {
      fetchArchivedBlogPosts(uid);
    }
  };

  const handlePostClick = () => {
    setFollowList([]);
    setShowMore(!showMore);
    handleOptionClick(0);
  };

  //fetching posts
  const [blogPosts, setBlogPosts] = useState([]);

  const fetchPublicBlogPosts = async (userId) => {
    setBlogPosts([]);
    const publicBlogPostsCollection = collection(db, "user_sec_info");
    // Get the document with the specified userId
    const userDocRef = doc(publicBlogPostsCollection, userId); 
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      // Extract the "public_posts" array from the document data
      const publicPostsArray = userDocSnapshot.data().public_posts;

      const blogPostsSnapshot = await getDocs(
        query(collection(db, "post"), where("postId", "in", publicPostsArray))
      );

      const posts = blogPostsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBlogPosts(posts);
    } else {
      console.log(`No document found for user with ID: ${userId}`);
    }
  };

  const fetchPrivateBlogPosts = async (uid) => {
    setBlogPosts([]);
    const privateBlogPostsCollection = collection(db, "user_sec_info");
    // Get the document with the specified userId
    const userDocRef = doc(privateBlogPostsCollection, uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const privatePostsArray = userDocSnapshot.data().private_posts;

      const blogPostsSnapshot = await getDocs(
        query(collection(db, "post"), where("postId", "in", privatePostsArray))
      );

      const posts = blogPostsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBlogPosts(posts);
    } else {
      console.log(`No document found for user with ID: ${uid}`);
    }
  };

  const fetchArchivedBlogPosts = async (uid) => {
    setBlogPosts([]);
    const archiveBlogPostsCollection = collection(db, "user_sec_info");
    // Get the document with the specified userId
    const userDocRef = doc(archiveBlogPostsCollection, uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const archivePostsArray = userDocSnapshot.data().archived;

      const blogPostsSnapshot = await getDocs(
        query(
          collection(db, "post"),
          where("postId", "in", archivePostsArray),
          where("public", "==", true)
        )
      );

      const posts = blogPostsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBlogPosts(posts);
    } else {
      console.log(`No document found for user with ID: ${uid}`);
    }
  };

  const [followList, setFollowList] = useState([]);

  const handleClickFollowers = async (value) => {
    setFollowList([]);
    setBlogPosts([]);
    setShowMore(false);
    const idToUse = userId || uid; // Use userId if available, otherwise use uid

    if (!idToUse) {
      return;
    }
    const blogPostsCollection = collection(db, "user_sec_info");
    const userDocRef = doc(blogPostsCollection,idToUse); 

    try {
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const followersList = userDocSnapshot.data().followers;
        const followingList = userDocSnapshot.data().following;

        if (value === 0) {
          const followListSnapshot = await getDocs(
            query(collection(db, "users"), where("userId", "in", followersList))
          );

          const posts = followListSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFollowList(posts);
        } else if (value === 1) {
          const followingListSnapshot = await getDocs(
            query(collection(db, "users"), where("userId", "in", followingList))
          );

          const posts = followingListSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFollowList(posts);
          // console.log( "following list", followList)
        }
      } else {
        console.log(`No document found for user with ID: ${userId}`);
      }
    } catch (error) {
      console.error("Error fetching user document:", error);
    }
  };

  const handleRedirect = (userId) => {
    setFollowList([]);
    navigate(`/profile/${userId}`);
  };

  // If userProfileInfo is available, render the entire profile page
  return (
    <main className="profile-page">
      <section className="relative block h-[300px] ">
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        ></div>
      </section>
      <section className="relative py-16">
        <div className="container mx-auto px-4 ">
          <div className="relative flex flex-col min-w-0 break-words bg-custom-light w-full mb-6 shadow-xl rounded-lg -mt-64 ">
            <div className="px-6">
              <div className="flex flex-wrap justify-center items-center ">
                <div className="w-full lg:w-1/3 px-4 lg:order-2 flex justify-center items-center ">
                  <div className="relative  ">
                    <img
                      alt="..."
                      src={pfp}
                      className="shadow-xl rounded-full border-white max-h-[200px] align-middle border-none max-w-[150px]"
                    />
                    {userInfo?.userId === uid && (
                      <button
                        className="absolute bottom-0 right-0 cursor-pointer text-black  rounded-full"
                        onClick={handleEditClick}
                      >
                        {/* Add your edit icon here */}
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                    )}
                  </div>

                  <EditProfileModal
                    isOpen={isModalOpenPfp}
                    onRequestClose={handleModalClose}
                    onUpload={handleUpload}
                    onFileChange={setFile}
                  />
                </div>

                <div className="w-full lg:w-1/3 px-4 p-4 lg:order-3 lg:text-right lg:self-center mx-auto">
                  <div className="text-center">
                    {userInfo?.userId !== uid && (
                      <button
                        className={`${
                          isFollowing
                            ? "bg-green-500 hover:bg-green-400 active:bg-green-600"
                            : "bg-pink-500 hover:bg-pink-400 active:bg-pink-600"
                        } uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none mb-1 ease-linear transition-all duration-150`}
                        type="button"
                        onClick={() =>
                          handleConnectClick(userInfo?.userId, uid)
                        }
                      >
                        {isFollowing ? "following" : "follow"}
                      </button>
                    )}
                    {userInfo?.userId === uid && (
                      <button
                        className="bg-pink-500 hover:bg-pink-400 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setModalOpen(true)}
                      >
                        Edit
                      </button>
                    )}
                    {isModalOpen && <ModalForm />}
                    {/* ModalForm component */}
                  </div>
                </div>
              </div>

              <div className="text-center flex-col items-center justify-center mt-8 ">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 ">
                  {title}
                </h3>
                <i className="fas fa-university mr-2 text-lg  text-blueGray-400"></i>
                @{username}
              </div>

              <div className="mt-5 py-4 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <p className="mb-4 md:text-lg text-sm leading-relaxed text-custom-dark">
                      {bio}
                      
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/3 px-4 lg:order-1 mx-auto ">
                <div className="flex justify-center py-4 lg:pt-4 pt-8">
                  <div className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                      {followersCount}
                    </span>
                    <span
                      onClick={() => handleClickFollowers(0)}
                      className=" cursor-pointer text-sm text-blueGray-400"
                    >
                      followers
                    </span>
                  </div>
                  <div className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                      {publicPostsCount}
                    </span>
                    <span
                      onClick={handlePostClick}
                      className="text-sm cursor-pointer text-blueGray-400"
                    >
                      posts
                    </span>
                  </div>
                  <div className="lg:mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                      {followingCount}
                    </span>
                    <span
                      onClick={() => handleClickFollowers(1)}
                      className=" cursor-pointer text-sm text-blueGray-400"
                    >
                      following
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className=" text-center p-4 ">
              <button
                onClick={showMoreHandler}
                className=" text-red-600 hover:text-red-400"
              >
                {showMore ? "Show Less" : "Show More"}
              </button>
            </div>

            {showMore && userInfo?.userId != uid && (
              <div className="flex items-center md:text-lg text-sm justify-evenly">
                <div
                  className={` cursor-pointer text-custom-dark ${
                    selectedOption === 0 ? "selected" : ""
                  }`}
                  onClick={() => handleOptionClick(0)}
                >
                  Posts
                </div>
              </div>
            )}

            {showMore && userInfo?.userId === uid && (
              <div className="flex items-center md:text-lg text-sm justify-evenly">
                <div
                  className={`cursor-pointer text-custom-dark ${
                    selectedOption === 0 ? "selected" : ""
                  }`}
                  onClick={() => handleOptionClick(0)}
                >
                  Public
                </div>
                <div
                  className={`cursor-pointer text-custom-dark ${
                    selectedOption === 1 ? "selected" : ""
                  }`}
                  onClick={() => handleOptionClick(1)}
                >
                  Private
                </div>
                <div
                  className={`cursor-pointer text-custom-dark ${
                    selectedOption === 2 ? "selected" : ""
                  }`}
                  onClick={() => handleOptionClick(2)}
                >
                  Archive
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {showMore && (
        <div>
          {blogPosts
            .slice(0, 10)
            .map((post) =>
              post ? <BlogCard key={post.id} post={post} /> : null
            )}
        </div>
      )}

      {followList && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 container mx-auto mb-4">
          {followList.map((user) => (
            <div
              key={user.id}
              className="bg-custom-light p-4 rounded-3xl mx-3 shadow-md"
              onClick={() => handleRedirect(user.userId)}
            >
              <div className="flex items-center ">
                <img
                  src={user.pfp}
                  alt="profile"
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <h2 className="text-xl font-semibold">{user.title}</h2>
                  <p className="text-gray-500">@{user.username}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mb-20"></div>
      <Footer/>
    </main>
  );
};

export default ProfilePage;
