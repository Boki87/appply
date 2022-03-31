import { signInWithGoogle, signMeOut } from "./lib/firebase.js";
import {signOut} from 'firebase/auth'
import {useAuthContext} from './context'

function App() {
  const { user } = useAuthContext();

  return (
    <div>
      Hello World
      <button
        onClick={() => {
          signInWithGoogle();
        }}
      >
        Google
      </button>
      <br />
   
      <button
        onClick={() => {
          signMeOut();
        }}
      >
        Sign Out
      </button>
      <br />
      <h1>{user ? user.email : "no user"}</h1>
    </div>
  );
}

export default App;
