import "/src/comment.css";

const UserComment = (props) => {
  return (
    <div>
      <div className="comment" id="user-comment">
        <div className="icon-comment">
          <i className="fas fa-user-circle"></i>
        </div>
        <article className="feed-comment" id = "feed-comment" role="commenting" key={props.postid}>
          {props.comment}
          <br></br>
        </article>
      </div>
      <p className="username">Username: {props.username}</p>
    </div>
  );
};

export default UserComment;
