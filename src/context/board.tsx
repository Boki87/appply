import { useState, useContext, useEffect, createContext, FC } from "react";
import { onAuthStateChanged, User as FirebaseUser  } from "firebase/auth";
import { createNewList, updateListsOrder } from "../lib/firebase.js";
import { deleteBoard, deleteList, addJob, getJobsForBoard } from "../lib/firebase.js";
import { ListProps } from "@chakra-ui/react";

type BoardsContextType = {
  boards: any[],
  isLoadingBoards: boolean,
  activeBoard: BoardType | null,
  lists: any[],
  setBoards: (boardsArr: any[]) => void,
  deleteBoard: (boardId: string) => void
  setActiveBoard: (activeBoard: BoardType) => void,
  setLists: (listsArr: any[]) => void,
  setIsLoadingBoards: (val: boolean) => void,
  deleteList: (listId: string) => void,
  createNewList: (boardId: string | undefined) => void,
  jobs: JobType[] | [],
  addJob: (boardId: string, userId: string, listId: string) => void,
  setJobs: (jobs: JobType[]) => void,
  getJobsForBoard: (boardId: string) => void
}


export type BoardType = {
    id: string,
    name: string,
    user_id: string,
    created_at: number,
}

export type JobType = {
  id: string,
  name: string,
  description: string,
  company: string,
  deadline: string,
  location: string,
  color: string,
  notes: string,
  user_id: string,
  board_id: string,
  list_id: string,
  created_at: number,
  order_id: number,
}

const BoardsContext = createContext<BoardsContextType>({ 
  boards: [], 
  activeBoard: null, 
  lists: [], 
  isLoadingBoards:false, 
  jobs: [], 
  addJob: () => {}, 
  setJobs: () => {}, 
  setBoards: () => {}, 
  deleteBoard: ()=> {}, 
  setActiveBoard: () => {}, 
  setLists: () => {}, 
  setIsLoadingBoards: () => {}, 
  deleteList: () => {}, 
  createNewList: () => {},
  getJobsForBoard: () => {} 
});

export const useBoardsContext = () => useContext(BoardsContext);


const BoardContextProvider: FC = ({ children }) => {
  const [boards, setBoards] = useState<any[]>([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [lists, setLists] = useState<any []>([]);
  const [isLoadingBoards, setIsLoadingBoards] = useState(false);
  const [jobs, setJobs] = useState<any[]>([])

  const setBoardsHandler = (boardsArr: any[]) => {
    setBoards(boardsArr);
  }

  const setActiveBoardHandler = (activeBoard: BoardType | any) => {
      setActiveBoard(activeBoard);
  }

  const setListsHandler = (listsArr: any[]) => {
    setLists(listsArr);
  }

  const deleteBoardHandler = async (boardId: string) => {

    try {
      await deleteBoard(boardId) 
      const newBoards = boards.filter((board: BoardType) => board.id !== boardId)
      setBoards(newBoards);

    }catch (err) {
      console.log(err);
    }
  }

  const deleteListHandler = async (id: string) => {
    await deleteList(id)
    let newLists = lists.filter((list: any) => list.id !== id)
    newLists.sort((a: any, b: any) => a.order_id - b.order_id)
    newLists = newLists.map((list: any, i: number) => {
      list.order_id = i
      return list
    })
    await updateListsOrder(newLists)
    setLists(newLists)
    //TODO: delete jobs in list
  }

  const createNewListHandler = async (boardId: string | undefined) => {
    try {
      const newList = await createNewList(boardId, {name:'',board_id: boardId, order_id: lists.length})
      const newLists = [...lists, newList]
      newLists.sort((a: ListProps, b: ListProps) => a.order_id - b.order_id)
      setLists(newLists)
    } catch (err) {
      console.log(err);
    }
  }


  const addJobHandler = async (boardId: string, listId: string,userId: string) => {
    //add job
    let orderId = jobs.filter((job: any) => job.list_id === listId).length
    let newJob = await addJob(boardId, listId, userId, orderId)
    let newJobs = [...jobs, newJob]
    newJobs.sort((a: any, b: any) => a.order_id - b.order_id)
    setJobs(newJobs)
  }

  const getJobsForBoardHandler = async (boardId: string) => {
    try {
      const jobs = await getJobsForBoard(boardId)
      setJobs(jobs)
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <BoardsContext.Provider value={{ boards,isLoadingBoards, activeBoard, lists, jobs, setBoards: setBoardsHandler, deleteBoard:deleteBoardHandler, setActiveBoard: setActiveBoardHandler, setLists: setListsHandler, setIsLoadingBoards, deleteList:deleteListHandler, createNewList:createNewListHandler, addJob: addJobHandler, setJobs, getJobsForBoard: getJobsForBoardHandler  }}>{children}</BoardsContext.Provider>
  );
};

export default BoardContextProvider;
