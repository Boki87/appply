import {Box, Text, Avatar, Stack} from '@chakra-ui/react'
import {JobType} from '../context/board'
import {useNavigate, useLocation} from 'react-router-dom'

type JobCardProps = {
    job: JobType
}


const JobCard = ({job}: JobCardProps) => {

    let navigate = useNavigate()
    let location = useLocation()


    const openJobModal = () => {
        navigate(`${location.pathname}?job=${job.id}`)
    }


    return (<Box onClick={openJobModal} w="full" minH="100px" borderRadius="md" p="10px" bg={job.color !== '' ? job.color : 'gray.100'} border="1px" borderColor="transparent" cursor="pointer" _hover={{borderColor: 'gray.300'}} display="flex">
        <Stack mr="15px">
            <Avatar size="sm" name={job.company}/>
        </Stack>
        <Stack flexGrow={1}>
            <Box flexGrow={1}>
                <Text fontWeight="bold" color="gray.600">{job.name}</Text>
                <Text color="gray.500" fontSize="sm">{job.company}</Text>
            </Box>
            <Box h="20px" alignItems="flex-end" w="full" textAlign="right">
                <Text fontSize="sm" color="gray.500">1 month</Text>
            </Box>
        </Stack>
    </Box>)
}

export default JobCard