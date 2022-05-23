import {useEffect, useState} from 'react'
import {Image, Box, Text, Button, HStack, Link, Flex} from '@chakra-ui/react'
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
                <Box display="flex" justifyContent="center" my="20px">
                    <Image src="/assets/logo.png"  w="150px"/>
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