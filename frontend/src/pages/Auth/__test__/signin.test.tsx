import React from "react";
import { render, screen } from "@testing-library/react";
import SignIn from "../signin";

jest.mock("../../../store/authStore", () => ({
    __esModule: true,
    useAuthStore: () => ({
      default: jest.fn(),
      signIn: jest.fn(),
    }),
  }));
jest.mock("react-router-dom", () => ({
  __esModule: true,
  useNavigate: jest.fn(),
  Link: jest.fn(() => <a href="/signup">Sign up now</a>),
}));

describe("SignUn component", () => {
  it("renders sign up form correctly", async () => {
    render(<SignIn />);

    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText("Sign up now")).toBeInTheDocument();
  });
});
