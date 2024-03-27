import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import SignoutButton from "../../src/components/SignoutButton/SignoutButton";
import { useNavigate } from "react-router-dom";

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock };
});

test("navigates to /login when clicked", async () => {
  // Render the SignoutButton component
  render(<SignoutButton />);

  // Get the mocked navigate function
  const navigateMock = useNavigate();

  // Mock localStorage
  const localStorageMock = {
    removeItem: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  // Simulate a click on the SignoutButton
  userEvent.click(screen.getByText("Logout"));

  // Assert that navigate is called with '/login'
  await waitFor(() => {
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  // Assert that removeItem is called with 'token'
  expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
});
