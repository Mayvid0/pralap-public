import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../../config/firebase-config"; // Import your Firebase configuration

import { BlogCard } from "../../components/blogCard";
import { Footer } from "../../components/footer";

const ExplorePage = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const blogPostsCollection = collection(db, "post");

      // Create a query to order posts by the 'likes' field in descending order
      const sortedPostsQuery = query(
        blogPostsCollection,
        orderBy("likes", "desc"),
        where("public", "==", true)
      );
      // const sortedPostsQuery = query(blogPostsCollection, where('public', '==', true));
      const blogPostsSnapshot = await getDocs(sortedPostsQuery);

      const posts = [];
      blogPostsSnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });

      setBlogPosts(posts);
    };

    fetchBlogPosts();
  }, []);

  return (
    <>
      <div className="mb-28">
        {blogPosts.slice(0, 5).map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      <Footer />
    </>
  );
};

export default ExplorePage;
