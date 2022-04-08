import {useState, SyntheticEvent} from 'react'
import { Button, Flex, Text } from "@chakra-ui/react"
import {BoardType} from '../context/board'
import {FiTrash} from 'react-icons/fi'
import {useBoardsContext} from '../context'
import {useNavigate, useLocation, useParams} from 'react-router-dom'


type BoardButtonProps = {
    board: BoardType,
    activeId: string
}

const SidebarBoardButton = ({board, activeId}: BoardButtonProps) => {

    let {id} = useParams()
    let location = useLocation()
    let navigate = useNavigate()
    const {deleteBoard} = useBoardsContext()
    const [showDeleteButton, setShowDeleteButton] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isActiveButton, setIsActiveButton] = useState(false)


    function deleteBoardHandler(e: SyntheticEvent) {
        e.stopPropagation()
        setIsLoading(true)
        console.log('delete board')
        navigate('/')
        deleteBoard(board.id)
    }

    function openBoard() {
        navigate(`/board/${board.id}`)
    }

    

    return (<Flex onClick={openBoard} onMouseEnter={() => setShowDeleteButton(true)} onMouseLeave={() => setShowDeleteButton(false)} bg={activeId == board.id ? 'gray.50' : 'white'} cursor="pointer" _hover={{bg:'gray.50'}} w="full" h="40px" alignItems={'center'} justifyContent={'space-between'} px={2} borderRadius={5} mb={2}>
        <Text>
            {board.name}
        </Text>
        {isLoading || showDeleteButton ? <Button isLoading={isLoading} onClick={deleteBoardHandler} size="sm">
            <FiTrash />
        </Button>
        : null}
        
    </Flex>)
}


export default SidebarBoardButton