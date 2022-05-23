import { Box, Stack, Button, Flex, HStack, Text, Skeleton, InputGroup, Input, InputRightElement } from '@chakra-ui/react'
import { useEffect, useState, SyntheticEvent } from 'react'
import { useParams } from 'react-router-dom'
import { getListsForBoard } from '../lib/firebase'
import { useBoardsContext } from '../context'
import { BoardType, ListProps } from '../context/board'
import BoardList from './BoardList'
import JobModal from './JobModal'
import { CgList } from 'react-icons/cg'
import { BsSearch } from 'react-icons/bs'
import { DragDropContext } from 'react-beautiful-dnd'

const Board = () => {

  let { id } = useParams()
  const { lists, setLists, boards, createNewList, setActiveBoard, getJobsForBoard, updateJobPosition, setFilter } = useBoardsContext()
  const [board, setBoard] = useState<BoardType | null>(null)
  const [loadingLists, setLoadingLists] = useState(true)

  async function getListsForBoardHandler() {
    setLoadingLists(true)
    try {
      let listsFromFirebase = await getListsForBoard(id)
      setLists(listsFromFirebase)
      setLoadingLists(false)
    } catch (err) {
      console.log(err);
      setLoadingLists(false)
    }
  }

  function getActiveBoard(id: string | undefined) {
    let b = boards.find((board: any) => board.id === id)
    setBoard(b)
    setActiveBoard(b)
    getJobsForBoard(b.id)
  }


  async function addNewListHandler() {
    await createNewList(id)
  }


  function onDragEnd(result: any) {
    //console.log(result)
    let jobId = result.draggableId
    let listSource = result.source.droppableId
    let listDestination = result.destination.droppableId
    let destinationIndex = result.destination.index
    updateJobPosition(jobId, listSource, listDestination, destinationIndex)
  }


  function filterJobHandler(e: SyntheticEvent) {
    let input = e.target as HTMLInputElement
    let value = input.value
    setFilter(value)
  }


  useEffect(() => {
    if (!id) {
      return
    }
    getActiveBoard(id)
    getListsForBoardHandler()
  }, [id])

  return (<Box bg="gray.50" w="full" display="flex" flexDirection="column" overflow="hidden">
    <HStack h="50px" bg="white" px="20px" borderBottom="1px" borderColor="gray.300">
      <Text>{board && board.name}</Text>
      <InputGroup w="300px" ml="10px">
        <Input onInput={filterJobHandler} type="search" placeholder="Filter Jobs" />
        <InputRightElement children={<BsSearch />} />
      </InputGroup>
    </HStack>
    <Box w="full" flexGrow={1} overflowX="auto">
      <Box h="full">
        <Flex h="full">

          {/* Loading state  */}
          {loadingLists && [1, 2, 3, 4, 5].map((s: number) => <Skeleton key={s} h="100%" minW="280px" mx="10px" my="10px" />)}

          {/* Map of all the lists in current board */}
          <DragDropContext onDragEnd={onDragEnd}>
            {!loadingLists && lists && lists.map((list: ListProps) => <BoardList list={list} key={list.id} />)}
          </DragDropContext>

          {/* Add new list button */}
          {!loadingLists && <Stack minW="300px" h="full" p="15px">
            <Button onClick={addNewListHandler}><CgList /> <Text ml="10px">Add List</Text></Button>

          </Stack>}
        </Flex>
      </Box>
    </Box>


    <JobModal />
  </Box>)
}

export default Board
