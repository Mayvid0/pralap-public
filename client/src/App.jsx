import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {UserContextProvider} from "./context/userProvider"
import { ProfileImageProvider } from "./context/profileImageContext";
import {HomePage} from "./pages/home/home"
import {Navbar} from "./components/navbar"


const ExplorePage= lazy(()=> import("./pages/explore/explorePage"))
const CreativePage= lazy(()=> import("./pages/pralAp/creativePage"))
const ProfilePage = lazy(()=> import("./pages/profile/profilePage"))
const LoginPage = lazy(()=> import ("./pages/login/loginPage"))
const SignUpPage = lazy(()=> import("./pages/signup/signupPage"))
const BlogPost = lazy(()=> import("./pages/Blogs/BlogPost"))

function App() {
  return (
    <UserContextProvider>
      <ProfileImageProvider>
        <Router>
          <Navbar />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/create" element={<CreativePage />} />
                <Route path="/create/:postId" element={<CreativePage />} />
              <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/blogs/blog/:postId" element={<BlogPost />} />
            </Routes>
          </Suspense>

        </Router>
      </ProfileImageProvider>
    </UserContextProvider>
  );
}




export default App
