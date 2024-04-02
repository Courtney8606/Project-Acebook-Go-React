import { deletePostByID } from "../../services/deletepost";
import { useNavigate } from "react-router-dom";
import "./DeleteButton.css";

const DeleteButton = ({ postID }) => {
  const navigate = useNavigate();

  const handleDeletePost = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await deletePostByID(postID, token);
      window.location.reload();
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