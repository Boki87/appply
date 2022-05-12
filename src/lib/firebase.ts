import { initializeApp } from 'firebase/app'
import { getAuth, signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, addDoc, getDoc, collection, getDocs, deleteDoc, setDoc, query, where } from 'firebase/firestore'
import { JobType } from '../context/board'


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
const db = getFirestore(app)
const provider = new GoogleAuthProvider()

const auth = getAuth(app)


//auth functions
const signInWithGoogle = () => signInWithPopup(auth, provider)

const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

const signUp = async (email: string, password: string) => {
  try {
    //register user
    let { user } = await createUserWithEmailAndPassword(auth, email, password)

    //add starter board to boards collection
    let today = new Date()
    let board = await addDocToCollection('boards', {
      user_id: user.uid,
      name: 'Jobs ' + today.getFullYear(),
      created_at: +new Date()
    })

    addStarterListsToBoard(board.id)

  } catch (err) {
    console.log(err)
  }
}

function addStarterListsToBoard(boardId: string) {
  //add starter lists to board
  const initialLists = [
    'Wishlist',
    'Applied',
    'Interview',
    'Offer',
    'Rejected'
  ]

  initialLists.forEach(async (list, i) => {
    let newList = await addDocToCollection('lists', {
      board_id: boardId,
      name: list,
      order_id: i
    })
  })
}

const signMeOut = () => {
  signOut(auth)
}

//db functions
const addDocToCollection = async (collectionName: string, doc: any) => {
  return await addDoc(collection(db, collectionName), doc)
}

const updateDoc = async (collectionName: string, docId: string, docObj: any) => {
  console.log(collectionName, docId, docObj)
  const docRef = doc(db, collectionName, docId)
  await setDoc(docRef, docObj, { merge: true })
  const docRes = await getDoc(docRef)
  const docResData = docRes.data()
  return { id: docRes.id, ...docResData }
}


const getDocFromCollection = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id)
  const docRes = await getDoc(docRef)
  const docData = docRes.data()
  return {
    id: docRes.id,
    ...docData
  }
}

const getBoardsForUser = async (userId: string) => {
  const querySnapshot = await getDocs(query(collection(db, 'boards'), where('user_id', '==', userId)))
  const resArr: any = []
  querySnapshot.forEach(doc => {
    let d = doc.data()
    resArr.push({ id: doc.id, ...d })
  })
  return resArr
}

const deleteBoard = async (boardId: string) => {

  const boardRef = doc(db, 'boards', boardId)
  const board = await getDoc(boardRef)
  const lists = await getDocs(query(collection(db, 'lists'), where('board_id', '==', boardId)))

  //delete lists for job board
  lists.forEach(async listDoc => {
    await deleteDoc(doc(db, 'lists', listDoc.id))
    //delete jobs for list
    const jobs = await getDocs(query(collection(db, 'jobs'), where('list_id', '==', listDoc.id)))
    jobs.forEach(async jobDoc => {
      await deleteDoc(doc(db, 'jobs', jobDoc.id))
    })
  })

  await deleteDoc(boardRef)
}


const getListsForBoard = async (boardId: string | undefined) => {
  const querySnapshot = await getDocs(query(collection(db, 'lists'), where('board_id', '==', boardId)))
  const resArr: any = []
  querySnapshot.forEach(doc => {
    let d = doc.data()
    resArr.push({ id: doc.id, ...d })
  })
  resArr.sort((a: any, b: any) => a.order_id - b.order_id)
  return resArr
}

const updateList = async (listId: string, listObj: any) => {
  const listRef = doc(db, 'lists', listId)
  await setDoc(listRef, listObj, { merge: true })
  const listRes = await getDoc(listRef)
  const listResData = listRes.data()
  return { id: listRes.id, ...listResData }
}

const deleteList = async (listId: string) => {
  const listRef = doc(db, 'lists', listId)
  await deleteDoc(listRef)
}

const createNewList = async (boardId: string | undefined, listObj: object) => {
  const listOrder = await getDocs(collection(db, 'lists'))
  const orderId = listOrder.length
  const list = await addDocToCollection('lists', listObj)
  return list
}

const updateListsOrder = async (lists: any[]) => {
  lists.forEach(async (list, i) => {
    await updateList(list.id, { order_id: i })
  })
}

//jobs functions
const addJob = async (boardId: string, listId: string, userId: string, orderId: number) => {
  const job = await addDocToCollection('jobs', {
    list_id: listId,
    board_id: boardId,
    user_id: userId,
    name: 'My dream role',
    description: '',
    company: 'FANG ltd',
    deadline: '',
    location: '',
    color: '',
    notes: '',
    url: '',
    company_website: '',
    order_id: orderId,
    created_at: +new Date()
  })
  const jobData = await getDocFromCollection('jobs', job.id)
  return jobData
}

const getJobsForBoard = async (boardId: string) => {
  const querySnapshot = await getDocs(query(collection(db, 'jobs'), where('board_id', '==', boardId)))
  const resArr: any = []
  querySnapshot.forEach(doc => {
    let d = doc.data()
    resArr.push({ id: doc.id, ...d })
  })
  resArr.sort((a: any, b: any) => a.order_id - b.order_id)
  return resArr
}

const deleteJobsInList = async (listId: string) => {
  const jobs = await getDocs(query(collection(db, 'jobs'), where('list_id', '==', listId)))
  jobs.forEach(async job => {
    await deleteDoc(doc(db, 'jobs', job.id))
  })
}


const fetchJobData = async (jobId: string) => {
  const job = await getDocFromCollection('jobs', jobId)
  return job
}

const updateJob = async (jobId: string, jobObj: any) => {
  const jobRef = doc(db, 'jobs', jobId)
  await setDoc(jobRef, jobObj, { merge: true })
  const jobRes = await getDoc(jobRef)
  return { id: jobRes.id, ...jobRes.data() }
}

const deleteJob = async (jobId: string) => {
  const jobRef = doc(db, 'jobs', jobId)
  await deleteDoc(jobRef)
}

export {
  signMeOut,
  signIn,
  signUp,
  signInWithGoogle,
  getBoardsForUser,
  addDocToCollection,
  getDocFromCollection,
  addStarterListsToBoard,
  deleteBoard,
  updateDoc,
  getListsForBoard,
  updateList,
  deleteList,
  createNewList,
  updateListsOrder,
  addJob,
  getJobsForBoard,
  deleteJobsInList,
  fetchJobData,
  updateJob,
  deleteJob,
  db,
  auth
}

export default app

