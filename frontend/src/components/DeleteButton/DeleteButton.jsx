// import React, { useState } from "react";
import "./DeleteButton.css";

const DeleteButton = (props) => {
  const deletePost = () => {

    }

  return (
    <button
      className="delete"
      onClick={() => {
        deletePost();
      }}
    >
      <i className="fa fa-trash"></i>
    </button>
  );
};

export default DeleteButton;