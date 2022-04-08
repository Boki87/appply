import {useEffect, useState} from 'react'
import {Box, Text, Button, HStack, Link, Flex} from '@chakra-ui/react'
import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom'
import {BsPlus} from 'react-icons/bs'
import {useBoardsContext, useAuthContext} from '../context'
import SidenavBoardButton from './SidenavBoardButton'
import { signMeOut } from '../lib/firebase'
import { useModalsContext } from '../context'


const SideNav = () => {

    let navigate = useNavigate()
    const { setNewBoardModal} = useModalsContext()
    const {boards, isLoadingBoards} = useBoardsContext()
    const [activeBoardId, setActiveBoardId] = useState('')
    let location = useLocation()

    useEffect(() => {
        if(location.pathname.includes('/board/')) {
            let boardId = location.pathname.split('/board/')[1]
            setActiveBoardId(boardId)
        }else{
            setActiveBoardId('')
        }
    }, [location.pathname])
    

    return (
        <Box minW="220px" borderRight='1px' borderColor='gray.200' display={{base: 'none', lg: 'flex'}} flexDirection="column">
            <Box w="150px" h="150px" borderRadius="100%" bg='gray.300' mx='auto' my="20px" color="white" display="flex" alignItems="center" justifyContent="center" fontSize='2xl'>
                    LOGO
            </Box>

            <Box p="4" display="flex" flexDirection="column" flexGrow={1}>
                <HStack justifyContent="space-between" mb="2" px="2">
                    <Link as={RouterLink} fontSize="md" to="/">
                            My Boards
                    </Link>
                    <Button onClick={() => setNewBoardModal(true, '')} size="sm">
                        <BsPlus />
                    </Button>
                </HStack>
                <Flex flexDirection={'column'}>
                    {isLoadingBoards && <Text>Loading...</Text>}
                    {!isLoadingBoards && boards.map(board => (<SidenavBoardButton board={board} activeId={activeBoardId} key={board.id}/>))}
                </Flex>
            </Box>

            <Flex h="60px" alignItems="center" justifyContent="center">
                <Button onClick={signMeOut} colorScheme={'blue'}>Log Out</Button>
            </Flex>
        </Box>
    )
}

export default SideNav