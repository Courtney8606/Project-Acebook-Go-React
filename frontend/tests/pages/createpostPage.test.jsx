import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import { CreatePostPage } from "../../src/pages/CreatePost/CreatePostPage";
import { postCreate } from "../../src/services/createpost";

// Mocking the postCreate service
vi.mock("../../src/services/createpost", () => {
  const postCreateMock = vi.fn();
  return { postCreate: postCreateMock };
});

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

// Reusable function for creating a new post

const completeCreatePost = async () => {
  const user = userEvent.setup();

  const messageInputEl = screen.getByLabelText("Enter your message:");
  const buttonInputEl = screen.getByRole("submit-button");

  await user.type(messageInputEl, "Test message");
  await user.click(buttonInputEl);
};

describe("Create Post", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    window.localStorage.removeItem("token");
  });

  test("Allows user to create a post", async () => {
    window.localStorage.setItem("token", "testToken");
    render(<CreatePostPage />);
    await completeCreatePost();
    expect(postCreate).toHaveBeenCalledWith("Test message", "testToken");
    
  });

  test("Natigates to Feedpage if token", async () => {
    window.localStorage.setItem("token", "testToken");
    postCreate.mockResolvedValue({ status: 201 });
    render(<CreatePostPage />);
    await completeCreatePost();
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/posts");
  });

  test("Natigates to login if no token", async () => {
    render(<CreatePostPage />);
    await completeCreatePost();
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});
