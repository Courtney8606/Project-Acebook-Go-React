import { HomePage } from "../../src/pages/Home/HomePage";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock };
});

describe("Home Page", () => {
  test("welcomes you to the site", () => {
    // We need the Browser Router so that the Link elements load correctly
    render(
        <HomePage />
    );

    const heading = screen.getByRole("heading");
    expect(heading.textContent).toEqual("Welcome to Acebook!");
  });

  test("Renders a functioning login link", async () => {
    // Get the mocked navigate function
    const navigateMock = useNavigate();

    render(
        <HomePage />
    );

    // Simulate a click on the Login button
    const loginLink = screen.getByRole('loginButton');
    userEvent.click(loginLink);

    // Assert that navigate is called with the correct path
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });

  test("Renders a functioning signup link", async () => {
    // Get the mocked navigate function
    const navigateMock = useNavigate();

    render(
        <HomePage />
    );

    // Simulate a click on the Login button
    const signupLink = screen.getByRole('signupButton');
    userEvent.click(signupLink);

    // Assert that navigate is called with the correct path
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/signup");
    });
  });
});