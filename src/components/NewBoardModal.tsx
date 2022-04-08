import {useState, SyntheticEvent, useRef, useEffect} from 'react'
import {Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input} from '@chakra-ui/react'
import {useModalsContext, useAuthContext, useBoardsContext} from '../context'
import {addDocToCollection, getDocFromCollection, addStarterListsToBoard, updateDoc} from '../lib/firebase'



const NewBoardModal = () => {


    const inputRef = useRef<HTMLInputElement>(null)
    const {user} = useAuthContext()
    const {newBoardModal, setNewBoardModal, newBoardModalUpdateMode} = useModalsContext()
    const {setBoards, boards} = useBoardsContext()

    const [boardName, setBoardName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if(newBoardModalUpdateMode != '') {
            let board = boards.find((board: any) => board.id === newBoardModalUpdateMode)
            setBoardName(board.name)
        }else {
            setBoardName('')
        }
    }, [newBoardModal])


    const onCloseHandler = () => {
        setNewBoardModal(false, '')
    }

    const createNewBoardHandler = async (e: SyntheticEvent) => {
        e.preventDefault()
        setIsLoading(true)
        if(newBoardModalUpdateMode === '') {
            const newBoard = await addDocToCollection('boards', {
                user_id: user?.uid,
                name: boardName,
                created_at: +new Date()
            })
            const newBoardFromDB = await getDocFromCollection('boards', newBoard.id)
            setBoards([...boards, newBoardFromDB])
            addStarterListsToBoard(newBoardFromDB.id)
            setNewBoardModal(false, '')
        } else {
            let updateBoardId = newBoardModalUpdateMode
            const updateBoard = await updateDoc('boards', updateBoardId, {name: boardName})
            setBoards(boards.map((board: any) => board.id === updateBoardId ? updateBoard : board))
            setNewBoardModal(false, '')
        }
        setIsLoading(false)
    }

    const setBoardNameHandler = (e: SyntheticEvent) => {
        let input = (e.target as HTMLInputElement)
        setBoardName(input.value)
    }

    return (
        <Modal onClose={onCloseHandler} isOpen={newBoardModal} isCentered initialFocusRef={inputRef}>
        <ModalOverlay />
        <ModalContent>
            <form onSubmit={createNewBoardHandler}>
                    <ModalHeader color="gray.600">
                        {newBoardModalUpdateMode === '' ? 'Create new board' : 'Update board'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input required={true} value={boardName} onInput={setBoardNameHandler} placeholder="Board Name" ref={inputRef}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button isLoading={isLoading} type="submit" colorScheme="blue" mx="auto">
                            {newBoardModalUpdateMode === '' ? 'Create' : 'Update'}
                        </Button>
                    </ModalFooter>
            </form>
        </ModalContent>
      </Modal>
    )
}


export default NewBoardModal