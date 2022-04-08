import { useState, useContext, useEffect, createContext, FC } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, getBoardsForUser } from "../lib/firebase.js";

import {useBoardsContext} from './board'

type AuthContextType = {
  user: FirebaseUser | null
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const useAuthContext = () => useContext(AuthContext);


const UserContextProvider: FC = ({ children }) => {

  const {setBoards, setIsLoadingBoards} = useBoardsContext()


  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      setUser(currUser);
      if(currUser && currUser.uid) {
        setIsLoadingBoards(true)
        const boards = await getBoardsForUser(currUser.uid);
        setBoards(boards)
        setIsLoadingBoards(false)
      }
    });

    return unsubscribe 
  }, []);


  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default UserContextProvider;
