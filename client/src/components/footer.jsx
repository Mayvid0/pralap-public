import React from "react";
import telegram from "../assets/telegram.png";
import github from "../assets/github.png";
import letter from "../assets/letter.png";

export const Footer = () => {
  const handleRedirect = (url) => {
    window.open(url, '_blank');
  };
    
  return (
    <footer className= " bg-custom-medium-dark-tree text-white py-2 fixed bottom-0 w-full">
      <div className="container mx-auto hidden md:flex justify-end">
        <ul className="flex space-x-8">
          <li className="cursor-pointer flex items-center" onClick={() => handleRedirect("https://t.me/joLakeman")}>
            <img src={telegram} height={40} width={40} alt="Telegram" />
            <span className="ml-2">Telegram</span>
          </li>
          <li className="cursor-pointer flex items-center" onClick={() => handleRedirect("https://github.com/Mayvid0")}>
            <img src={github} height={40} width={40} alt="Github" />
            <span className="ml-2">Github</span>
          </li>
          <li className="cursor-pointer flex items-center" onClick={() => handleRedirect("https://boxd.it/8cLyL")}>
            <img src={letter} height={40} width={40} alt="Letterboxd" />
            <span className="ml-2">Letterboxd</span>
          </li>
        </ul>
      </div>
    </footer>
  );
};
