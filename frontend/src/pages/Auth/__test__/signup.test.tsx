import React from "react";
import { render, screen } from "@testing-library/react";
import SignUp from "../signup";

jest.mock("../../../store/authStore", () => ({
    __esModule: true,
    useAuthStore: () => ({
      default: jest.fn(),
      signUp: jest.fn(),
    }),
  }));
jest.mock("react-router-dom", () => ({
  __esModule: true,
  useNavigate: jest.fn(),
  Link: jest.fn(() => <a href="/signin">Sign in</a>),
}));

describe("SignIn component", () => {
  it("renders sign in form correctly", async () => {
    render(<SignUp />);

    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByText("Sign up now")).toBeInTheDocument();
  });
});
