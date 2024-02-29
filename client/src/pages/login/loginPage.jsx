import React, { useState, useEffect, useContext } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { signIn } from "../../services/firebaseAuth";
import { handleUsedGoogle } from "../signup/signupPage";
import image from "../../assets/img1.jpeg";
import googleLogo from "../../assets/img3.png";
import { imagePlaceholder } from "img-filler";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [submissionStatus, setSubmissionStatus] = useState(null);
  // const [reDirect, setRedirect] = useState(false);
  const userProfileInfo = useContext(UserContext);

  if (userProfileInfo) {
    // If userProfileInfo is not available, redirect to the sign-in page
    navigate("/explore");
    return null; // Return null to avoid rendering anything in this component
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signIn(formData.email, formData.password);
      const UserId = user?.uid;
      const idToken = await user.getIdToken();

      if (UserId != undefined) {
        const loginResponse = await fetch("https://pralap-f9hz.onrender.com/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: UserId, idToken: idToken }),
        });

        const userProfileInfo = await loginResponse.json();
        console.log("User logged in successfully:", userProfileInfo);
      }

      setFormData({
        email: "",
        password: "",
      });

      if (user) setSubmissionStatus("success");
    } catch (error) {
      // Handle signup errors
      console.error("SignupPage error:", error.message);
      if (error.code === "auth/invalid-credential") {
        setSubmissionStatus("passwordError");
      } else if (error.code === "auth/missing-password") {
        setSubmissionStatus("missPassError");
      } else {
        setSubmissionStatus("error");
      }
    }
  };

  return (
    <>
    
      <main
        className=" mx-auto flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      >
        <form onSubmit={handleSubmit} className="  mb-8 flex lg:w-1/3  flex-col lg:space-y-12 space-y-8">
          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-custom-dark">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-1 border-none text-custom-darkest-tree bg-transparent outline-none focus:outline-none placeholder:text-custom-darker-tree  placeholder:font-serif placeholder:italic"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-custom-dark">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className=" placeholder:font-serif w-full p-1 border-none bg-transparent text-custom-darkest-tree placeholder:text-custom-darker-tree outline-none placeholder:italic  focus:outline-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>


            <button
              type="submit"
              className="transform w-full mx-auto bg-custom-beige bg-opacity-60 hover:bg-opacity-80 py-2 rounded-full lg:text-xl text-lg font-bold duration-300"
            >
              Login
            </button>

          <div className="flex w-full items-center  text-center lg:text-xl text-base font-extralight text-custom-light">
            <div className="border w-full "></div>
            <div className=" mx-1">OR</div>
            <div className="border w-full "></div>
          </div>
          <button
            className="transform rounded-full bg-custom-super-light bg-opacity-60 hover:bg-opacity-80  py-2 font-bold duration-300 "
            onClick={() => handleUsedGoogle()}
          >
            <img
              src={googleLogo}
              alt="Google Logo"
              className="h-6 w-6 m-2 text-gray-500 inline-block"
            />
            Sign in with google
          </button>

          {submissionStatus === "success" && (
            <p className="text-center text-green-500"> Login successful </p>
          )}
          {submissionStatus === "passwordError" && (
            <p className="text-center w-full text-red-500">
              Wrong Password/No account found
            </p>
          )}
          {submissionStatus === "emailError" && (
            <p className="text-center w-full text-red-500">
              Email already in use .
            </p>
          )}
          {submissionStatus === "missPassError" && (
            <p className="text-center w-full text-red-500">
              Please enter a password
            </p>
          )}

          <p className="text-center  text-lg text-custom-super-light">
            Don't have an account?
            <NavLink
              className="font-medium text-blue-600 underline-offset-4 px-2 hover:underline"
              to="/signup"
            >
              Sign Up
            </NavLink>
          </p>
        </form>
      </main>
    </>
  );
};

export default LoginPage;
