import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Home from "../home";
import api from "../../services/api";
import { io } from "socket.io-client";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../services/api");
jest.mock("socket.io-client");

const mockedApi = api as jest.Mocked<typeof api>;
const mockedSocket = io as jest.MockedFunction<typeof io>;

const mockVideos = [
  {
    id: "1",
    URL: "http://example.com",
    title: "Video 1",
    description: "Description 1",
    thumbnail: "http://example.com/thumbnail1.jpg",
    createdAt: new Date().toISOString(),
    username: "user1",
  },
  {
    id: "2",
    URL: "http://example.com",
    title: "Video 2",
    description: "Description 2",
    thumbnail: "http://example.com/thumbnail2.jpg",
    createdAt: new Date().toISOString(),
    username: "user2",
  },
];

describe("Home Component", () => {
  beforeEach(() => {
    mockedApi.get.mockResolvedValue({ data: mockVideos });
    mockedSocket.mockReturnValue({
      on: jest.fn(),
      off: jest.fn(),
    } as any);
    window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render and fetch videos on mount", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledWith("/videos");
    });

    await waitFor(() => {
      expect(screen.getByText("Video 1")).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText("Video 2")).toBeInTheDocument();
    });
  });

  it("should return no data on 401 error", async () => {
    mockedApi.get.mockRejectedValue({
      response: { status: 401 },
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No data")).toBeInTheDocument();
    });
  });
});
