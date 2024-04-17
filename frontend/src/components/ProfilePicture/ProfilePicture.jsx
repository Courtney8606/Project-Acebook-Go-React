import React, { useState, useEffect } from "react";
import { getImage } from "../../services/images";
import Profile from "../../components/Profile/Profile";

const ProfilePicture = (props) => {
  const { profile } = props;
  return <img className="profilePicture" src={profile} alt="Profile Picture" />;
};

export default ProfilePicture;
