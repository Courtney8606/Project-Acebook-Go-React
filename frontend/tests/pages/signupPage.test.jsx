import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import createFetchMock from "vitest-fetch-mock";
import { vi } from "vitest";

import { useNavigate } from "react-router-dom";
import { signup } from "../../src/services/authentication";

import { SignupPage } from "../../src/pages/Signup/SignupPage";

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

// createFetchMock(vi).enableMocks();

// Mocking the signup service
vi.mock("../../src/services/authentication", () => {
  const signupMock = vi.fn();
  return { signup: signupMock };
});


// Reusable function for filling out signup form
const completeSignupForm = async () => {
  const user = userEvent.setup();

  const emailInputEl = screen.getByPlaceholderText("Email");
  const passwordInputEl = screen.getByPlaceholderText("Password");
  // const usernameInputEl = screen.getByPlaceholderText("Username");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  // await user.type(usernameInputEl, "TestUsername");
  await user.type(passwordInputEl, "1234");
  await user.click(submitButtonEl);
};

describe("Signup Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("allows a user to signup", async () => {
    render(<SignupPage />);

    await completeSignupForm();

    expect(signup).toHaveBeenCalledWith("test@email.com", "1234");
  });


  test("navigates to /login on successful signup", async () => {
    
    render(
        <SignupPage />
    );

    const navigateMock = useNavigate();

    signup.mockResolvedValue({ status: 201 });

    await completeSignupForm();
    
    expect(signup).toHaveBeenCalledWith("test@email.com", "1234");
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  

  test("on unsuccessful signup with 400 error and no error message returns else message", async () => {
    render(<SignupPage />);

    signup.mockResolvedValue({ status: 400 });

    const navigateMock = useNavigate();

    await completeSignupForm();
  
    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByText("An unknown error has occurred. Please try again")).toBeTruthy();
  });


test("navigates to /signup on unsuccessful signup with 500 error", async () => {
  render(<SignupPage />);

  signup.mockResolvedValue({ status: 500 });

  const navigateMock = useNavigate();

  await completeSignupForm();

  expect(navigateMock).not.toHaveBeenCalled();
  expect(screen.getByText("An unknown error has occurred. Please try again")).toBeTruthy();
});


test("error message if username not provided", async () => {
  render(<SignupPage />);

  signup.mockResolvedValueOnce({
    status: 400, json: async () => ({message: "Must supply username and password"})
  })

  const navigateMock = useNavigate();

  await completeSignupForm();
  expect(navigateMock).not.toHaveBeenCalled();


  // Ensure that the error message is rendered in the HTML

  expect(screen.getByText("Please input both a valid email address and a password")).toBeTruthy();

})

test("error message if invalid email", async () => {
  render(<SignupPage />);
  signup.mockResolvedValueOnce({
    status: 400, json: async () => ({message: "Invalid email address"})
  })

  const navigateMock = useNavigate();
  await completeSignupForm();
  expect(navigateMock).not.toHaveBeenCalled();

  // Ensure that the error message is rendered in the HTML
  expect(screen.getByText("Please include a valid email address")).toBeTruthy();

})

test("error message if email in use", async () => {
  render(<SignupPage />);
  signup.mockResolvedValueOnce({
    status: 400, json: async () => ({message: "Email address already in use"})
  })
  
  const navigateMock = useNavigate();
  await completeSignupForm();
  expect(navigateMock).not.toHaveBeenCalled();

  // Ensure that the error message is rendered in the HTML
  expect(screen.getByText("This email address is already in use. Please log in or sign up with a different email address")).toBeTruthy();

})

test("undefined error message", async () => {
  render(<SignupPage />);
  signup.mockResolvedValueOnce({
    status: 400, json: async () => ({message: "Another message"})
  })
  
  const navigateMock = useNavigate();
  await completeSignupForm();
  expect(navigateMock).not.toHaveBeenCalled();

  // Ensure that the error message is rendered in the HTML
  expect(screen.getByText("An error has occurred. Please try again")).toBeTruthy();

})



})
