import React, { useState, useEffect } from "react";
import { imageCreate, getImage } from "../../services/images";
import ProfileBox from "../../components/Profile/Profile";
import "/src/imageuploadbutton.css";

const ImageUploadButton = ({ profile, setProfile }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async (event) => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("userID");
    event.preventDefault();
    if (token && image) {
      const formData = new FormData();
      formData.append("profile_picture", image);
      await imageCreate(formData, token);
      const newimage = await getImage(userID, token);
      setProfile(newimage);
    }
  };

  return (
    <div className="image-upload">
      <input
        className="select-button"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <button
        type="button"
        className="image-upload-button"
        onClick={handleSubmit}
      >
        Upload
      </button>
    </div>
  );
};

export default ImageUploadButton;
