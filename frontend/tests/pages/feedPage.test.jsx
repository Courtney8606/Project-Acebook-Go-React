import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { waitFor } from "@testing-library/dom";
import { FeedPage } from "../../src/pages/Feed/FeedPage";
import { getPosts } from "../../src/services/posts";
import { getLikes } from "../../src/services/likes";
import { getComments } from "../../src/services/comments";
import { useNavigate } from "react-router-dom";

// Mocking the getPosts service
vi.mock("../../src/services/posts", () => {
  const getPostsMock = vi.fn();
  return { getPosts: getPostsMock };
});

// Mocking the getLikes service
vi.mock("../../src/services/likes", () => {
  const getLikesMock = vi.fn();
  return { getLikes: getLikesMock };
});

// Mocking the getComments service
vi.mock("../../src/services/comments", () => {
  const getCommentsMock = vi.fn();
  return { getComments: getCommentsMock };
});

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

describe("Feed Page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
  });

  test("It displays posts from the backend with associated likes", async () => {
    window.localStorage.setItem("token", "testToken");

    const mockPosts = [{ _id: "12345", message: "Test Post 1" }];
    const mockComments = [
        {
          post_id: 12345,
          comment_id: 1,
          text: "this is a comment",
          username: "username1"
        },
        {
          post_id: 12345,
          comment_id: 2,
          text: "a comment by someone else",
          username: "username6"
        }
    ];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });
    getLikes.mockResolvedValue({ postID: "12345", UserHasLiked: true , LikeCount:  6, token: "newToken" });
    getComments.mockResolvedValue({comments: mockComments, token: "newToken" })

    render(<FeedPage />);
   
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

    const post = await screen.findByRole("posting");
    expect(post.textContent).toEqual("Test Post 1");

    const like = await screen.findByRole("liking");
    expect(like.textContent).toEqual("6");
    expect(like.firstChild).toHaveStyle({ color: "#ff6666" });

    expect(screen.getByText("this is a comment")).toBeInTheDocument();
    expect(screen.getByText("a comment by someone else")).toBeInTheDocument();
  });

  test("It navigates to login if no token is present", async () => {
    render(<FeedPage />);
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

});


