import { useState, useContext, useEffect, createContext, FC } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { createNewList, updateListsOrder } from "../lib/firebase.js";
import { deleteJob, deleteBoard, deleteList, addJob, getJobsForBoard, deleteJobsInList, updateJob } from "../lib/firebase.js";
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
  getJobsForBoard: (boardId: string) => void,
  updateList: (list: ListProps) => void,
  updateJob: (jobId: string, job: JobType) => void,
  deleteJob: (jobId: string) => void,
  updateJobPosition: (jobId: string, listSource: string, listDestination: string, destinationIndex: number) => void,
  filter: string,
  filteredJobs: JobType[],
  setFilter: (val: string) => void
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
  url: string,
  company_website: string,
}

const BoardsContext = createContext<BoardsContextType>({
  boards: [],
  activeBoard: null,
  lists: [],
  isLoadingBoards: false,
  jobs: [],
  addJob: () => { },
  setJobs: () => { },
  setBoards: () => { },
  deleteBoard: () => { },
  setActiveBoard: () => { },
  setLists: () => { },
  setIsLoadingBoards: () => { },
  deleteList: () => { },
  createNewList: () => { },
  getJobsForBoard: () => { },
  updateList: () => { },
  updateJob: () => { },
  deleteJob: () => { },
  updateJobPosition: () => { },
  filter: '',
  setFilter: () => { },
  filteredJobs: []
});

export const useBoardsContext = () => useContext(BoardsContext);


const BoardContextProvider: FC = ({ children }) => {
  const [boards, setBoards] = useState<any[]>([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [lists, setLists] = useState<any[]>([]);
  const [isLoadingBoards, setIsLoadingBoards] = useState(false);
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobType[]>([])
  const [filter, setFilter] = useState('')


  useEffect(() => {

    if (filter != '') {
      let fJobs = jobs.filter(job => job.name.trim().toLowerCase().includes(filter.trim().toLowerCase()))
      setFilteredJobs(fJobs)
    } else {
      setFilteredJobs(jobs)
    }

  }, [filter, jobs])

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

    } catch (err) {
      console.log(err);
    }
  }

  const updateList = (list: ListProps) => {
    const newLists = lists.map((listItem: any) => {
      if (listItem.id === list.id) {
        return { ...listItem, ...list };
      }
      return listItem;
    });
    setLists(newLists);
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
    await deleteJobsInList(id)
  }

  const createNewListHandler = async (boardId: string | undefined) => {
    try {
      const newList = await createNewList(boardId, { name: '', board_id: boardId, order_id: lists.length })
      const newLists = [...lists, newList]
      newLists.sort((a: ListProps, b: ListProps) => a.order_id - b.order_id)
      setLists(newLists)
    } catch (err) {
      console.log(err);
    }
  }


  const addJobHandler = async (boardId: string, listId: string, userId: string) => {
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

  const updateJobHandler = async (jobId: string, newJob: JobType) => {
    await updateJob(jobId, newJob)
    const newJobs = jobs.map((job: JobType) => {
      if (job.id === jobId) {
        return newJob;
      }
      return job;
    })

    setJobs(newJobs)
  }

  const deleteJobHandler = async (jobId: string) => {
    await deleteJob(jobId)
    const newJobs = jobs.filter((job: JobType) => job.id !== jobId)
    setJobs(newJobs)
  }


  const updateJobPosition = async (jobId: string, listSource: string, listDestination: string, destinationIndex: number) => {

    //TODO: rearange order and list of jobs
    //console.log(jobId, listSource, listDestination, destinationIndex)


    let targetJob = jobs.filter(job => job.id === jobId)[0]

    let newJobs = []
    //console.log(targetJob)

    if (listSource === listDestination) {
      //change location in same list
      let jobsCopyInBoard = jobs.filter(job => job.list_id === listSource)

      jobsCopyInBoard.splice(targetJob.order_id, 1)
      jobsCopyInBoard.splice(destinationIndex, 0, { ...targetJob, order_id: destinationIndex })
      jobsCopyInBoard = jobsCopyInBoard.map((job, index) => {
        return {
          ...job,
          order_id: index
        }
      })

      jobsCopyInBoard.sort((a: any, b: any) => {
        return a.order_id - b.order_id
      })


      newJobs = jobs.map(job => {
        let modifiedJob = jobsCopyInBoard.filter(j => j.id === job.id)[0]
        if (modifiedJob) {
          return modifiedJob
        } else {
          return job
        }

      })
      newJobs.sort((a: any, b: any) => a.order_id - b.order_id)
      //console.log(newJobs)
      setJobs(newJobs)
    } else {
      //change location from one list to another

      let sourceListJobs = jobs.filter(job => job.list_id === listSource)
      let destinationListJobs = jobs.filter(job => job.list_id === listDestination)

      sourceListJobs.splice(targetJob.order_id, 1)
      sourceListJobs = sourceListJobs.map((job, index) => {
        return { ...job, order_id: index }
      })
      sourceListJobs.sort((a: any, b: any) => a.order_id - b.order_id)

      destinationListJobs.splice(destinationIndex, 0, { ...targetJob, order_id: destinationIndex, list_id: listDestination })
      destinationListJobs = destinationListJobs.map((job, index) => {
        return { ...job, order_id: index }
      })
      destinationListJobs.sort((a: any, b: any) => a.order_id - b.order_id)

      let combinedNewJobs = [...sourceListJobs, ...destinationListJobs]

      newJobs = jobs.map(job => {
        let modifiedJob = combinedNewJobs.filter(j => j.id === job.id)[0]
        if (modifiedJob) {
          return modifiedJob
        } else {
          return job
        }

      })
      newJobs.sort((a: any, b: any) => a.order_id - b.order_id)
      setJobs(newJobs)
    }

    for (let i = 0; i < newJobs.length; i++) {
      let job = newJobs[i]
      await updateJob(job.id, job)
    }


  }






  return (
    <BoardsContext.Provider value={{ boards, isLoadingBoards, activeBoard, lists, jobs, setBoards: setBoardsHandler, deleteBoard: deleteBoardHandler, setActiveBoard: setActiveBoardHandler, setLists: setListsHandler, setIsLoadingBoards, deleteList: deleteListHandler, createNewList: createNewListHandler, addJob: addJobHandler, setJobs, getJobsForBoard: getJobsForBoardHandler, updateList, updateJob: updateJobHandler, deleteJob: deleteJobHandler, updateJobPosition, filter, setFilter, filteredJobs }}>{children}</BoardsContext.Provider>
  );
};

export default BoardContextProvider;
