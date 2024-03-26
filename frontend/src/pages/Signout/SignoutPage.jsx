// import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignoutPage = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <button onClick={logout}>Logout</button>
    </>
  );
};