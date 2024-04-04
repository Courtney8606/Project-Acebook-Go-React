import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import LikeButton from "../../src/components/LikeButton/LikeButton";

describe("LikeButton", () => {
  test("displays colour and count based on liked/likes state", () => {
    const postId = "123";
    const liked = { "123": true };
    const likes = { "123": 4 };
    render(
      <LikeButton postid={postId} liked={liked[postId]} likes={likes[postId]} />
    );

    const button = screen.getByRole("liking");
    expect(button.textContent).toBe("4");
    expect(button.firstChild).toHaveStyle({ color: "#ff6666" });
  });
});
