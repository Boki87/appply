import { SyntheticEvent } from "react"
import { Box, HStack, Text, Button, Spacer } from "@chakra-ui/react"
import { BoardType } from "../context/board"
import {FiEdit2} from 'react-icons/fi'
import {returnTimeAgo} from '../lib'
import {useModalsContext} from '../context'
import {useNavigate} from 'react-router-dom'

type BoardCardProps = {
    board: BoardType
}

const BoardCard = ({board}: BoardCardProps) => {

    const {setNewBoardModal} = useModalsContext()
    let navigate = useNavigate()

    return (
        <Box onClick={() => {navigate(`/board/${board.id}`)}} minW="199px" minH="150px" borderRadius="md" bg="white" m="7px" shadow="sm" p="10px" display={'flex'} flexDirection={'column'} cursor="pointer" border='1px' borderColor='transparent' _hover={{border:'1px', borderColor:'gray.300'}}>
            <HStack>
                <Text>
                    {board.name}
                </Text>
                <Spacer />
                <Button onClick={(e: SyntheticEvent) => {e.stopPropagation(); setNewBoardModal(true, board.id)}} size="sm">
                    <FiEdit2 />
                </Button>
            </HStack>
            <Box flex="1" display={'flex'} alignItems="flex-end" justifyContent={"flex-start"}>
                <Text fontSize="sm" color="gray.600">
                    created{" "}{returnTimeAgo(board.created_at)}
                </Text>
            </Box>
        </Box>
    )
}

export default BoardCard