const socket = {
    on: jest.fn(),
    off: jest.fn(),
  };
  export const io = jest.fn(() => socket);
  