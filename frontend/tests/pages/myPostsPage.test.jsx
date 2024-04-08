import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MyPostsPage } from "../../src/pages/MyPostsPage/MyPostsPage";
import { getPostsByUserID } from "../../src/services/posts";
import { getLikes } from "../../src/services/likes";
import { useNavigate } from "react-router-dom";

// Mocking the getPostsByUserID service
vi.mock("../../src/services/posts", () => {
  const getPostsByUserIDMock = vi.fn();
  return { getPostsByUserID: getPostsByUserIDMock };
});

// Mocking the getPosts service
vi.mock("../../src/services/likes", () => {
  const getLikesMock = vi.fn();
  return { getLikes: getLikesMock };
});

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

describe("My Posts Page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("userID");
  });

  test("It displays only my own (single) post from the backend with associated likes", async () => {
    window.localStorage.setItem("token", "testToken");
    window.localStorage.setItem("userID", "2");

    // Mock GetPostsByUserID to return only the post for the specified user ID
    getPostsByUserID.mockResolvedValue({
        // Filter posts based on the provided userID
          "posts": [
              {
                  "_id": 2,
                  "message": "My post 2",
                  "liked_user_ids": [],
                  "username": "MeUser",
                  'created_at': `02/06/06 14:06`
              },
          ],
          "token": `test token`
    });
    const result = await getPostsByUserID();
    console.log('current mock response ', result);

    render(<MyPostsPage />);

    const post = await screen.findByRole("posting");
    expect(post.textContent).toEqual("My post 2");
  });

  test('It renders the delete button', async () => {
    window.localStorage.setItem("token", "testToken");
    const mockPosts = [{ _id: "12345", message: "Test Post 1" }];
    getPostsByUserID.mockResolvedValue({ posts: mockPosts, token: "newToken" });
    render(<MyPostsPage />);
    const deleteButton = await screen.findByRole("deletion");
    expect(deleteButton).toBeTruthy();
  })
});


