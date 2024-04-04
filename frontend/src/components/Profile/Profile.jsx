import React from "react";

const ProfileBox = () => {
const username = localStorage.getItem("username");


  return (
    <div className="profile-box">
      <img
        className="profilePicture"
        src="path_to_your_profile_picture.jpg"
        alt="Profile Picture"
      />
      
      <div className="profile-details">
        <h2 className="profile-name">
        {username !== null ? `Hello, ${username}!` : null}</h2>
        <p className="profile-bio">
            {/* You can add more profile details here if pulled through from the backend */}
        </p>
       
      </div>
    </div>
  );
};

export default ProfileBox;