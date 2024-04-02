import { render, screen } from "@testing-library/react";
import Comment from "../../src/components/Comment/Comment";

describe("Comment", () => {
  test("displays the comment as an article", () => {
    const testComment = { id: "1", comment: "test comment", post_id: "1" };
    render(<Comment comment={testComment} />);

    const article = screen.getByRole("article");
    expect(article.textContent).toBe("test comment");
  });
});
