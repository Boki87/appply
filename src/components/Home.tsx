import { FC } from 'react'
import {Spacer, Box, Button, Container, HStack, Text, Flex, Skeleton } from '@chakra-ui/react'
import { useBoardsContext } from '../context'
import BoardCard from './BoardCard'
import {BsPlus} from 'react-icons/bs'
import { useModalsContext } from '../context'

const Home: FC = () => {

  const {boards, isLoadingBoards} = useBoardsContext()
  const {setNewBoardModal} = useModalsContext()

  return (
    <Box w='full' bg="gray.50">
      <Container maxW="2xl" h="full" mx="auto" pt={'50px'}>
        <HStack borderBottom="1px" borderColor="gray.300" pb='10px' mb="20px">
          <Text fontSize="xl">
            Personal Boards
          </Text>
          <Spacer />
          <Button onClick={() => setNewBoardModal(true, '')} size="sm" fontSize="xl">
            <BsPlus />
          </Button>
        </HStack>

       <Flex w="full" flexWrap={'wrap'}>
        {isLoadingBoards && <>
          <Skeleton minW="199px" h="150px" m="7px" borderRadius="md" />
          <Skeleton minW="199px" h="150px" m="7px" borderRadius="md" />
          <Skeleton minW="199px" h="150px" m="7px" borderRadius="md" />
        </>}
         {!isLoadingBoards && boards.map(board => (<BoardCard board={board} key={board.id}/>))}
         {boards.length == 0 && <Text color="gray.600">No Boards ☹️. Create one...</Text>}
         </Flex> 
      </Container>
    </Box>
  )
}


export default Home
