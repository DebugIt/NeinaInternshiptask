import { createContext } from "react";

// Default value for context to avoid destructuring error
const UserContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {}
});

export default UserContext;
