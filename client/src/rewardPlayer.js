import React, { useState, useRef } from "react";
import Resizer from "react-image-file-resizer";
import { useAppContext } from "./AppContext";
import axios from "axios";
import start_btn from "./icons/btn.svg";
import "./rewardPlayer.css";
import tree1 from "./icons/tree-1.svg";
import tree2 from "./icons/tree-2.svg";
import tree3 from "./icons/tree-3.svg";
import tree4 from "./icons/tree-4.svg";
import coin from "./icons/coin.svg";
import question from "./icons/question.svg";
import popup from "./icons/popup.svg";

function FeedPlayer() {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const { user, updateUserPoints } = useAppContext();
  const [image, setImage] = useState();
  const [showPopup, setShowPopup] = useState(false);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        70,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const fileInput = event.target;

    if (file) {
      try {
        const resizedImage = await resizeFile(file);

        const base64String = resizedImage.split(",")[1];
        // Now you can use the base64String as needed
        setImage(base64String);
        // Read the file as a data URL
        // const base64String = resizedImage.toString("base64");
        loadImage(base64String); // Pass the base64 string to loadImage
        // Reset the input value to allow selecting the same file again
        fileInput.value = "";
      } catch (error) {
        console.error("error in reading image", error);
        setShowPopup(true);
      }
    }
  };

  const closePopup = () => {
    // Close the popup
    setShowPopup(false);
  };

  const handleOverlayClick = (event) => {
    // Close the popup if the overlay (outside the content) is clicked
    if (event.target === event.currentTarget) {
      closePopup();
    }
  };

  const loadImage = (base64String) => {
    if (base64String) {
      const img = new Image();
      img.src = `data:image/jpeg;base64,${base64String}`;
      img.onload = () => classifyImage(base64String);
    }
  };

  const classifyImage = async (base64String) => {
    try {
      const response = await axios.post("http://localhost:3001/readingQrCode", {
        image: base64String,
      });
      console.log(response.data.qrState);
      // Update the user's points
      if (response.data.qrState == "valid") {
        updateUserPoints(user.points + 1);
      }
    } catch (error) {
      console.error("Error reading image:", error);
      setShowPopup(true);
    }
  };

  return (
    <div className="main-content">
      {showPopup && (
        <div className="popup" onClick={handleOverlayClick}>
          <div className="popup-content" onClick={closePopup}>
            <img src={popup} alt="Popup Background" />
          </div>
        </div>
      )}
      <button className="centered-button" onClick={handleButtonClick}>
        <img src={start_btn} alt="Button Image" />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          id="fileInput"
          accept="image/*"
          style={{ display: "none" }}
        />
      </button>
      <div className="centered-content">
        <img src={tree4} alt="Centered Image" />
      </div>
      <div className="top-left-content">
        <img src={question} alt="Small Image" />
      </div>
      <div className="top-right-content">
        <img src={coin} alt="Small Image" />
        <p>{user.points}</p>
      </div>
    </div>
  );
}
export default FeedPlayer;
