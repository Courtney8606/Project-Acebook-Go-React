const UserComment = (props) => {
  return (
    <div className="comment">
      <div className="icon-comment">
        <i className="fas fa-user-circle"></i>
      </div>
      {/* Need to determine props once backend is built - these are placeholders*/}
      <article className="feed-comment" key={props.postid}>
        {props.comment}
        <br></br>
        {props.username}
      </article>
    </div>
  );
};

export default UserComment;
