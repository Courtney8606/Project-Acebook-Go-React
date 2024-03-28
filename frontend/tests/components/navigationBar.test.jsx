import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";

import NavigationBar from "../../src/components/NavigationBar/NavigationBar";

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock };
});

describe("NavigationBar render", () => {
  test("renders a logged in navigation bar when user is logged in", async () => {
    // Remove any stored token to be sure
    beforeEach(() => {
      window.localStorage.removeItem("token");
    });

    // Set the localStorage to include a token to simulate logging in
    window.localStorage.setItem("token", "testToken");    

    // Render the navbar
    render(<NavigationBar />);

    // Test the appropriate navbar components exist
    const logo = screen.getByRole('heading');
    const postsLink = screen.getByRole('postsButton');
    const createPostLink = screen.getByRole('createPostButton');
    const logoutLink = screen.getByRole('logoutButton');
    expect(logo).toBeTruthy();
    expect(postsLink).toBeTruthy();
    expect(createPostLink).toBeTruthy();
    expect(logoutLink).toBeTruthy();
  });

  test("renders a logged out navigation bar when user is logged out", async () => {
    // Remove any stored token to simulate logging out
    beforeEach(() => {
      window.localStorage.removeItem("token");
    });

    // Render the navbar
    render(<NavigationBar />);

    // Test the appropriate navbar components exist
    const logo = screen.getByRole('heading');
    const loginLink = screen.getByRole('loginButton');
    const signupLink = screen.getByRole('signupButton');
    expect(logo).toBeTruthy();
    expect(loginLink).toBeTruthy();
    expect(signupLink).toBeTruthy();
  });
});

describe("User clicks on NavigationBar components", () => {
  test("signed out user can click to login", async () => {
    // Remove any stored token to simulate logging out
    window.localStorage.removeItem("token");

    // Get the mocked navigate function
    const navigateMock = useNavigate();

    // Render the navbar
    render(<NavigationBar />);

    // Simulate a click on the Login button
    const loginLink = screen.getByRole('loginButton');
    userEvent.click(loginLink);

    // Assert that navigate is called with the correct path
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });

  test("signed out user can click to sign up", async () => {
    // Remove any stored token to simulate logging out
    window.localStorage.removeItem("token");

    // Get the mocked navigate function
    const navigateMock = useNavigate();

    // Render the navbar
    render(<NavigationBar />);

    // Simulate a click on the Login button
    const signupLink = screen.getByRole('signupButton');
    userEvent.click(signupLink);

    // Assert that navigate is called with the correct path
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/signup");
    });
  });

  test("signed in user can click to navigate to posts", async () => {
    // Remove any stored token to be sure
    beforeEach(() => {
      window.localStorage.removeItem("token");
    });

    // Set the localStorage to include a token to simulate logging in
    window.localStorage.setItem("token", "testToken");    

    // Get the mocked navigate function
    const navigateMock = useNavigate();

    // Render the navbar
    render(<NavigationBar />);

    // Simulate a click on the Create Post button
    const postsLink = screen.getByRole('postsButton');
    userEvent.click(postsLink);

    // Assert that navigate is called with the correct path
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/posts");
    });
  });

  test("signed in user can click to navigate to create post", async () => {
    // Remove any stored token to be sure
    beforeEach(() => {
      window.localStorage.removeItem("token");
    });

    // Set the localStorage to include a token to simulate logging in
    window.localStorage.setItem("token", "testToken");    

    // Get the mocked navigate function
    const navigateMock = useNavigate();

    // Render the navbar
    render(<NavigationBar />);

    // Simulate a click on the Create Post button
    const createPostLink = screen.getByRole('createPostButton');
    userEvent.click(createPostLink);

    // Assert that navigate is called with the correct path
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/createpost");
    });
  });

  test("signed in user can click to logout", async () => {
    // Remove any stored token to be sure
    beforeEach(() => {
      window.localStorage.removeItem("token");
    });

    // Set the localStorage to include a token to simulate logging in
    window.localStorage.setItem("token", "testToken");    

    // Get the mocked navigate function
    const navigateMock = useNavigate();

    // Mock localStorage so that the token can be removed
    const localStorageMock = {
      removeItem: vi.fn(),
      getItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Render the navbar
    render(<NavigationBar />);

    // Simulate a click on the Logout button
    const logoutLink = screen.getByRole('logoutButton');
    userEvent.click(logoutLink);

    // Assert that navigate is called with the correct path
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login");

    // Assert that removeItem is called with 'token'
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");

    });
  });
});