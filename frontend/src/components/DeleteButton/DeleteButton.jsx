import { deletePostByID } from "../../services/deletepost";
import "./DeleteButton.css";

const DeleteButton = ({ postID }) => {
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
      role='deletion'
      onClick={handleDeletePost}>
      <i className="fa fa-trash"></i>
    </button>
  );
};

export default DeleteButton;