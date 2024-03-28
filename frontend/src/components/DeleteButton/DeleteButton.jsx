// import React, { useState } from "react";
import { deletePostByID } from "../../services/deletepost";
import { useNavigate } from "react-router-dom";
import "./DeleteButton.css";

const DeleteButton = ({ postID }) => {
  const navigate = useNavigate();

  const handleDeletePost = () => {
    const token = localStorage.getItem("token");
    if (token) {
      deletePostByID(postID, token);
      navigate("/posts");
    }
  };

  return (
    <button
      className="delete"
      onClick={handleDeletePost}>
      <i className="fa fa-trash"></i>
    </button>
  );
};

export default DeleteButton;