import { useState, useContext, useEffect, createContext, FC } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../lib/firebase.js";

type AuthContextType = {
  user: FirebaseUser | null
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const useAuthContext = () => useContext(AuthContext);


const UserContextProvider: FC = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubsribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
    });

    return unsubsribe
  }, []);


  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default UserContextProvider;
