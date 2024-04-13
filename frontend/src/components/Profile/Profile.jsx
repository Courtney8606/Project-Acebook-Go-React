import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploadButton from "../../components/ImageUploadButton/ImageUploadButton";
import { getImage } from "../../services/images";


const ProfileBox = () => {
const username = localStorage.getItem("username");

const [profile, setProfile] = useState([]);
const navigate = useNavigate();
const [loading, setLoading] = useState(true);

const token = localStorage.getItem("token");
if (!token) {
  navigate("/login");
  return;
}
console.log(profile)
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID");
      const profilepicture = await getImage(userID, token);
      setProfile(profilepicture);
    } catch (error) {
      console.error(error);
      navigate(`/myposts`);
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    fetchData();
  }
  
}, []);

  return (
    <div className="profile-box">
      <img
        className="profilePicture"
        src={profile}
        alt="Profile Picture"
      />
      
      <div className="profile-details">
        <h2 className="profile-name">
        {username !== null ? `Hello, ${username}!` : null}</h2>
        <p className="profile-bio">
            {/* You can add more profile details here if pulled through from the backend */}
        </p>
        <ImageUploadButton setProfile={setProfile}/>
      </div>
    </div>
  );
};

export default ProfileBox;