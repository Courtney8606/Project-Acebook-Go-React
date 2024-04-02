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
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
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

    // fetch.mockResponseOnce("", {
    //   status: 201,
    // });
    
  //   const asyncMock = signup.mockResolvedValue({ status: 201 });
  //  console.log(asyncMock)
    
    expect(signup).toHaveBeenCalledWith("test@email.com", "1234");
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  

  test("navigates to /signup on unsuccessful signup with 400 error", async () => {
    render(<SignupPage />);

    signup.mockRejectedValue({ status: 400 });

    const navigateMock = useNavigate();

    await completeSignupForm();
    
  
    expect(navigateMock).toHaveBeenCalledWith("/signup");
  });
});

test("navigates to /signup on unsuccessful signup with 500 error", async () => {
  render(<SignupPage />);

  signup.mockRejectedValue({ status: 500 });

  const navigateMock = useNavigate();

  await completeSignupForm();

  expect(navigateMock).toHaveBeenCalledWith("/signup");
});

// test("error message if username not provided", async () => {
//   render(<SignupPage />);

//   signup.mockRejectedValue({ status: 400, message: "Must supply username and password"});
//   const navigateMock = useNavigate();

//   await completeSignupForm();
//   expect(navigateMock).toHaveBeenCalled();
  

//     const errorMessageElement = screen.getByText(/Please input both a valid email address and a password/i);
//     expect(errorMessageElement).toBeInTheDocument();
//   });

  // // Ensure that the error message is rendered in the HTML
  // expect(screen.getByText(/Please input both a valid email address and a password/i)).toBeTruthy();


