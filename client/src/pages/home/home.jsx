import React from "react";
import { useNavigate } from "react-router-dom";
import image from "../../assets/img1.jpeg";
import TwinklingButton from "../../components/button";

export function HomePage() {
  const containerStyle = {
    position: "relative",
    height: "calc(100vh - 82px)",
    overflow: "hidden",
  };

  const backgroundStyle = {
    background: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100%",
    margin: "0 0 0 0",
  };

  const contentStyle = {
    position: "absolute",
    top: "20%",
    zIndex: 1,
    color: "white",
  };

  const navigate = useNavigate();
  const redirectToTutorial = () => {
    navigate(`/blogs/blog/65c65700567d59de9ab7a466`);
  };
  return (
    <div
      className="min-h-screen absolute overflow-hidden h-full bg-cover"
      style={containerStyle}
    >
      <div style={backgroundStyle}></div>
      <div
        style={contentStyle}
        className=" m-5 flex-col space-y-5 lg:space-y-8 justify-center items-center lg:w-1/2 w-3/4"
      >
        <div className=" font-extrabold text-3xl lg:text-6xl text-custom-super-light">
          Secure Blogging, Seamless Sharing.
        </div>
        <div className=" lg:font-semibold font-light text-xs lg:text-xl text-custom-light">
          Simplicity reigns with secure sharing, markdown editor, distraction-free
          blogging platform. Tailor your profile, own your content.
        </div>
        <div className="">
          <div className="flex justify-start lg:space-x-10 space-x-6 ">
            <button
              onClick={redirectToTutorial}
              className=" text-white lg:text-lg text-sm font-bold p-2 rounded-3xl hover:bg-custom-gray bg-blue-600 "
            >
              Learn More
            </button>

            <TwinklingButton text={"Explore"} goTo={"explore"} />
          </div>
        </div>
      </div>
    </div>
  );
}
