import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { storage } from "../../config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../config/firebase-config";
import { setDoc, collection, doc, getDoc, increment } from "firebase/firestore";
import MDEditor from "@uiw/react-md-editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { getPost } from "../../services/getpost";
import { saveToFirestore } from "../../services/createpost";
import { updateToFirestore } from "../../services/editpost";
import rehypeSanitize from "rehype-sanitize";
import { Footer } from "../../components/footer";


const CreativePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [content, setContent] = useState("");
  const [colorMode, setColorMode] = useState("light");

  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const [image, setImage] = useState(null);
  const [tag, setTag] = useState("");

  const userInfo = useContext(UserContext);
  const uid = userInfo?.uid;

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // have to remove
  const unsplashApiKey = "n1iCdjGdOeKYEos7ARWasBwArKIwoDBJH7l4WhPfJTM";

  const handleUpload = async () => {
    let downloadURL = "";
    if (image) {
      const storageRef = ref(storage, `blogImages/${uid}_${image.name}`);

      try {
        await uploadBytes(storageRef, image);

        // Get the download URL
        downloadURL = await getDownloadURL(storageRef);
        // Now, you can save this URL in Firestore or perform other actions
        // console.log("File available at", downloadURL);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      const width = 1200; // Set the desired width of the image
      const height = 1400;
      const unsplashUrl = `https://api.unsplash.com/photos/random?query=${tag}&client_id=${unsplashApiKey}&w=${width}&h=${height}`;

      try {
        const response = await fetch(unsplashUrl);
        const data = await response.json();

        if (response.ok && data.urls && data.urls.full) {
          downloadURL = data.urls.full;
          // console.log("Image URL:", downloadURL);
        } else {
          console.error(
            "Error fetching image from Unsplash:",
            data.errors || response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching image from Unsplash:", error.message);
      }
    }
    return downloadURL;
  };

  //finding the username stored in firestore
  const findUserName = async (createdByUserId) => {
    try {
      const userDocRef = doc(collection(db, "users"), createdByUserId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // Access the user data and retrieve the username
        const userData = userDocSnapshot.data();
        const username = userData.username;

        // You can now use the retrieved username as needed
        // console.log("Username:", username);
        return username;
      } else {
        console.error("User not found");
        return null; // Or handle the absence of the user as needed
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null; // Or handle the error as needed
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postId) {
      handleCreateSubmit();
    } else {
      handleEditSubmit();
    }
  };

  const handleCreateSubmit = async () => {
    try {
      // Assuming you have a server endpoint to handle blog creation

      const response = await fetch("https://pralap-f9hz.onrender.com/blog/create", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ content, uid }),
      });

      if (response.ok) {
        const createdBlogInfo = await response.json();
        const createdByUserId = createdBlogInfo?.blogPost.uid;
        const blogId = createdBlogInfo?.blogPost._id;

        // console.log(createdByUserId, blogId);

        const downloadURL = await handleUpload();
        const userName = await findUserName(createdByUserId);

        //save additional info to firestore
        const firestoreBlogObject = {
          title: title,
          description: description,
          blogImageUrl: downloadURL,
          comments: 0,
          createdBy: createdByUserId,
          createdWhen: new Date().toLocaleDateString(),
          likes: 0,
          postId: blogId,
          username: userName,
          public: true,
        };

        await saveToFirestore(firestoreBlogObject);
        const secUserRef = doc(db, "user_sec_info", uid);
        await setDoc(
          secUserRef,
          {
            public_post_count: increment(1),
          },
          { merge: true }
        );

        // console.log("Blog created successfully!");
        setTitle("");
        setDescription("");
        setContent("");
        setImage(null);
        setTag("");
        navigate(`/blogs/blog/${blogId}`);
      } else {
        console.error("Error creating blog:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating blog:", error.message);
    }
  };

  //edit blogs
  const { postId } = useParams();

  //edit blogs
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        return;
      }
      const responseMongo = await fetch(
        `https://pralap-f9hz.onrender.com/blogs/blog/${postId}`
      );
      const data = await responseMongo.json();

      setContent(data.content);

      const responseFirestore = await getPost(postId);
      // console.log(responseFirestore)
      setTitle(responseFirestore.title);
      setDescription(responseFirestore.description);
      setTag("");
      setImage(null);
    };
    fetchPost();
  }, [postId]);

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`https://pralap-f9hz.onrender.com/blog/edit`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          content: content,
          postId: postId,
        }),
      });

      if (response.ok) {
        const updatedBlogInfo = await response.json();
        const blogId = updatedBlogInfo?.blogPost._id;

        // console.log(updatedByUserId, blogId);

        const downloadURL = await handleUpload();

        // Update additional info in firestore
        const firestoreBlogObject = {
          title: title,
          description: description,
          blogImageUrl: downloadURL,
        };

        await updateToFirestore(blogId, firestoreBlogObject);

        console.log("Blog updated successfully!");
        // Reset form fields if the blog update was successful
        setTitle("");
        setDescription("");
        setContent("");
        setImage(null);
        setTag("");
        navigate(`/blogs/blog/${blogId}`);
      } else {
        console.error("Error updating blog:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating blog:", error.message);
    }
  };

  return (
    <div className="container md:max-w-[80%]  mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="md:max-w-[80%] mx-auto bg-custom-white p-8 rounded-md shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create Something Amazing
        </h2>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-lg font-medium text-gray-600"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-lg font-medium text-gray-600"
          >
            Description:
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            required
          />
        </div>
        {!image && (
          <div className="mb-4">
            <label
              htmlFor="tags"
              className="block text-lg font-medium text-gray-600"
            >
              Tags:
            </label>
            <input
              type="text"
              id="tags"
              value={tag}
              onChange={handleTagChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
        <div className="mb-4 flex items-center">
          <label
            htmlFor="content"
            className="block text-lg font-medium text-gray-600 mr-2"
          ></label>
          <MDEditor
            value={content}
            data-color-mode={colorMode}
            onChange={setContent}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            className="w-full" // Set the width to 100%
          />
          <FontAwesomeIcon
            icon={faSun}
            onClick={toggleColorMode}
            className="ml-2"
          />
        </div>
        {!tag && (
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-lg font-medium text-gray-600"
            >
              Cover photo(if any):
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
        
        {!postId && (
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:shadow-outline-indigo"
          >
            Submit
          </button>
        )}
        {postId && (
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:shadow-outline-indigo"
          >
            Edit
          </button>
        )}
      </form>
    </div>
  );
};

export default CreativePage;
