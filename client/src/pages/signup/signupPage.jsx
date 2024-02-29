import React, { useEffect, useState } from "react";
import { NavLink, Navigate, redirect, useNavigate } from "react-router-dom";
import { signUp, signInWithGoogle } from "../../services/firebaseAuth";
import { db } from "../../config/firebase-config";
import { setDoc, collection, doc, getDoc } from "firebase/firestore";
import image from "../../assets/img1.jpeg";

export const handleUsedGoogle = async () => {
  try {
    const googleUser = await signInWithGoogle();
    const googleUserId = googleUser?.uid;
    const googleUserEmail = googleUser?.email;

    const userDocRef = doc(collection(db, "users"), googleUserId);
    const docSnapshot = await getDoc(userDocRef);

    if (!docSnapshot.exists()) {
      await setDoc(userDocRef, {
        bio: "",
        username: googleUser?.displayName,
        title: "",
        userId: googleUserId,
        pfp: googleUser?.photoURL,
        backgroundImage: "",
        email: googleUser?.email,
      });
    }

    const secUserDocRef = doc(collection(db, "user_sec_info"), googleUserId);
    const userDocSnapshot = await getDoc(secUserDocRef);

    if (!userDocSnapshot.exists()) {
      await setDoc(secUserDocRef, {
        archived: [],
        public_posts: [],
        public_post_count: 0,
        private_posts: [],
        followers: [],
        following: [],
      });
    }

    if (googleUserId != undefined) {
      const registrationResponse = await fetch(
        "https://pralap-f9hz.onrender.com/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: googleUserId, email: googleUserEmail }),
        }
      );

      const registrationResult = await registrationResponse.json();
      // console.log(registrationResult);
      console.log("User signed up successfully:", registrationResult);
      if (registrationResult.message === "success") {
        setSubmissionStatus("success");
        setRedirect(true);
      }
      if (registrationResult.error === "usernameError") {
        setSubmissionStatus("usernameError");
      }
    }
  } catch (error) {
    console.error("SignupPage error:", error.message);
    if (error.code === "auth/weak-password") {
      setSubmissionStatus("passwordError");
    } else if (error.code === "auth/email-already-in-use") {
      setSubmissionStatus("emailError");
    } else {
      setSubmissionStatus("error");
    }
  }
};

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    // Check for success and trigger redirect when submissionStatus is "success"
    if (redirect === true) {
      navigate("/profile");
    }
  }, [submissionStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signUp(
        formData.username,
        formData.email,
        formData.password
      );
      const UserId = user?.uid;

      const userDocRef = doc(collection(db, "users"), UserId);
      await setDoc(userDocRef, {
        bio: "",
        username: formData.username,
        title: "",
        userId: UserId,
        pfp: "https://images.unsplash.com/photo-1510723185481-c39848b105c0?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        backgroundImage: "",
        email: formData.email,
      });

      const secUserDocRef = doc(collection(db, "user_sec_info"), UserId);
      await setDoc(secUserDocRef, {
        archived: [],
        public_posts: [],
        public_post_count: 0,
        private_posts: [],
        followers: [],
        following: [],
      });

      if (UserId != undefined) {
        const registrationResponse = await fetch(
          "https://pralap-f9hz.onrender.com/users/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: UserId, email: formData.email }),
          }
        );

        const registrationResult = await registrationResponse.json();
        // console.log(registrationResult);
        console.log("User signed up successfully:", registrationResult);
        if (registrationResult.message === "success") {
          setSubmissionStatus("success");
          setRedirect(true);
        }
        if (registrationResult.error === "usernameError") {
          setSubmissionStatus("usernameError");
        }
      }

      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      // Handle signup errors
      console.error("SignupPage error:", error.message);
      if (error.code === "auth/weak-password") {
        setSubmissionStatus("passwordError");
      } else if (error.code === "auth/email-already-in-use") {
        setSubmissionStatus("emailError");
      } else {
        setSubmissionStatus("error");
      }
    }
  };

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${image})` }}>
        <form onSubmit={handleSubmit} className="mb-8 flex lg:w-1/3  flex-col lg:space-y-16 space-y-8">
          {/* <div className="text-center text-4xl font-medium">Sign Up</div> */}

          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-custom-dark" >
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full p-1 border-none text-custom-darkest-tree bg-transparent outline-none focus:outline-none placeholder:text-custom-darkest-tree  placeholder:font-serif placeholder:italic"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-custom-dark">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-1 border-none text-custom-darkest-tree bg-transparent outline-none focus:outline-none placeholder:text-custom-darkest-tree  placeholder:font-serif placeholder:italic"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-custom-dark">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-1 border-none text-custom-darkest-tree bg-transparent outline-none focus:outline-none placeholder:text-custom-darkest-tree  placeholder:font-serif placeholder:italic"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
          type="submit"
            className="transform  w-full mx-auto bg-custom-beige bg-opacity-80 hover:bg-opacity-100 py-2 rounded-full lg:text-xl text-lg font-bold duration-300 "
            
          >
            Sign Up
          </button>

          {submissionStatus === "success" && (
            <p className="text-center text-green-500">
              Registration successful!
            </p>
          )}
          {submissionStatus === "error" && (
            <p className="text-center text-red-500">
              Registration failed. Please try again.
            </p>
          )}
          {submissionStatus === "passwordError" && (
            <p className="text-center text-red-500">
              Password should be atleast 6 characters.
            </p>
          )}
          {submissionStatus === "emailError" && (
            <p className="text-center text-red-500">Email already in use .</p>
          )}
          {submissionStatus === "usernameError" && (
            <p className="text-center text-red-500">
              Username already in use .
            </p>
          )}

          <p className="text-center  text-lg text-custom-super-light">
            Already have an account?
            <NavLink
              className="font-medium text-indigo-500 underline-offset-4 px-2 hover:underline"
              to="/login"
            >
              Log In
            </NavLink>
          </p>
        </form>
      </main>
    </>
  );
};

export default SignUpPage;
