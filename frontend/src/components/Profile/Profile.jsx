import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploadButton from "../../components/ImageUploadButton/ImageUploadButton";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import MyPostsPage from "../../pages/MyPostsPage/MyPostsPage";
import { getImage } from "../../services/images";

const ProfileBox = ({ profile, setProfile }) => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

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
      <h2 className="profile-name">
        {username !== null ? `Hello, ${username}!` : null}
      </h2>
      <div className="profile-details">
        <ProfilePicture profile={profile} />
        <p className="profile-bio"></p>
        <div className="upload-button">
          <ImageUploadButton setProfile={setProfile} />
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
