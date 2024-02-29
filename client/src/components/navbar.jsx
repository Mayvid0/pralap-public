import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { logout } from "../services/firebaseAuth";
import { useProfileImage } from "../context/profileImageContext";
import imageLogo from "../assets/img2.png";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const { profileImageUrl } = useProfileImage();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const userProfileInfo = useContext(UserContext);
  // console.log("userprofileinfo",userProfileInfo)
  const userUid = userProfileInfo?.uid;
  const pfp = profileImageUrl;
  // console.log(userUid , pfp)

  const { setProfileImageUrl } = useProfileImage();
  // const navigate = useNavigate()

  useEffect(() => {
    const fetchUserInfo = async () => {
      const sanitizedUserId = encodeURIComponent(userUid);
      // console.log(sanitizedUserId)
      try {
        const response = await fetch(
          `https://pralap-f9hz.onrender.com/profile/${sanitizedUserId}`
        );
        const userData = await response.json();

        if (response.ok) {
          setProfileImageUrl(userData.pfp);
        } else {
          console.error("Error fetching user information:", userData.error);
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    if (userUid) {
      fetchUserInfo();
    }
  }, [userUid, setProfileImageUrl]);

  const redirectToProfile = () => {
    setProfileOpen(false);
    // Navigate to the /profile route
    navigate("/profile");
  };

  const redirectToLogin = () => {
    // Optionally, close the dropdown before redirection
    setIsMenuOpen(false);
    // Navigate to the /profile route
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setProfileOpen(!isProfileOpen);
  };
  const redirectToExplore = () => {
    navigate("/explore");
  };
  const [isClicked, setIsClicked] = useState(false);
  const [previousPage, setPreviousPage] = useState(null);

  const redirectToCreate = () => {
    setPreviousPage(location.pathname);
    if (!userUid) navigate("/login");
    else navigate("/create");
  };

  const handleSvgClick = () => {
    setIsClicked(!isClicked);
    if (isClicked) {
      setTimeout(() => {
        setIsClicked(false);
      }, 300);
      if (previousPage) {
        navigate(previousPage);
      }
    } else {
      redirectToCreate();
    }
  };

  const redirectToProfileFromMenu = () => {
    if (!userUid) navigate("/login");
    else navigate("/profile");
  };

  const getCurrentPage = () => {
    const currentPage = window.location.pathname;

    if (currentPage === '/') {
      return 'home';
    }
    return 'default'; 
  };
  const getBackgroundColor = () => {
    const currentPage = getCurrentPage();

    const colorMap = {
      home: ' transparent',
      default: 'white',
    };

    return colorMap[currentPage];
  };


  return (
    <body className="sticky top-0 z-50 " style={{ backgroundColor: getBackgroundColor() }}>
      <nav className=" px-2 py-4 flex lg:justify-between justify-stretch items-center  ">
        <div className="lg:w-auto lg:text-center ">
          <button
            className="navbar-burger  flex items-center text-blue-600 p-3"
            onClick={toggleMenu}
          >
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
        <NavLink
          className=" text-2xl font-bold leading-none ml-1 lg:ml-5 lg:text-4xl  "
          to="/"
        >
          <img
            src={imageLogo}
            alt=""
            style={{
              width: "100px",
              height: "50px",
              objectFit: "cover",
            }}
          />
        </NavLink>
        {/* <ul
          className={`   hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto lg:items-center lg:w-auto lg:space-x-10 ${
            isMenuOpen ? "" : "hidden"
          }`}
        >
          <li>
            <NavLink className="text-3xl font-bold leading-none " to="/explore">
              Explore
            </NavLink>
          </li>
        </ul> */}

        {userUid && (
          <NavLink
            className="hidden lg:flex items-center justify-center lg:ml-auto lg:mr-3 py-2 px-2 hover:bg-gray-300 text-lg text-gray-900 font-bold rounded-xl transition duration-200"
            to="/create"
          >
            <span className="hidden lg:flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.3}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="lg:text-2xl">Create</span>
            </span>
          </NavLink>
        )}
        {userUid && (
          <span className="relative flex items-center lg:inline-block  ">
            <img
              onClick={redirectToProfile}
              src={pfp}
              alt="avatar"
              className="hidden object-cover w-14 h-14 mx-4 rounded-full sm:block items-center cursor-pointer"
            />
          </span>
        )}

        {!userUid && (
          <NavLink
            className="hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-300 text-sm text-gray-900 font-bold rounded-xl transition duration-200"
            to="/login"
          >
           Login
          </NavLink>
        )}
        {!userUid && (
          <NavLink
            className="hidden lg:inline-block py-2 px-6 hover:bg-custom-tan bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200"
            to="/SignUp"
          >
            Sign up
          </NavLink>
        )}
      </nav>

      {isMenuOpen && (
        <div className="navbar-menu relative z-50">
          <div
            className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"
            onClick={closeMenu}
          ></div>

          <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
            <div className="flex items-center mb-8">
              <a className="mr-auto text-3xl font-bold leading-none" href="#">
                <svg className="h-12" alt="logo" viewBox="0 0 10240 10240">
                </svg>
              </a>

              <button className="navbar-close" onClick={closeMenu}>
                <svg
                  className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div>
              {userUid && (
                <img
                  onClick={redirectToProfile}
                  src={pfp}
                  alt="avatar"
                  className=" object-cover w-14 h-14 mx-4 rounded-full  items-center cursor-pointer lg:hidden"
                />
              )}
              <ul>
                <li onClick={closeMenu} className="mb-1">
                  <NavLink
                    exact
                    to="/"
                    className={`block p-4 text-sm font-semibold ${
                      location.pathname === "/"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    Home
                  </NavLink>
                </li>

                <li onClick={closeMenu} className="mb-1">
                  <NavLink
                    to="/explore"
                    className={`block p-4 text-sm font-semibold ${
                      location.pathname === "/explore"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    Explore
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="mt-auto">
              {userUid && (
                <div
                  className="block px-4 py-3 mb-3  text-xs text-center font-semibold leading-none bg-red-600 hover:bg-gray-400 rounded-xl"
                  onClick={() => {
                    redirectToLogin();
                  }}
                >
                  Log out
                </div>
              )}
              {!userUid && (
                <div onClick={closeMenu} className="pt-6">
                  <NavLink
                    className="block px-4 py-3 mb-3  text-xs text-center font-semibold leading-none bg-gray-200 hover:bg-gray-400 rounded-xl"
                    to="/login"
                  >
                    Sign in
                  </NavLink>
                  <NavLink
                    onClick={closeMenu}
                    className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700  rounded-xl"
                    to="/SignUp"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
              <p className="my-4 text-xs text-center text-gray-400">
                <span>Copyright © 2024</span>
              </p>
            </div>
          </nav>
        </div>
      )}

      <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center z-40">
        <div
          className={`rounded-full w-12 h-12 bg-custom-pink bg-opacity-80 backdrop-blur-md flex justify-center items-center ${
            isClicked ? "clicked" : ""
          }`}
          onClick={handleSvgClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.3}
            stroke="currentColor"
            className={`w-8 h-8 transition-transform duration-300 transform ${
              isClicked ? "rotate-45" : ""
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 w-full p-3 flex justify-around bg-custom-darkest-tree">
        <div
          className=" text-white  hover:text-gray-300  transition duration-200"
          onClick={redirectToExplore}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="w-6 h-6 "
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <div
          className="text-white  hover:text-gray-300 transition duration-200"
          onClick={redirectToProfileFromMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="w-6 h-6 "
          >
            <circle cx="12" cy="7" r="4" />
            <path d="M2 20s3-3 6-3h8c3 0 6 3 6 3" />
          </svg>
        </div>
      </div>
    </body>
  );
}
