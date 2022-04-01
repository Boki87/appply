import { FC } from 'react'
import { Box, Button } from '@chakra-ui/react'
import { signMeOut } from '../lib/firebase'


const Home: FC = () => {
  return (
    <Box>
      Home
      <Button onClick={signMeOut}>Logout</Button>
    </Box>
  )
}


export default Home
