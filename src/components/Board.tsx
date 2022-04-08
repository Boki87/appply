import {Box,Stack,Button, Flex, HStack, Text} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {getListsForBoard} from '../lib/firebase'
import { useBoardsContext } from '../context'
import { BoardType } from '../context/board'
import BoardList from './BoardList'


const Board = () => {

    let {id} = useParams()
    const {lists, setLists, boards, createNewList, setActiveBoard, getJobsForBoard} = useBoardsContext()
    const [board, setBoard] = useState<BoardType | null>(null)


    async function getListsForBoardHandler() {
        let listsFromFirebase = await getListsForBoard(id)
        setLists(listsFromFirebase)
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


    useEffect(() => {
        if(!id) {
            return
        }
        getActiveBoard(id)
        getListsForBoardHandler()    
    }, [id])

    return (<Box bg="gray.50" w="full" display="flex" flexDirection="column" overflow="hidden">
        <HStack h="50px" bg="white" px="20px" borderBottom="1px" borderColor="gray.300">
            <Text>{board && board.name}</Text>
        </HStack>
        <Box w="full" flexGrow={1} overflowX="auto">
            <Box h="full">
                <Flex h="full">
                  {lists && lists.map((list: any) => <BoardList list={list} key={list.id}/>)}
                  <Stack minW="300px" h="full" p="15px">
                    <Button onClick={addNewListHandler}>Add List</Button>
                  </Stack>
                </Flex>
            </Box>
        </Box>
    </Box>)
}

export default Board