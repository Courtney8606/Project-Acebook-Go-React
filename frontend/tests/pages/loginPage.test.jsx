import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { useNavigate } from "react-router-dom";
import { login } from "../../src/services/authentication";

import { LoginPage } from "../../src/pages/Login/LoginPage";

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

// Mocking the login service
vi.mock("../../src/services/authentication", () => {
  const loginMock = vi.fn();
  return { login: loginMock };
});

// Reusable function for filling out login form
const completeLoginForm = async () => {
  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "1234");
  await user.click(submitButtonEl);
};

describe("Login Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("allows a user to login", async () => {
    render(<LoginPage />);

    await completeLoginForm();

    expect(login).toHaveBeenCalledWith("test@email.com", "1234");
  });

  test("navigates to /posts on successful login", async () => {
    render(<LoginPage />);

    window.localStorage.setItem("token", "testToken");
    const mockResponse = { status: 201, json: async () => ({ token: "testToken" }) };
    login.mockResolvedValue(mockResponse);
    const navigateMock = useNavigate();

    await completeLoginForm();

    expect(navigateMock).toHaveBeenCalledWith("/posts");
  });


  test("navigates to /login on unsuccessful login", async () => {
    render(<LoginPage />);

    login.mockRejectedValue(new Error("Error logging in"));
    const navigateMock = useNavigate();

    await completeLoginForm();

    expect(navigateMock).toHaveBeenCalledWith("/login");
    
  });

  test("displays error message for incorrect password", async () => {
    render(<LoginPage />);
    login.mockResolvedValueOnce({
      status: 400, json: async () => ({message: "Password incorrect"})
    })
    
    const navigateMock = useNavigate();
    await completeLoginForm();
    expect(navigateMock).not.toHaveBeenCalled();
  
    // Ensure that the error message is rendered in the HTML
    expect(screen.getByText("Password is incorrect. Please try again.")).toBeTruthy();
  
  })

  test("displays undefined error message", async () => {
    render(<LoginPage />);
    login.mockResolvedValueOnce({
      status: 400, json: async () => ({message: "Another message"})
    })
    
    const navigateMock = useNavigate();
    await completeLoginForm();
    expect(navigateMock).not.toHaveBeenCalled();
  
    // Ensure that the error message is rendered in the HTML
    expect(screen.getByText("An error has occurred. Please try again.")).toBeTruthy();
  
  })

  test("displays error when an email address is not found", async () => {
    render(<LoginPage />);
    login.mockResolvedValueOnce({
      status: 500
    })
    
    const navigateMock = useNavigate();
    await completeLoginForm();
    expect(navigateMock).not.toHaveBeenCalled();
  
    // Ensure that the error message is rendered in the HTML
    expect(screen.getByText("Email address not found. Please try a different email address or sign up.")).toBeTruthy();
  
  })

  test("navigate to log in if a rejected Promise is returned", async () => {
    render(<LoginPage />);
    login.mockRejectedValueOnce()
    
    const navigateMock = useNavigate();
    await completeLoginForm();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  })

});

