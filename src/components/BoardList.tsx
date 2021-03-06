import { SyntheticEvent, useRef, useEffect, useState } from 'react'
import { Center, Button, Stack, Input, Text, HStack, Menu, MenuButton, MenuList, MenuItem, IconButton, Spacer } from '@chakra-ui/react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { HiOutlinePlus } from 'react-icons/hi'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteForever } from 'react-icons/md'
import { updateList } from '../lib/firebase'
import { useBoardsContext, useAuthContext } from '../context'
import { JobType } from '../context/board'
import JobCard from './JobCard'
import { Droppable } from 'react-beautiful-dnd'

import { ListProps } from '../context/board'



const BoardList = ({ list }: { list: ListProps }) => {

  let inputRef = useRef<HTMLInputElement>(null)
  const [listName, setListName] = useState(list.name)
  const { activeBoard, deleteList, addJob, jobs, filteredJobs, updateList: updateListInContext } = useBoardsContext()
  const { user } = useAuthContext()
  //const [jobsForList, setJobsForList] = useState<JobType[]>([])


  const listNameChangeHandler = (e: SyntheticEvent) => {
    let input = (e.target as HTMLInputElement)
    setListName(input.value)
  }

  const onBlurHandler = async (e: SyntheticEvent) => {
    if (list.name === listName) {
      //dont update if the name is the same
      return
    }
    let input = (e.target as HTMLInputElement)
    setListName(input.value)
    await updateList(list.id, { name: input.value })
    updateListInContext({ id: list.id, name: input.value, order_id: list.order_id, board_id: list.board_id })
    console.log('save to firebase');
  }

  const focusNameInput = () => {
    inputRef.current?.focus()
  }

  const deleteListHandler = async () => {
    deleteList(list.id)
  }

  const addJobHandler = async () => {
    if (!user || !activeBoard) {
      return
    }
    let newJob = await addJob(activeBoard?.id, list.id, user?.uid)
    //console.log(newJob);
  }

  let jobsForList = filteredJobs.filter((job: any) => job.list_id === list.id)



  return (
    <Stack minW="300px" h="full" borderRight="1px" borderColor="gray.200">
      <HStack px="10px" h="40px" mt="10px" alignItems={'center'}>
        <Input onBlur={onBlurHandler} placeholder="List Name" ref={inputRef} variant='filled' value={listName} onInput={listNameChangeHandler} />
        <Spacer />
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<BsThreeDotsVertical />}
            variant='outline'
          />
          <MenuList>
            <MenuItem onClick={focusNameInput}>
              <FaRegEdit />
              <Text ml="10px">
                Edit
              </Text>
            </MenuItem>
            <MenuItem onClick={deleteListHandler}>
              <MdDeleteForever />
              <Text ml="10px">
                Delete
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      <Stack mb="10px">
        <Center>
          <Text fontSize="lg">
            {jobsForList.length} {" "} jobs
          </Text>
        </Center>
      </Stack>
      <Stack px="10px">
        <Button onClick={addJobHandler} mb="10px"><HiOutlinePlus /></Button>
      </Stack>
      <Droppable droppableId={list.id} key={list.id}>
        {
          (provided, snapshot) => {
            return (

              <Stack px="10px" flexGrow={1} bg={snapshot.isDraggingOver ? 'gray.200' : ''} pt="10px" {...provided.droppableProps} ref={provided.innerRef}>
                {jobsForList.map((job: any) => <JobCard job={job} key={job.id} />)}
              {provided.placeholder}
              </Stack>
            )
          }
        }
      </Droppable>
    </Stack>
  )
}

export default BoardList
