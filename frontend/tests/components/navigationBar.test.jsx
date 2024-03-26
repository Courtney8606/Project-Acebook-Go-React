import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import NavigationBar from "../../src/components/NavigationBar/NavigationBar";

describe("NavigationBar", () => {
  test("renders a navigation bar with multiple links", async () => {
    render(
      // We need the Browser Router so that the Link elements load correctly
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
    );
  
    const loginLink = screen.getByText("Login");
    const signupLink = screen.getByText("Signup");
    expect(loginLink.getAttribute("href")).toEqual("/login");
    expect(signupLink.getAttribute("href")).toEqual("/signup");
  });
});