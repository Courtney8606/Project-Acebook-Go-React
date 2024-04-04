import "/src/comment.css";

const UserComment = (props) => {
  return (
    <div>
      <div className="comment">
        <div className="icon-comment">
          <i className="fas fa-user-circle"></i>
        </div>
        {/* Need to determine props once backend is built - these are placeholders*/}
        <article className="feed-comment" key={props.postid}>
          {props.comment}
          <br></br>
        </article>
      </div>
      <p className="username">Username: {props.username}</p>
    </div>
  );
};

export default UserComment;
