
const initialState = {
    user: null,
    loading: false,
    error: null,
    signIn: jest.fn().mockResolvedValue(undefined),
    signUp: jest.fn().mockResolvedValue(undefined),
    signOut: jest.fn(),
  };
  
  // Mocked store creation function
  const useAuthStore = jest.fn(() => initialState);
  
  export default useAuthStore;
  