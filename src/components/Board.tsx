import {Box,Stack,Button, Flex, HStack, Text, Skeleton} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {getListsForBoard} from '../lib/firebase'
import { useBoardsContext } from '../context'
import { BoardType } from '../context/board'
import BoardList from './BoardList'
import JobModal from './JobModal'
import {CgList} from 'react-icons/cg'

const Board = () => {

    let {id} = useParams()
    const {lists, setLists, boards, createNewList, setActiveBoard, getJobsForBoard} = useBoardsContext()
    const [board, setBoard] = useState<BoardType | null>(null)
    const [loadingLists, setLoadingLists] = useState(true)

    async function getListsForBoardHandler() {
        setLoadingLists(true)
        try {
            let listsFromFirebase = await getListsForBoard(id)
            setLists(listsFromFirebase)
            setLoadingLists(false)
        } catch(err) {
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

                    {/* Loading state  */}
                    {loadingLists && [1,2,3,4,5].map((s: number) => <Skeleton key={s} h="100%" minW="280px" mx="10px" my="10px"/>)}

                    {/* Map of all the lists in current board */}
                    {!loadingLists && lists && lists.map((list: any) => <BoardList list={list} key={list.id}/>)}

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