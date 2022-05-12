import {useState, SyntheticEvent, useRef, useEffect} from 'react'
import {HStack, FormControl, FormLabel, Box, Text, Center, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, Tabs, Tab, TabList, TabPanels, TabPanel, Textarea, InputGroup, InputRightElement} from '@chakra-ui/react'
import {useSearchParams, useLocation, useNavigate} from 'react-router-dom'
import {fetchJobData} from '../lib/firebase'
import {BsInfoCircle, BsSave} from 'react-icons/bs'
import {CgNotes} from 'react-icons/cg'
import {RiDeleteBinLine} from 'react-icons/ri'
import {useBoardsContext} from '../context'
import {IoMdOpen} from 'react-icons/io'

type JobModalProps = {
    isOpen: boolean,
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

const JobModal = ({}) => {

    const [job, setJob] = useState<any>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [deadline, setDeadline] = useState('')
    const query = useQuery()
    let navigate = useNavigate()
    let location = useLocation()

    const {updateJob, deleteJob} = useBoardsContext()



    const submitHandler = async (e: SyntheticEvent) => {
        e.preventDefault()
        try {
            setIsSaving(true)
            await updateJob(job.id, job)
            setIsSaving(false)
        }catch(err) {
            console.log(err)
            setIsSaving(false)
        }
    }

    const closeModal = () => {
        navigate(location.pathname)
    }

    async function fetchJob(id: string) {
        try {
            setIsLoading(true)
            let jobRes = await fetchJobData(id)
            setJob(jobRes)
            setIsLoading(false)
        }catch (err) {
            console.log(err)
            setIsLoading(false)
            setJob(null)
        }
    }


    function onInputHandler(e: SyntheticEvent) {
        let input = e.target as HTMLInputElement
        let value = input.value
        setJob({...job, [input.name]: value})
    }

    function onDateChangeHandler(e: SyntheticEvent) {
        let input = e.target as HTMLInputElement
        let value = input.value
        let timestamp = new Date(value).getTime()
        setJob({...job, [input.name]: timestamp})
    }

    function deleteHandler(e: SyntheticEvent) {
        e.preventDefault()
        try {
            setIsSaving(true)
            deleteJob(job.id)
            setIsOpen(false)
            setIsSaving(false)
        }catch (err) {
            console.log(err);
            setIsSaving(false)
        }
    }


    function openLink(prop: string) {
        if(!job || job?.[prop] == '' ) return
        window.open(job[prop], '_blank')
    }

    
    useEffect(() => {
        if(job) {
            let date = new Date(job.deadline)
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0"); // month is zero-based
            const dd = String(date.getDate()).padStart(2, "0");
            const formatted = `${yyyy}-${mm}-${dd}`;
            setDeadline(formatted)
        }else {
            setDeadline('')
        }
    }, [job])


    useEffect(() => {
        let jobId = query.get('job')
        if(jobId) {
            setIsOpen(true)
            fetchJob(jobId)
        } else {
            setIsOpen(false)
            setJob(null)
        }
    }, [location.search])
                    
    return (
        <Modal onClose={closeModal} isOpen={isOpen} size="3xl" isCentered>
        <ModalOverlay />
        <ModalContent>
            {isLoading && (
                <>
                    <ModalHeader></ModalHeader>
                    <ModalBody>
                        <Center>
                            <Spinner />
                        </Center>
                    </ModalBody>
                </>
            )}
            {!isLoading && job && (
                <form onSubmit={submitHandler}>
                        <ModalHeader color="gray.600">
                            {job.name}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Tabs>
                                <TabList>
                                    <Tab><Text mr="10px">Job Info</Text> <BsInfoCircle /></Tab>
                                    <Tab><Text mr="10px">Job Notes</Text> <CgNotes /></Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <Box>
                                            <HStack mb="10px">
                                                <FormControl>
                                                    <FormLabel>Job Name</FormLabel>
                                                    <Input value={job.name} name="name" onInput={onInputHandler}/>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Company</FormLabel>
                                                    <Input value={job.company} name="company" onInput={onInputHandler}/>
                                                </FormControl>
                                            </HStack>
                                            <HStack mb="10px">
                                                <FormControl>
                                                    <FormLabel>Location</FormLabel>
                                                    <Input value={job.location} name="location" onInput={onInputHandler}/>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Deadline</FormLabel>
                                                    <Input type="date" value={deadline} name="deadline" onInput={onDateChangeHandler}/>
                                                </FormControl>
                                            </HStack>
                                            <HStack mb="10px">
                                                <FormControl>
                                                    <FormLabel>Post Url</FormLabel>
                                                    <InputGroup>
                                                        <Input type="text" value={job.url} name="url" onInput={onInputHandler}/>
                                                        <InputRightElement w="4.5rem">
                                                            <Button onClick={() => openLink('url')} size="sm" mr="-1.5rem">
                                                                <IoMdOpen />
                                                            </Button>
                                                        </InputRightElement>
                                                    </InputGroup>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Company Website</FormLabel>
                                                    <InputGroup>
                                                        <Input type="text" value={job.company_website} name="company_website" onInput={onInputHandler}/>
                                                        <InputRightElement w="4.5rem">
                                                            <Button onClick={ () => openLink('company_website')} size="sm" mr="-1.5rem">
                                                                <IoMdOpen />
                                                            </Button>
                                                        </InputRightElement>
                                                    </InputGroup>
                                                </FormControl>
                                            </HStack>
                                            <FormControl>
                                                <FormLabel>Description</FormLabel>
                                                <Textarea value={job.description} name="description" onInput={onInputHandler}/>
                                            </FormControl>
                                        </Box>   
                                    </TabPanel>
                                    <TabPanel>Notes</TabPanel>
                                </TabPanels>
                            </Tabs>
                        </ModalBody>
                        <ModalFooter>
                            <Center w="full">

                                <Button isLoading={isSaving} type="submit" colorScheme="blue" mx="5px" rightIcon={<BsSave />}>
                                    Save
                                </Button>
                                <Button isLoading={isSaving} onClick={deleteHandler} mx="5px" rightIcon={<RiDeleteBinLine />}>
                                    Delete
                                </Button>
                            </Center>
                        </ModalFooter>
                </form>
            )}
        </ModalContent>
      </Modal>
    )
}


export default JobModal