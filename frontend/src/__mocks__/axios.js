const axios = {
    create: jest.fn(() => axios),
    get: jest.fn(),
    post: jest.fn(),
    isAxiosError: jest.fn(),
    // Add any other methods your application uses
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  };
  
  export default axios;