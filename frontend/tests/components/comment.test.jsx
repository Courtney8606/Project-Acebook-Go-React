import { render, screen } from "@testing-library/react";
import Comment from "../../src/components/Comment/Comment";

describe("Comment", () => {
  test("displays the comment as an article", () => {
    const testComment = { postid: "1", comment: "test comment", username: "pickle"};
    render(<Comment 
      comment={testComment.comment}
      postid={testComment.postid}
      username={testComment.username}
      />);

    const article = screen.getByRole("commenting");
    expect(article.textContent).toBe("test comment");
  });
});

