import { initializeApp } from 'firebase/app'
import { getAuth, signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyDuMG2qATA7lghIYmeSQ_wwpReeOKL1JqI",
  authDomain: "appply-51558.firebaseapp.com",
  projectId: "appply-51558",
  storageBucket: "appply-51558.appspot.com",
  messagingSenderId: "635110125861",
  appId: "1:635110125861:web:95710eb491f29c3a1b6acc"
}


//Initialize Firebase

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

const signMeOut = () => {
  signOut(auth)
}

const provider = new GoogleAuthProvider()

const signInWithGoogle = () => signInWithPopup(auth, provider)

const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

const signUp = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password)
}

export {
  signMeOut,
  signIn,
  signUp,
  signInWithGoogle
}

export default app

