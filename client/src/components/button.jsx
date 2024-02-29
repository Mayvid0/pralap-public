import React from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated, config } from "react-spring";

const TwinklingButton = (props) => {
  const buttonSpring = useSpring({
    loop: true,
    from: { scale: 1, background: "transparent" },
    to: [
      { scale: 1.5 },
      { scale: 1, background: "transparent" },
    ],
    config: { duration: 1000 },
    config: config.default,
  });
  const navigate= useNavigate();
  const reDirectTo = () => {
    navigate(`/${props.goTo}`)
  }
  

  return (
    <div className="flex items-center justify-center  lg:p-2 rounded-2xl cursor-pointer " onClick={reDirectTo}>
      <span className=" duration-300 hover:scale-110 lg:text-2xl text-lg font-bold text-custom-light  ">{props.text}</span>
      <animated.button
        className="   text-black rounded-lg relative"

        style={{
          ...buttonSpring,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-4 h-8 lg:w-6 lg:h-12`}
          color="#f3f0eb"
        >
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </animated.button>
    </div>
  );
};

export default TwinklingButton;
