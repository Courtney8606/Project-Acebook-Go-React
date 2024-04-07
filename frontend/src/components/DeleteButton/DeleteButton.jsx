import { deletePostByID } from "../../services/deletepost";
import "./DeleteButton.css";

const DeleteButton = ({ postID, onDelete }) => {
  const handleDeletePost = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await deletePostByID(postID, token);
      // Update state on parent to rerender posts
      onDelete(postID);
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