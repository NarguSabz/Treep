import React, { useState } from "react";
import Resizer from "react-image-file-resizer";
import { useAppContext } from "./AppContext";
import axios from "axios";

function FeedPlayer() {
  const { user, updateUserPoints } = useAppContext();
  const [image, setImage] = useState();

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
      fileInput.value = '';
      } catch (error) {
        console.error("error in reading image", error);
      }
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
      console.log(response.data.qrState )
      // Update the user's points
      if(response.data.qrState == "valid"){
      updateUserPoints(user.points+1);
    }
    } catch (error) {
      console.error("Error reading image:", error);
    }
  };

  return (
    <div className="main-content">
    <h3>point: {user.points}</h3>
      <label htmlFor="fileInput" className="custom-file-upload">
        <i>read qrcode</i>
      </label>
      <input
        type="file"
        onChange={handleImageChange}
        id="fileInput"
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
}
export default FeedPlayer;