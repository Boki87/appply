import {SyntheticEvent, useRef, useEffect, useState} from 'react'
import {Button, Stack, Input, Text, HStack, Menu, MenuButton, MenuList, MenuItem, IconButton, Spacer} from '@chakra-ui/react'
import {BsThreeDotsVertical} from 'react-icons/bs'
import {updateList} from '../lib/firebase'
import { useBoardsContext, useAuthContext } from '../context'
import { JobType } from '../context/board'
import JobCard from './JobCard'

const BoardList = ({list}: any) => {

    let inputRef = useRef<HTMLInputElement>(null)
    const [listName, setListName ] = useState(list.name)
    const {activeBoard, deleteList, addJob, jobs} = useBoardsContext()
    const {user} = useAuthContext()
    const [jobsForList, setJobsForList] = useState<JobType[]>([])


    const listNameChangeHandler = (e: SyntheticEvent) => {
        let input = (e.target as HTMLInputElement)
        setListName(input.value)
    }

    const onBlurHandler = async (e: SyntheticEvent) => {
        if(list.name === listName) {
            //dont update if the name is the same
            return
        }
        let input = (e.target as HTMLInputElement)
        setListName(input.value)
        await updateList(list.id, {name: input.value})
        console.log('save to firebase');
    }

    const focusNameInput = () => {
        inputRef.current?.focus()
    }

    const deleteListHandler = async () => {
        deleteList(list.id)
    }

    const addJobHandler = async () => {
        if(!user || !activeBoard)  {
            return
        }
        let newJob = await addJob(activeBoard?.id, list.id, user?.uid)
        console.log(newJob);
    }

    useEffect(() => {
        let jobsForListRes = jobs.filter((job: any) => job.list_id === list.id)
        setJobsForList(jobsForListRes)
    }, [jobs])

    return (
        <Stack minW="300px" h="full" borderRight="1px" borderColor="gray.200">
            <HStack px="10px" h="70px" alignItems={'center'}>
                <Input onBlur={onBlurHandler} placeholder="List Name" ref={inputRef} variant='filled' value={listName} onInput={listNameChangeHandler}/>
                <Spacer />
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<BsThreeDotsVertical />}
                        variant='outline'
                    />
                    <MenuList>
                        <MenuItem  onClick={focusNameInput}>
                        Edit 
                        </MenuItem>
                        <MenuItem  onClick={deleteListHandler}>
                        Delete
                        </MenuItem>
                    </MenuList>
                    </Menu>
            </HStack>
            <Stack px="10px">
                <Button onClick={addJobHandler}>Add Job</Button>
            </Stack>
            <Stack px="10px" h="100px">
                {jobsForList.map((job: any) => <JobCard job={job} key={job.id}/>)}
            </Stack>
        </Stack>
    )
}

export default BoardList